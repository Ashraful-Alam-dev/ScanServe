import React, { useState } from 'react';

import OrderHandling from './OrderHandling'; 
import ReservationManager from './ReservationManager';
import ReviewTelemetry from './ReviewTelemetry';
import AIExecutiveReport from '../../components/management/AIExecutiveReport'; 
import InventoryTracker from '../../components/management/InventoryTracker';   

export default function ManagementWorkspace() {
  const [currentView, setCurrentView] = useState('orders');

  const menuItems = [
    { id: 'orders', label: 'Order Pipeline', icon: '🚀' },
    { id: 'reservations', label: 'Space Placement', icon: '🗓️' },
    { id: 'reviews', label: 'Feedback Streams', icon: '⭐' },
    { id: 'ai-report', label: 'AI Exec Insights', icon: '🤖' }, 
    { id: 'inventory', label: 'Stock Logistics', icon: '🥩' }  
  ];

  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900 flex flex-col md:flex-row antialiased font-sans">

      <aside className="w-full md:w-64 bg-zinc-900 text-white flex flex-col justify-between border-r border-zinc-800 shrink-0">
        <div>
          <div className="px-6 py-5 border-b border-zinc-800/80 flex items-center gap-3">
            <div className="w-8 h-8 bg-brand-600 rounded-lg flex items-center justify-center text-white font-black shadow-xs">
              S
            </div>
            <div>
              <h1 className="font-bold text-sm tracking-tight">SyncSERVE</h1>
              <p className="text-[9px] text-zinc-500 font-bold uppercase tracking-widest -mt-0.5">Control Terminal</p>
            </div>
          </div>

          <nav className="p-3 space-y-1">
            {menuItems.map(item => {
              const isActive = currentView === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setCurrentView(item.id)}
                  className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-semibold tracking-wide uppercase transition-all cursor-pointer ${
                    isActive 
                      ? 'bg-brand-600 text-white font-bold shadow-md' 
                      : 'text-zinc-400 hover:bg-zinc-800/60 hover:text-white'
                  }`}
                >
                  <span className="text-sm">{item.icon}</span>
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        <div className="p-4 border-t border-zinc-800/80 bg-zinc-950/40 text-center hidden md:block">
          <p className="text-[10px] font-mono font-bold text-zinc-600 uppercase tracking-widest">Operator Node Active</p>
        </div>
      </aside>

      <main className="flex-1 p-6 md:p-10 max-w-7xl mx-auto w-full overflow-y-auto">
        {currentView === 'orders' && <OrderHandling />}
        {currentView === 'reservations' && <ReservationManager />}
        {currentView === 'reviews' && <ReviewTelemetry />}
        {currentView === 'ai-report' && <AIExecutiveReport />}
        {currentView === 'inventory' && <InventoryTracker />}
      </main>
    </div>
  );
}