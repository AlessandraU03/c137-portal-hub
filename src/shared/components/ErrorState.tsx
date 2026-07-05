import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  title = 'Dimensional Interference Detected',
  message = 'An error occurred while fetching portal records. Please try syncing dimensions again.',
  onRetry,
}) => {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center max-w-md mx-auto">
      <div className="bg-error-container/30 border border-error/30 text-error p-4 rounded-xl mb-4 animate-flicker">
        <AlertTriangle className="h-10 w-10" />
      </div>
      <h3 className="text-lg font-bold font-display text-error mb-2 uppercase tracking-wide">
        {title}
      </h3>
      <p className="text-xs font-mono text-slate-400 mb-6 leading-relaxed">
        {message}
      </p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="flex items-center space-x-2 bg-error-container/50 hover:bg-error-container/90 text-error border border-error/50 font-mono text-xs px-4 py-2 rounded-lg transition-all shadow-sm hover:scale-105 cursor-pointer mx-auto"
        >
          <RefreshCw className="h-3.5 w-3.5" />
          <span>Sincronizar Dimensiones</span>
        </button>
      )}
    </div>
  );
};
export default ErrorState;
