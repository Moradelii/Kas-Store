import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  private handleReset = () => {
    try {
      localStorage.removeItem('kas_store_cart_v1');
    } catch {}
    window.location.hash = '';
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#F9F8F5] text-[#111111] flex flex-col items-center justify-center p-6 text-center font-sans">
          <div className="max-w-md w-full bg-white border border-[#D4C4A8] p-8 shadow-xl">
            <div className="w-12 h-12 bg-[#111111] text-[#E6D5B8] mx-auto flex items-center justify-center mb-4">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <h1 className="text-xl font-extrabold tracking-wide font-heading uppercase text-[#111111]">
              KAS STORE · RECUPERACIÓN
            </h1>
            <p className="text-xs text-[#666] mt-2 leading-relaxed">
              Ocurrió un contratiempo al procesar la vista. Hemos aislado el estado para que puedas recargar la tienda sin perder tu configuración.
            </p>
            {this.state.error?.message && (
              <div className="mt-4 p-3 bg-[#F2EBDD] text-[#888] text-[11px] font-mono text-left break-all border border-[#D4C4A8]/60">
                {this.state.error.message}
              </div>
            )}
            <div className="mt-6 flex flex-col gap-2">
              <button
                onClick={this.handleReset}
                className="w-full py-3 bg-[#111111] text-[#F9F8F5] hover:bg-[#9E8B6E] text-xs font-bold uppercase tracking-wider transition-colors flex items-center justify-center gap-2"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Restablecer y Recargar Tienda</span>
              </button>
              <button
                onClick={() => {
                  this.setState({ hasError: false, error: null });
                  window.location.hash = '';
                }}
                className="w-full py-3 bg-transparent border border-[#111111] text-[#111111] hover:bg-[#111111]/5 text-xs font-bold uppercase tracking-wider transition-colors flex items-center justify-center gap-2"
              >
                <Home className="w-4 h-4" />
                <span>Intentar reanudar</span>
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
