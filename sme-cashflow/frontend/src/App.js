import React from 'react';
import Dashboard from './pages/Dashboard';
import { Shield } from 'lucide-react';

function App() {
  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="bg-white/10 backdrop-blur-md border-b border-white/20 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-white">SME Cash Flow Monitor</h1>
              <p className="text-blue-100 text-sm">Davao City, Philippines</p>
            </div>
            
            {/* Blockchain Security Badge */}
            <div className="flex items-center gap-2 px-4 py-2 bg-green-500/20 rounded-xl border border-green-500/30">
              <Shield className="text-green-400" size={20} />
              <div className="text-left">
                <div className="text-xs text-green-200">Secured by</div>
                <div className="text-green-400 font-bold">Blockchain</div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <Dashboard />

      {/* Footer */}
      <footer className="bg-white/5 backdrop-blur-md border-t border-white/10 mt-12">
        <div className="max-w-7xl mx-auto px-6 py-6 text-center">
          <p className="text-blue-100 text-sm">
            Blockchain-secured cash flow monitoring for transparency and trust
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;