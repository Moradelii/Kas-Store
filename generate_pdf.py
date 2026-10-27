#!/usr/bin/env python3
import os
import re

def text_to_pdf_pages(md_path, pdf_path):
    with open(md_path, 'r', encoding='utf-8') as f:
        lines = f.readlines()

    # Preprocess lines into styled lines: (type, text)
    # types: 'title', 'h1', 'h2', 'h3', 'code', 'bullet', 'text', 'empty'
    items = []
    in_code = False

    for line in lines:
        raw = line.rstrip('\r\n')
        if raw.startswith('```'):
            in_code = not in_code
            continue
        if in_code:
            items.append(('code', raw[:85]))
            continue
        
        stripped = raw.strip()
        if not stripped:
            items.append(('empty', ''))
        elif stripped.startswith('# '):
            items.append(('h1', stripped[2:]))
        elif stripped.startswith('## '):
            items.append(('h2', stripped[3:]))
        elif stripped.startswith('### '):
            items.append(('h3', stripped[4:]))
        elif stripped.startswith('- ') or stripped.startswith('* '):
            # Wrap bullet
            txt = '• ' + stripped[2:]
            words = txt.split(' ')
            cur = ''
            for w in words:
                if len(cur) + len(w) + 1 > 88:
                    items.append(('bullet' if cur.startswith('•') else 'sub_bullet', cur))
                    cur = '   ' + w
                else:
                    cur = (cur + ' ' + w).strip()
            if cur:
                items.append(('bullet' if cur.startswith('•') else 'sub_bullet', cur))
        elif re.match(r'^\d+\.\s', stripped):
            items.append(('bullet', stripped))
        elif stripped.startswith('|'):
            # Table row: simplify for PDF representation
            cells = [c.strip() for c in stripped.strip('|').split('|')]
            formatted = " | ".join(cells)
            items.append(('table', formatted[:85]))
        else:
            # Paragraph wrap
            words = stripped.split(' ')
            cur = ''
            for w in words:
                if len(cur) + len(w) + 1 > 88:
                    items.append(('text', cur))
                    cur = w
                else:
                    cur = (cur + ' ' + w).strip()
            if cur:
                items.append(('text', cur))

    # Paginate items
    # Page height 842, margin top 760, bottom 60 -> available height ~700
    # Line heights: h1: 26, h2: 20, h3: 16, code: 12, text: 12, empty: 6
    pages = []
    current_page = []
    current_y = 750

    for itype, text in items:
        lh = 12
        if itype == 'h1': lh = 28
        elif itype == 'h2': lh = 22
        elif itype == 'h3': lh = 17
        elif itype == 'empty': lh = 8
        elif itype == 'code': lh = 11

        if current_y - lh < 65:
            pages.append(current_page)
            current_page = []
            current_y = 750

        current_page.append((itype, text, current_y))
        current_y -= lh

    if current_page:
        pages.append(current_page)

    total_pages = len(pages)

    # Sanitize PDF text strings (escape parenthesis and backslashes, ascii fallback)
    def clean_pdf_str(s):
        s = s.replace('\\', '\\\\').replace('(', '\\(').replace(')', '\\)')
        # Replace non-ascii chars with standard latin1 or ascii
        rep = {
            'á': 'a', 'é': 'e', 'í': 'i', 'ó': 'o', 'ú': 'u',
            'Á': 'A', 'É': 'E', 'Í': 'I', 'Ó': 'O', 'Ú': 'U',
            'ñ': 'n', 'Ñ': 'N', '•': '*', '—': '-', '–': '-',
            '“': '"', '”': '"', '‘': "'", '’': "'", '¿': '', '¡': ''
        }
        for k, v in rep.items():
            s = s.replace(k, v)
        # remove anything else non-ascii
        return "".join([c if 32 <= ord(c) <= 126 else ' ' for c in s])

    # Build PDF Objects
    # 1: Catalog
    # 2: Pages root
    # 3: Font F1 (Helvetica)
    # 4: Font F2 (Helvetica-Bold)
    # 5: Font F3 (Courier)
    # 6..(6 + total_pages - 1): Page objects
    # (6 + total_pages) .. : Content streams

    page_obj_ids = [6 + i for i in range(total_pages)]
    content_obj_ids = [6 + total_pages + i for i in range(total_pages)]

    objects = {}

    # Catalog
    objects[1] = b'<< /Type /Catalog /Pages 2 0 R >>'
    # Pages
    kids_str = " ".join([f"{pid} 0 R" for pid in page_obj_ids])
    objects[2] = f'<< /Type /Pages /Kids [{kids_str}] /Count {total_pages} >>'.encode('ascii')
    # Fonts
    objects[3] = b'<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>'
    objects[4] = b'<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >>'
    objects[5] = b'<< /Type /Font /Subtype /Type1 /BaseFont /Courier >>'

    # Content streams and Pages
    for idx, page in enumerate(pages):
        p_num = idx + 1
        page_id = page_obj_ids[idx]
        cont_id = content_obj_ids[idx]

        # Page Object
        objects[page_id] = (
            f'<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] '
            f'/Resources << /Font << /F1 3 0 R /F2 4 0 R /F3 5 0 R >> >> '
            f'/Contents {cont_id} 0 R >>'
        ).encode('ascii')

        # Stream content
        stream_cmds = []
        # Header line
        stream_cmds.append('BT /F2 8 Tf 0.5 0.35 0.15 rg 50 800 Td (KAS STORE - GUIA TECNICA Y MAPA DE ARCHIVOS | LA MASICA, HONDURAS) Tj ET')
        stream_cmds.append('0.8 0.75 0.7 rg 50 792 495 1 re f')

        # Footer line
        footer_txt = f"Pagina {p_num} de {total_pages} | KAS Store - Mora-Grafic's Studio"
        stream_cmds.append('0.8 0.75 0.7 rg 50 48 495 1 re f')
        stream_cmds.append(f'BT /F1 8 Tf 0.4 0.4 0.4 rg 50 36 Td ({footer_txt}) Tj ET')

        # Page Items
        for itype, text, ypos in page:
            cl_txt = clean_pdf_str(text)
            if not cl_txt:
                continue

            if itype == 'h1':
                stream_cmds.append(f'BT /F2 15 Tf 0.18 0.15 0.13 rg 50 {ypos} Td ({cl_txt}) Tj ET')
            elif itype == 'h2':
                stream_cmds.append(f'BT /F2 12 Tf 0.72 0.54 0.29 rg 50 {ypos} Td ({cl_txt}) Tj ET')
            elif itype == 'h3':
                stream_cmds.append(f'BT /F2 10 Tf 0.2 0.2 0.2 rg 50 {ypos} Td ({cl_txt}) Tj ET')
            elif itype == 'code' or itype == 'table':
                stream_cmds.append(f'BT /F3 8.5 Tf 0.15 0.25 0.35 rg 50 {ypos} Td ({cl_txt}) Tj ET')
            elif itype == 'bullet':
                stream_cmds.append(f'BT /F1 9 Tf 0.18 0.15 0.13 rg 50 {ypos} Td ({cl_txt}) Tj ET')
            elif itype == 'sub_bullet':
                stream_cmds.append(f'BT /F1 9 Tf 0.25 0.25 0.25 rg 50 {ypos} Td ({cl_txt}) Tj ET')
            else:
                stream_cmds.append(f'BT /F1 9 Tf 0.18 0.15 0.13 rg 50 {ypos} Td ({cl_txt}) Tj ET')

        stream_body = "\n".join(stream_cmds).encode('latin1', 'ignore')
        stream_obj = (
            f'<< /Length {len(stream_body)} >>\nstream\n'.encode('ascii') +
            stream_body +
            b'\nendstream'
        )
        objects[cont_id] = stream_obj

    # Assemble PDF with XREF table
    pdf_output = bytearray(b'%PDF-1.4\n')
    xref_offsets = {}

    all_ids = sorted(objects.keys())
    for obj_id in all_ids:
        xref_offsets[obj_id] = len(pdf_output)
        pdf_output.extend(f'{obj_id} 0 obj\n'.encode('ascii'))
        pdf_output.extend(objects[obj_id])
        pdf_output.extend(b'\nendobj\n')

    xref_pos = len(pdf_output)
    max_id = max(all_ids)
    pdf_output.extend(f'xref\n0 {max_id + 1}\n'.encode('ascii'))
    pdf_output.extend(b'0000000000 65535 f \n')
    for i in range(1, max_id + 1):
        if i in xref_offsets:
            pdf_output.extend(f'{xref_offsets[i]:010d} 00000 n \n'.encode('ascii'))
        else:
            pdf_output.extend(b'0000000000 65535 f \n')

    trailer = f'trailer\n<< /Size {max_id + 1} /Root 1 0 R >>\nstartxref\n{xref_pos}\n%%EOF\n'
    pdf_output.extend(trailer.encode('ascii'))

    with open(pdf_path, 'wb') as f:
        f.write(pdf_output)
    print(f"Generated {pdf_path} ({total_pages} pages, {len(pdf_output)} bytes)")

if __name__ == '__main__':
    base_dir = os.path.dirname(os.path.abspath(__file__))
    md_file = os.path.join(base_dir, 'GUIA_TECNICA_KAS_STORE.md')
    pdf_file = os.path.join(base_dir, 'GUIA_TECNICA_KAS_STORE.pdf')
    text_to_pdf_pages(md_file, pdf_file)
