import React from 'react';
import { SystemProvider, useSystem } from './context/SystemContext';
import Dashboard from './pages/Dashboard';
import { ArrowLeftRight } from 'lucide-react';

function AppContent() {
  const { systemType, toggleSystem } = useSystem();

  return (
    <div className="min-h-screen">
      {/* Header with System Toggle */}
      <header className="bg-white/10 backdrop-blur-md border-b border-white/20 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-white">SME Cash Flow Monitor</h1>
              <p className="text-blue-100 text-sm">Davao City, Philippines</p>
            </div>
            
            {/* System Toggle Button */}
            <button
              onClick={toggleSystem}
              className="flex items-center gap-3 px-6 py-3 bg-white/20 hover:bg-white/30 rounded-xl border border-white/30 transition-all duration-300 shadow-lg hover:shadow-xl group"
            >
              <ArrowLeftRight className="text-white group-hover:rotate-180 transition-transform duration-300" size={20} />
              <div className="text-left">
                <div className="text-xs text-blue-100">Current System</div>
                <div className="text-white font-bold capitalize">{systemType}</div>
              </div>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <Dashboard />

      {/* Footer */}
      <footer className="bg-white/5 backdrop-blur-md border-t border-white/10 mt-12">
        <div className="max-w-7xl mx-auto px-6 py-6 text-center">
          <p className="text-blue-100">
            Blockchain-Enabled Cash Flow Monitoring System 
          </p>
        </div>
      </footer>
    </div>
  );
}

function App() {
  return (
    <SystemProvider>
      <AppContent />
    </SystemProvider>
  );
}

export default App;