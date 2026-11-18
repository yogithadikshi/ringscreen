import React, { Component } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

class LuxuryErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('DIKSHI JEWELLERY rendering error:', error, errorInfo);
    this.setState({ errorInfo });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen w-full flex flex-col items-center justify-center bg-[#8B1E2E] text-[#FAF6F0] p-6 text-center">
          <h1 className="font-serif-luxury text-3xl sm:text-5xl uppercase tracking-widest mb-3">
            DIKSHI JEWELLERY
          </h1>
          <p className="font-sans-luxury text-xs uppercase tracking-[0.28em] text-[#D6C298] mb-6">
            ELEGANCE • TIMELESS BEAUTY
          </p>
          <p className="font-sans-luxury text-sm text-[#FAF6F0]/80 max-w-md mb-4">
            An unexpected error occurred while rendering the luxury showcase.
          </p>

          {/* Detailed Error Diagnostic */}
          {this.state.error && (
            <div className="w-full max-w-xl bg-black/50 border border-white/20 rounded-xl p-4 my-4 text-left font-mono text-xs text-amber-200 overflow-auto max-h-48 whitespace-pre-wrap">
              <strong>Error:</strong> {String(this.state.error?.message || this.state.error)}
              {this.state.error?.stack && (
                <div className="mt-2 text-[10px] text-white/60">
                  {this.state.error.stack}
                </div>
              )}
            </div>
          )}

          <button
            onClick={() => {
              this.setState({ hasError: false, error: null });
              window.location.reload();
            }}
            className="px-6 py-2.5 rounded-full border border-amber-400 text-amber-300 uppercase tracking-widest text-xs hover:bg-amber-400 hover:text-black transition-all shadow-lg"
          >
            Reload Experience
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

createRoot(document.getElementById('root')).render(
  <LuxuryErrorBoundary>
    <App />
  </LuxuryErrorBoundary>,
)
