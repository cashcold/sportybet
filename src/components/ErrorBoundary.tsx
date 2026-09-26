import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error, errorInfo: null };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('[SportyBet Uncaught Error]:', error, errorInfo);
    this.setState({ error, errorInfo });
  }

  private handleReload = () => {
    try {
      localStorage.removeItem('sportybet_matches');
      localStorage.removeItem('sportybet_betslip');
    } catch {}
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#0d1218] text-white flex flex-col items-center justify-center p-6 text-center">
          <div className="w-16 h-16 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center mb-4 text-[#e41b23]">
            <AlertTriangle size={32} />
          </div>
          <h1 className="text-xl font-bold mb-2">Something went wrong</h1>
          <p className="text-gray-400 text-sm max-w-sm mb-6">
            SportyBet encountered an unexpected display issue. Tap reload to restore the app cleanly.
          </p>
          {this.state.error && (
            <div className="bg-[#141a22] border border-[#2b394a] rounded-lg p-3 max-w-md w-full mb-6 text-left">
              <p className="text-xs text-red-400 font-mono break-words">{this.state.error.message}</p>
            </div>
          )}
          <button
            onClick={this.handleReload}
            className="flex items-center gap-2 bg-[#00e676] hover:bg-[#00c853] text-[#0d1218] font-bold py-3 px-6 rounded-lg transition-colors cursor-pointer"
          >
            <RefreshCw size={18} />
            <span>Reload Application</span>
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
