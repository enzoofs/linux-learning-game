import { Component } from 'react';
import type { ReactNode, ErrorInfo } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    if (import.meta.env.DEV) {
      console.error('ErrorBoundary caught:', error, info.componentStack);
    }
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback ?? (
        <div className="min-h-screen bg-[#0c0f1a] font-mono text-gray-200 flex items-center justify-center p-8">
          <div className="text-center max-w-md">
            <div className="text-4xl mb-4">&#9888;&#65039;</div>
            <h1 className="text-xl font-bold text-red-400 mb-2">Algo deu errado</h1>
            <p className="text-slate-400 text-sm mb-6">
              Um erro inesperado aconteceu. Recarregue a pagina para continuar.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-3 bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 rounded-lg text-cyan-400 font-semibold text-sm transition-all cursor-pointer"
            >
              Recarregar
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
