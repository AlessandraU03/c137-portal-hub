import { Component, type ErrorInfo, type ReactNode } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
  };

  public static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  public handleReset = () => {
    this.setState({ hasError: false });
    window.location.href = '/';
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-[50vh] flex flex-col items-center justify-center p-6 text-center font-mono max-w-md mx-auto">
          <div className="bg-error-container/30 border border-error/30 text-error p-4 rounded-xl mb-4 animate-flicker">
            <AlertTriangle className="h-10 w-10" />
          </div>
          <h2 className="text-lg font-bold font-display text-error mb-2 uppercase tracking-wide">
            Colapso Dimensional Detectado
          </h2>
          <p className="text-xs text-slate-400 mb-6 leading-relaxed">
            Se produjo un error crítico en el renderizado de este sector multiversal. La realidad actual es inestable.
          </p>
          <button
            onClick={this.handleReset}
            className="flex items-center space-x-2 bg-error-container/50 hover:bg-error-container/90 text-error border border-error/50 font-mono text-xs px-4 py-2 rounded-lg transition-all shadow-sm cursor-pointer mx-auto"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            <span>Volver a la Ciudadela</span>
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
export default ErrorBoundary;
