import React from 'react';
import Sidebar from './components/Sidebar';
import Controls from './components/Controls';
import { Activity } from 'lucide-react';

function App() {
  return (
    <div className="flex h-screen w-screen bg-slate-950 text-slate-100 overflow-hidden">
      {/* Sidebar Area */}
      <Sidebar />

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col">
        {/* Header */}
        <header className="h-16 border-b border-slate-800 flex items-center px-6 bg-slate-900/50 backdrop-blur">
          <Activity className="w-6 h-6 text-brand-red mr-3" />
          <h1 className="text-xl font-bold tracking-wide">VIRTUAL PIT WALL <span className="text-xs text-slate-500 font-normal ml-2">PHASE 3</span></h1>
        </header>

        {/* Dashboard Content */}
        <div className="flex-1 p-6 overflow-auto relative">
          {/* Background Grid Effect */}
          <div className="absolute inset-0 pointer-events-none opacity-5"
            style={{ backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)', backgroundSize: '20px 20px' }}>
          </div>

          <Controls />
        </div>
      </main>
    </div>
  );
}

export default App;
