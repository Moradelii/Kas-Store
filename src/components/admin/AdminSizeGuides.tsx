import React, { useState } from 'react';
import { Save, Check, Plus, Trash2, Ruler } from 'lucide-react';
import { StoreContent, SizeGuideRow } from '../../types/index.ts';
import { updateStoreContent } from '../../services/api.ts';

interface AdminSizeGuidesProps {
  content: StoreContent;
  onContentUpdated: (updated: StoreContent) => void;
}

export const AdminSizeGuides: React.FC<AdminSizeGuidesProps> = ({ content, onContentUpdated }) => {
  const [guides, setGuides] = useState(content.sizeGuides);
  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  // New row temporary states
  const [newJeanRow, setNewJeanRow] = useState<SizeGuideRow>({
    size: '50',
    waist: '125 - 128',
    hip: '142 - 145',
    length: '112'
  });

  const [newTeeRow, setNewTeeRow] = useState<SizeGuideRow>({
    size: '3XL',
    chest: '126 - 130',
    shoulder: '54',
    length: '80'
  });

  const handleUpdateJeanRow = (index: number, key: string, value: string) => {
    const updatedRows = [...guides.jeans.rows];
    updatedRows[index] = { ...updatedRows[index], [key]: value };
    setGuides({
      ...guides,
      jeans: { ...guides.jeans, rows: updatedRows }
    });
  };

  const handleDeleteJeanRow = (index: number) => {
    const updatedRows = guides.jeans.rows.filter((_, i) => i !== index);
    setGuides({
      ...guides,
      jeans: { ...guides.jeans, rows: updatedRows }
    });
  };

  const handleAddJeanRow = () => {
    if (!newJeanRow.size) return;
    setGuides({
      ...guides,
      jeans: { ...guides.jeans, rows: [...guides.jeans.rows, newJeanRow] }
    });
  };

  const handleUpdateTeeRow = (index: number, key: string, value: string) => {
    const updatedRows = [...guides.camisetas.rows];
    updatedRows[index] = { ...updatedRows[index], [key]: value };
    setGuides({
      ...guides,
      camisetas: { ...guides.camisetas, rows: updatedRows }
    });
  };

  const handleDeleteTeeRow = (index: number) => {
    const updatedRows = guides.camisetas.rows.filter((_, i) => i !== index);
    setGuides({
      ...guides,
      camisetas: { ...guides.camisetas, rows: updatedRows }
    });
  };

  const handleAddTeeRow = () => {
    if (!newTeeRow.size) return;
    setGuides({
      ...guides,
      camisetas: { ...guides.camisetas, rows: [...guides.camisetas.rows, newTeeRow] }
    });
  };

  const handleSave = async () => {
    setSaving(true);
    setSavedSuccess(false);
    try {
      const updatedContent: StoreContent = {
        ...content,
        sizeGuides: guides
      };
      await updateStoreContent(updatedContent);
      onContentUpdated(updatedContent);
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Top Banner Notice */}
      <div className="bg-white p-5 border border-[#D4C4A8] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-sm font-bold uppercase tracking-wider text-[#111111] flex items-center gap-2">
            <Ruler className="w-4 h-4 text-[#9E8B6E]" />
            <span>Configuración Oficial de Tablas de Medidas</span>
          </h3>
          <p className="text-xs text-[#666]">
            Ajusta los centímetros de cintura, cadera, pecho, hombros y largo según la confección real de las prendas.
          </p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="px-6 py-2.5 bg-[#111111] hover:bg-[#9E8B6E] text-[#F9F8F5] text-xs font-bold uppercase tracking-widest transition-colors flex items-center justify-center gap-2 shadow"
        >
          <Save className="w-4 h-4" />
          <span>{saving ? 'Guardando...' : 'Guardar Medidas'}</span>
        </button>
      </div>

      {savedSuccess && (
        <div className="p-3 bg-emerald-100 border border-emerald-300 text-emerald-800 text-xs font-bold flex items-center gap-2">
          <Check className="w-4 h-4" />
          <span>Tablas de medidas actualizadas con éxito.</span>
        </div>
      )}

      {/* 1. Jeans Table */}
      <div className="bg-white p-6 border border-[#D4C4A8] space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-[#E6D5B8]/60">
          <h4 className="text-xs font-extrabold uppercase tracking-wider text-[#111111]">
            1. Tabla de Medidas para Jeans (Cintura, Cadera y Largo)
          </h4>
          <span className="text-[11px] text-[#777]">
            Valores en centímetros (cm)
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border border-[#D4C4A8]">
            <thead>
              <tr className="bg-[#111111] text-[#F9F8F5]">
                <th className="py-2.5 px-3">Talla</th>
                <th className="py-2.5 px-3">Cintura (cm)</th>
                <th className="py-2.5 px-3">Cadera (cm)</th>
                <th className="py-2.5 px-3">Largo (cm)</th>
                <th className="py-2.5 px-3 text-right">Acción</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E6D5B8]/50">
              {guides.jeans.rows.map((row, idx) => (
                <tr key={idx} className="hover:bg-[#F9F8F5]">
                  <td className="p-2">
                    <input
                      type="text"
                      value={row.size}
                      onChange={(e) => handleUpdateJeanRow(idx, 'size', e.target.value)}
                      className="w-16 bg-white border border-[#D4C4A8] px-2 py-1 font-bold text-center"
                    />
                  </td>
                  <td className="p-2">
                    <input
                      type="text"
                      value={row.waist}
                      onChange={(e) => handleUpdateJeanRow(idx, 'waist', e.target.value)}
                      className="w-full bg-white border border-[#D4C4A8] px-2 py-1 text-center"
                    />
                  </td>
                  <td className="p-2">
                    <input
                      type="text"
                      value={row.hip}
                      onChange={(e) => handleUpdateJeanRow(idx, 'hip', e.target.value)}
                      className="w-full bg-white border border-[#D4C4A8] px-2 py-1 text-center"
                    />
                  </td>
                  <td className="p-2">
                    <input
                      type="text"
                      value={row.length}
                      onChange={(e) => handleUpdateJeanRow(idx, 'length', e.target.value)}
                      className="w-full bg-white border border-[#D4C4A8] px-2 py-1 text-center"
                    />
                  </td>
                  <td className="p-2 text-right">
                    <button
                      onClick={() => handleDeleteJeanRow(idx)}
                      className="p-1 text-red-600 hover:text-red-800"
                      title="Eliminar fila"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Add Row Jeans */}
        <div className="p-3 bg-[#F2EBDD]/50 border border-[#D4C4A8] flex flex-wrap items-center gap-2">
          <span className="text-xs font-bold text-[#111111]">Nueva talla jeans:</span>
          <input
            type="text"
            placeholder="Talla (ej: 50)"
            value={newJeanRow.size}
            onChange={(e) => setNewJeanRow({ ...newJeanRow, size: e.target.value })}
            className="w-20 bg-white border border-[#D4C4A8] px-2 py-1 text-xs text-center"
          />
          <input
            type="text"
            placeholder="Cintura (cm)"
            value={newJeanRow.waist}
            onChange={(e) => setNewJeanRow({ ...newJeanRow, waist: e.target.value })}
            className="w-28 bg-white border border-[#D4C4A8] px-2 py-1 text-xs text-center"
          />
          <input
            type="text"
            placeholder="Cadera (cm)"
            value={newJeanRow.hip}
            onChange={(e) => setNewJeanRow({ ...newJeanRow, hip: e.target.value })}
            className="w-28 bg-white border border-[#D4C4A8] px-2 py-1 text-xs text-center"
          />
          <input
            type="text"
            placeholder="Largo (cm)"
            value={newJeanRow.length}
            onChange={(e) => setNewJeanRow({ ...newJeanRow, length: e.target.value })}
            className="w-24 bg-white border border-[#D4C4A8] px-2 py-1 text-xs text-center"
          />
          <button
            onClick={handleAddJeanRow}
            className="px-3 py-1 bg-[#111111] text-[#F9F8F5] text-xs font-bold uppercase hover:bg-[#9E8B6E]"
          >
            + Añadir Fila
          </button>
        </div>
      </div>

      {/* 2. Camisetas Table */}
      <div className="bg-white p-6 border border-[#D4C4A8] space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-[#E6D5B8]/60">
          <h4 className="text-xs font-extrabold uppercase tracking-wider text-[#111111]">
            2. Tabla de Medidas para Camisetas (Pecho, Hombros y Largo)
          </h4>
          <span className="text-[11px] text-[#777]">
            Valores en centímetros (cm)
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border border-[#D4C4A8]">
            <thead>
              <tr className="bg-[#111111] text-[#F9F8F5]">
                <th className="py-2.5 px-3">Talla</th>
                <th className="py-2.5 px-3">Pecho (cm)</th>
                <th className="py-2.5 px-3">Hombros (cm)</th>
                <th className="py-2.5 px-3">Largo (cm)</th>
                <th className="py-2.5 px-3 text-right">Acción</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E6D5B8]/50">
              {guides.camisetas.rows.map((row, idx) => (
                <tr key={idx} className="hover:bg-[#F9F8F5]">
                  <td className="p-2">
                    <input
                      type="text"
                      value={row.size}
                      onChange={(e) => handleUpdateTeeRow(idx, 'size', e.target.value)}
                      className="w-16 bg-white border border-[#D4C4A8] px-2 py-1 font-bold text-center"
                    />
                  </td>
                  <td className="p-2">
                    <input
                      type="text"
                      value={row.chest}
                      onChange={(e) => handleUpdateTeeRow(idx, 'chest', e.target.value)}
                      className="w-full bg-white border border-[#D4C4A8] px-2 py-1 text-center"
                    />
                  </td>
                  <td className="p-2">
                    <input
                      type="text"
                      value={row.shoulder}
                      onChange={(e) => handleUpdateTeeRow(idx, 'shoulder', e.target.value)}
                      className="w-full bg-white border border-[#D4C4A8] px-2 py-1 text-center"
                    />
                  </td>
                  <td className="p-2">
                    <input
                      type="text"
                      value={row.length}
                      onChange={(e) => handleUpdateTeeRow(idx, 'length', e.target.value)}
                      className="w-full bg-white border border-[#D4C4A8] px-2 py-1 text-center"
                    />
                  </td>
                  <td className="p-2 text-right">
                    <button
                      onClick={() => handleDeleteTeeRow(idx)}
                      className="p-1 text-red-600 hover:text-red-800"
                      title="Eliminar fila"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Add Row Camisetas */}
        <div className="p-3 bg-[#F2EBDD]/50 border border-[#D4C4A8] flex flex-wrap items-center gap-2">
          <span className="text-xs font-bold text-[#111111]">Nueva talla camiseta:</span>
          <input
            type="text"
            placeholder="Talla (ej: 3XL)"
            value={newTeeRow.size}
            onChange={(e) => setNewTeeRow({ ...newTeeRow, size: e.target.value })}
            className="w-20 bg-white border border-[#D4C4A8] px-2 py-1 text-xs text-center"
          />
          <input
            type="text"
            placeholder="Pecho (cm)"
            value={newTeeRow.chest}
            onChange={(e) => setNewTeeRow({ ...newTeeRow, chest: e.target.value })}
            className="w-28 bg-white border border-[#D4C4A8] px-2 py-1 text-xs text-center"
          />
          <input
            type="text"
            placeholder="Hombros (cm)"
            value={newTeeRow.shoulder}
            onChange={(e) => setNewTeeRow({ ...newTeeRow, shoulder: e.target.value })}
            className="w-28 bg-white border border-[#D4C4A8] px-2 py-1 text-xs text-center"
          />
          <input
            type="text"
            placeholder="Largo (cm)"
            value={newTeeRow.length}
            onChange={(e) => setNewTeeRow({ ...newTeeRow, length: e.target.value })}
            className="w-24 bg-white border border-[#D4C4A8] px-2 py-1 text-xs text-center"
          />
          <button
            onClick={handleAddTeeRow}
            className="px-3 py-1 bg-[#111111] text-[#F9F8F5] text-xs font-bold uppercase hover:bg-[#9E8B6E]"
          >
            + Añadir Fila
          </button>
        </div>
      </div>
    </div>
  );
};
