import React, { useState } from 'react';
import { Save, Check, Shield, Download, UploadCloud, BookOpen, Key } from 'lucide-react';
import { StoreContent } from '../../types/index.ts';
import { updateStoreSettings, downloadDatabaseBackup, restoreDatabaseBackup } from '../../services/api.ts';

interface AdminSettingsProps {
  content: StoreContent;
  onContentUpdated: (updated: StoreContent) => void;
}

export const AdminSettings: React.FC<AdminSettingsProps> = ({ content, onContentUpdated }) => {
  const [storeInfo, setStoreInfo] = useState(content.storeInfo);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordMsg, setPasswordMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const [savingSettings, setSavingSettings] = useState(false);
  const [settingsSuccess, setSettingsSuccess] = useState(false);
  const [restoreStatus, setRestoreStatus] = useState<string | null>(null);

  const handleSaveStoreInfo = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingSettings(true);
    try {
      const res = await updateStoreSettings({ storeInfo });
      if (res.success) {
        onContentUpdated({ ...content, storeInfo });
        setSettingsSuccess(true);
        setTimeout(() => setSettingsSuccess(false), 3000);
      }
    } finally {
      setSavingSettings(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordMsg(null);
    if (!currentPassword) {
      setPasswordMsg({ type: 'error', text: 'Ingresa la contraseña actual.' });
      return;
    }
    if (newPassword.length < 6) {
      setPasswordMsg({ type: 'error', text: 'La nueva contraseña debe tener al menos 6 caracteres.' });
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordMsg({ type: 'error', text: 'Las nuevas contraseñas no coinciden.' });
      return;
    }

    try {
      const res = await updateStoreSettings({ currentPassword, newPassword });
      if (res.success) {
        setPasswordMsg({ type: 'success', text: '¡Contraseña actualizada exitosamente en el servidor!' });
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
      } else {
        setPasswordMsg({ type: 'error', text: res.error || 'Error al cambiar contraseña' });
      }
    } catch (e: any) {
      setPasswordMsg({ type: 'error', text: 'Error al comunicarse con el servidor' });
    }
  };

  const handleRestoreFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async () => {
      try {
        const json = JSON.parse(reader.result as string);
        const ok = await restoreDatabaseBackup(json);
        if (ok) {
          setRestoreStatus('¡Copia de seguridad restaurada exitosamente! Recargando datos...');
          setTimeout(() => window.location.reload(), 1500);
        } else {
          setRestoreStatus('Error: Formato de respaldo incompatible.');
        }
      } catch (err) {
        setRestoreStatus('Error al leer el archivo JSON.');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="space-y-8">
      {/* 1. Store Information & Contact */}
      <form onSubmit={handleSaveStoreInfo} className="bg-white p-6 border border-[#D4C4A8] space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-[#E6D5B8]/60 gap-2">
          <div>
            <h4 className="text-xs font-extrabold uppercase tracking-wider text-[#111111]">
              1. Información Comercial y Canales de Contacto
            </h4>
            <p className="text-[11px] text-[#666]">
              Datos visibles en el pie de página, encabezado y enlaces de WhatsApp.
            </p>
          </div>
          <button
            type="submit"
            disabled={savingSettings}
            className="px-5 py-2 bg-[#111111] hover:bg-[#9E8B6E] text-[#F9F8F5] text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2"
          >
            <Save className="w-3.5 h-3.5" />
            <span>{savingSettings ? 'Guardando...' : 'Guardar Información'}</span>
          </button>
        </div>

        {settingsSuccess && (
          <div className="p-2.5 bg-emerald-100 border border-emerald-300 text-emerald-800 text-xs font-bold flex items-center gap-2">
            <Check className="w-4 h-4" />
            <span>Información comercial guardada con éxito.</span>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold uppercase text-[#111111] mb-1">Nombre Comercial</label>
            <input
              type="text"
              value={storeInfo.name}
              onChange={(e) => setStoreInfo({ ...storeInfo, name: e.target.value })}
              className="w-full bg-[#F9F8F5] border border-[#D4C4A8] px-3 py-1.5 text-xs focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-[#111111] mb-1">Ubicación / Ciudad</label>
            <input
              type="text"
              value={storeInfo.location}
              onChange={(e) => setStoreInfo({ ...storeInfo, location: e.target.value })}
              className="w-full bg-[#F9F8F5] border border-[#D4C4A8] px-3 py-1.5 text-xs focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-[#111111] mb-1">Teléfono / WhatsApp Oficial</label>
            <input
              type="text"
              value={storeInfo.phone}
              onChange={(e) => setStoreInfo({ ...storeInfo, phone: e.target.value })}
              className="w-full bg-[#F9F8F5] border border-[#D4C4A8] px-3 py-1.5 text-xs focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-[#111111] mb-1">Número WhatsApp Numérico (wa.me)</label>
            <input
              type="text"
              value={storeInfo.whatsappRaw}
              onChange={(e) => setStoreInfo({ ...storeInfo, whatsappRaw: e.target.value })}
              placeholder="50433056175"
              className="w-full bg-[#F9F8F5] border border-[#D4C4A8] px-3 py-1.5 text-xs focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-[#111111] mb-1">Correo Electrónico</label>
            <input
              type="email"
              value={storeInfo.email}
              onChange={(e) => setStoreInfo({ ...storeInfo, email: e.target.value })}
              className="w-full bg-[#F9F8F5] border border-[#D4C4A8] px-3 py-1.5 text-xs focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-[#111111] mb-1">Moneda Oficial</label>
            <input
              type="text"
              disabled
              value="Lempiras Hondureños (L. HNL)"
              className="w-full bg-[#EAEAEA] border border-[#D4C4A8] px-3 py-1.5 text-xs text-[#555] cursor-not-allowed"
            />
          </div>
        </div>

        {/* Social Links */}
        <div className="pt-3 border-t border-[#E6D5B8]/60 space-y-3">
          <h5 className="text-xs font-bold uppercase text-[#9E8B6E]">Enlaces a Redes Sociales</h5>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-[10px] font-bold uppercase text-[#111111] mb-1">Facebook URL</label>
              <input
                type="text"
                value={storeInfo.social.facebook}
                onChange={(e) =>
                  setStoreInfo({
                    ...storeInfo,
                    social: { ...storeInfo.social, facebook: e.target.value }
                  })
                }
                className="w-full bg-[#F9F8F5] border border-[#D4C4A8] px-2.5 py-1 text-xs"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold uppercase text-[#111111] mb-1">Instagram URL</label>
              <input
                type="text"
                value={storeInfo.social.instagram}
                onChange={(e) =>
                  setStoreInfo({
                    ...storeInfo,
                    social: { ...storeInfo.social, instagram: e.target.value }
                  })
                }
                className="w-full bg-[#F9F8F5] border border-[#D4C4A8] px-2.5 py-1 text-xs"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold uppercase text-[#111111] mb-1">TikTok URL</label>
              <input
                type="text"
                value={storeInfo.social.tiktok}
                onChange={(e) =>
                  setStoreInfo({
                    ...storeInfo,
                    social: { ...storeInfo.social, tiktok: e.target.value }
                  })
                }
                className="w-full bg-[#F9F8F5] border border-[#D4C4A8] px-2.5 py-1 text-xs"
              />
            </div>
          </div>
        </div>
      </form>

      {/* 2. Security & Password Change */}
      <div className="bg-white p-6 border border-[#D4C4A8] space-y-4">
        <div className="pb-3 border-b border-[#E6D5B8]/60">
          <h4 className="text-xs font-extrabold uppercase tracking-wider text-[#111111] flex items-center gap-2">
            <Key className="w-4 h-4 text-[#9E8B6E]" />
            <span>2. Seguridad, Hash SHA-256 y Acceso Secreto</span>
          </h4>
          <p className="text-[11px] text-[#666]">
            Las contraseñas se almacenan mediante hash criptográfico <strong>SHA-256</strong> con Salt en el servidor. El ingreso al CMS se realiza con los atajos secretos: <kbd className="bg-[#EEE] px-1.5 py-0.5 text-[#111] font-mono text-[10px]">Ctrl + Shift + K</kbd> (K de KAS Store), <kbd className="bg-[#EEE] px-1.5 py-0.5 text-[#111] font-mono text-[10px]">Ctrl + Alt + A</kbd>, o triple clic en el texto <kbd className="bg-[#EEE] px-1.5 py-0.5 text-[#111] font-mono text-[10px]">© 2026 KAS Store</kbd> del footer.
          </p>
        </div>

        {passwordMsg && (
          <div
            className={`p-2.5 text-xs font-bold border ${
              passwordMsg.type === 'success'
                ? 'bg-emerald-50 border-emerald-300 text-emerald-800'
                : 'bg-red-50 border-red-300 text-red-800'
            }`}
          >
            {passwordMsg.text}
          </div>
        )}

        <form onSubmit={handleChangePassword} className="space-y-3 max-w-md">
          <div>
            <label className="block text-xs font-bold uppercase text-[#111111] mb-1">Contraseña Actual *</label>
            <input
              type="password"
              required
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="••••••••••••"
              className="w-full bg-[#F9F8F5] border border-[#D4C4A8] px-3 py-1.5 text-xs focus:outline-none"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold uppercase text-[#111111] mb-1">Nueva Contraseña *</label>
              <input
                type="password"
                required
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Mínimo 6 caracteres"
                className="w-full bg-[#F9F8F5] border border-[#D4C4A8] px-3 py-1.5 text-xs focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase text-[#111111] mb-1">Confirmar Nueva *</label>
              <input
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Repite la contraseña"
                className="w-full bg-[#F9F8F5] border border-[#D4C4A8] px-3 py-1.5 text-xs focus:outline-none"
              />
            </div>
          </div>
          <button
            type="submit"
            className="px-5 py-2 bg-[#111111] hover:bg-[#9E8B6E] text-[#F9F8F5] text-xs font-bold uppercase tracking-wider transition-colors"
          >
            Actualizar Contraseña
          </button>
        </form>
      </div>

      {/* 3. Database Backup & Restore */}
      <div className="bg-white p-6 border border-[#D4C4A8] space-y-4">
        <div className="pb-3 border-b border-[#E6D5B8]/60">
          <h4 className="text-xs font-extrabold uppercase tracking-wider text-[#111111] flex items-center gap-2">
            <Shield className="w-4 h-4 text-[#9E8B6E]" />
            <span>3. Respaldo y Recuperación de la Base de Datos</span>
          </h4>
          <p className="text-[11px] text-[#666]">
            Exporta o restaura en cualquier momento todo el catálogo, inventarios, imágenes y pedidos de KAS Store en un archivo JSON portátil.
          </p>
        </div>

        {restoreStatus && (
          <div className="p-2.5 bg-blue-50 border border-blue-200 text-blue-900 text-xs font-medium">
            {restoreStatus}
          </div>
        )}

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
          <button
            type="button"
            onClick={downloadDatabaseBackup}
            className="px-5 py-2.5 bg-[#111111] hover:bg-[#9E8B6E] text-[#F9F8F5] text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2"
          >
            <Download className="w-4 h-4" />
            <span>Descargar Copia de Seguridad (JSON)</span>
          </button>

          <label className="px-5 py-2.5 bg-[#F2EBDD] hover:bg-[#E6D5B8] text-[#111111] border border-[#D4C4A8] text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer transition-colors">
            <UploadCloud className="w-4 h-4" />
            <span>Restaurar Copia desde Archivo</span>
            <input
              type="file"
              accept=".json,application/json"
              onChange={handleRestoreFile}
              className="hidden"
            />
          </label>
        </div>
      </div>

      {/* 4. Manual de Administración del CMS (Deliverables 10, 11, 12) */}
      <div className="bg-[#F2EBDD]/50 p-6 border border-[#D4C4A8] space-y-3">
        <h4 className="text-xs font-extrabold uppercase tracking-wider text-[#111111] flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-[#9E8B6E]" />
          <span>Manual de Operación KAS Store para el Propietario</span>
        </h4>
        <div className="text-xs text-[#555] space-y-2 leading-relaxed">
          <p>
            <strong>• Modificar precios e imágenes:</strong> Accede a la pestaña <em>"Productos"</em>, haz clic en el botón de lápiz de la prenda y cambia el precio en Lempiras o sube fotos nuevas.
          </p>
          <p>
            <strong>• Control de inventario por talla:</strong> Dentro de cada prenda puedes asignar la cantidad exacta para cada talla (28, 30, 32, 34, 36, etc. o S, M, L, XL). Al llegar a 0 unidades la talla se bloquea automáticamente para evitar sobreventas.
          </p>
          <p>
            <strong>• Proceso de Pedidos:</strong> Cuando un cliente pulsa <em>"Confirmar y abrir WhatsApp"</em>, el carrito se transfiere con el mensaje exacto a tu WhatsApp (+504 3305-6175) y se registra en la pestaña <em>"Historial de Pedidos"</em> de este panel.
          </p>
          <p>
            <strong>• Copias de seguridad periódicas:</strong> Recomendamos pulsar <em>"Descargar Copia de Seguridad"</em> semanalmente para tener un archivo seguro de todos tus productos y configuraciones.
          </p>
        </div>
      </div>
    </div>
  );
};
