import React from "react";

interface State { error: Error | null }

export class ErrorBoundary extends React.Component<{ children: React.ReactNode }, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }
  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error("[ErrorBoundary]", error, info);
  }
  render() {
    if (this.state.error) {
      return (
        <div className="mx-auto max-w-2xl px-4 py-32 text-center">
          <div className="mono text-xs uppercase tracking-[0.3em] text-red-300 mb-3">
            // something broke
          </div>
          <h1 className="display text-4xl mb-3">OOPS.</h1>
          <p className="text-white/60 mb-4 text-sm">
            {this.state.error.message || "An unexpected error occurred."}
          </p>
          <button
            onClick={() => location.reload()}
            className="inline-flex items-center px-5 py-2.5 rounded-full bg-[var(--color-neon)] text-black font-bold"
          >
            Reload
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
