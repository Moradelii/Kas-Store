import React, { useState } from 'react';
import { Lock, ArrowLeft, Shield, AlertCircle, ExternalLink, Key } from 'lucide-react';
import { adminLogin } from '../../services/api.ts';

interface AdminLoginProps {
  onLoginSuccess: () => void;
  onBackToStore: () => void;
}

export const AdminLogin: React.FC<AdminLoginProps> = ({ onLoginSuccess, onBackToStore }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);

    try {
      const result = await adminLogin(username, password);
      if (result.success) {
        onLoginSuccess();
      } else {
        setErrorMsg(result.error || 'Credenciales inválidas');
      }
    } catch (err: any) {
      setErrorMsg('Error al conectar con el servidor.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#111111] flex flex-col justify-center items-center p-4 selection:bg-[#E6D5B8] selection:text-[#111111]">
      <div className="w-full max-w-md bg-[#1A1A1A] border border-[#333] shadow-2xl p-8 sm:p-10 relative">
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={onBackToStore}
            className="inline-flex items-center gap-1.5 text-xs text-[#AAA] hover:text-[#E6D5B8] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Volver a la tienda</span>
          </button>

          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-[11px] text-[#E6D5B8] hover:text-white transition-colors"
            title="Abrir tienda en nueva pestaña"
          >
            <span>Ver Tienda Online</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>

        <div className="text-center space-y-2 mb-6">
          <div className="w-12 h-12 bg-[#252525] border border-[#E6D5B8]/40 text-[#E6D5B8] rounded-full flex items-center justify-center mx-auto mb-3">
            <Lock className="w-5 h-5 stroke-[1.75]" />
          </div>
          <h2 className="text-2xl font-extrabold tracking-widest text-[#F9F8F5] font-heading">
            KAS STORE · CMS
          </h2>
          <p className="text-xs text-[#AAA] tracking-wider uppercase">
            Panel de Control Administrativo
          </p>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-[#252525] border border-[#3A3A3A] text-[10px] text-[#E6D5B8] font-mono mt-1 text-center">
            <Key className="w-3 h-3 shrink-0" />
            <span>Atajos: Ctrl + Shift + K | Ctrl + Alt + A | Triple clic en © Footer</span>
          </div>
        </div>

        {errorMsg && (
          <div className="mb-6 p-3 bg-red-950/50 border border-red-800 text-red-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#E6D5B8] mb-1.5">
              Usuario
            </label>
            <input
              type="text"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="admin"
              className="w-full bg-[#111111] border border-[#444] text-[#F9F8F5] px-4 py-3 text-xs focus:outline-none focus:border-[#E6D5B8]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#E6D5B8] mb-1.5">
              Contraseña
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••••"
              className="w-full bg-[#111111] border border-[#444] text-[#F9F8F5] px-4 py-3 text-xs focus:outline-none focus:border-[#E6D5B8]"
            />
          </div>

          <div className="p-3 bg-[#111111] border border-[#333] text-[11px] text-[#888] space-y-1.5">
            <p className="flex items-center gap-1.5 text-[#E6D5B8] font-semibold">
              <Shield className="w-3.5 h-3.5" />
              <span>Autenticación Cifrada con Algoritmo SHA-256</span>
            </p>
            <p className="text-[10px] text-[#777]">
              Acceso restringido. Las credenciales se verifican en el servidor mediante hashing SHA-256 con Salt criptográfico.
            </p>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-[#E6D5B8] hover:bg-[#F9F8F5] text-[#111111] text-xs font-extrabold tracking-widest uppercase transition-colors shadow flex items-center justify-center gap-2"
          >
            <Lock className="w-4 h-4" />
            <span>{loading ? 'VERIFICANDO SHA-256...' : 'INICIAR SESIÓN'}</span>
          </button>
        </form>
      </div>
    </div>
  );
};
