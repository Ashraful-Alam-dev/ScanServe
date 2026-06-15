import React, { useState } from 'react';
import FoodOrderTab from './Home';
import ReservationTab from '../../components/customer/ReservationTab';

export default function CustomerWorkspace() {
  const [currentTab, setCurrentTab] = useState('food-order');

  const tabs = [
    { id: 'food-order', label: 'Food Order', icon: '🍔' },
    { id: 'reservations', label: 'Reservations', icon: '🗓️' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-50 via-white to-zinc-100 text-zinc-900 flex flex-col md:flex-row antialiased font-sans">
      <aside className="w-full md:w-72 bg-zinc-950/95 backdrop-blur-xl text-white flex flex-col justify-between border-r border-white/5 shadow-2xl shrink-0">
        <div>
          <div className="px-7 py-6 border-b border-white/5 flex items-center gap-4">
            <div className="w-11 h-11 bg-brand-600 rounded-2xl flex items-center justify-center text-white font-black text-lg shadow-lg shadow-brand-600/30">
              S
            </div>

            <div>
              <h1 className="font-extrabold text-base tracking-tight">
                SCANSERVE
              </h1>

              <p className="text-[10px] text-zinc-500 font-semibold uppercase tracking-[0.25em] mt-0.5">
                Guest Experience Platform
              </p>
            </div>
          </div>

          <nav className="p-4 space-y-2">
            {tabs.map(tab => {
              const isActive = currentTab === tab.id;

              return (
                <button
                  key={tab.id}
                  onClick={() => setCurrentTab(tab.id)}
                  className={`group w-full flex items-center gap-4 px-4 py-3 rounded-2xl text-sm font-semibold transition-all duration-300 cursor-pointer ${
                    isActive
                      ? 'bg-brand-600 text-white shadow-xl shadow-brand-600/25 scale-[1.02]'
                      : 'text-zinc-400 hover:bg-white/5 hover:text-white hover:translate-x-1'
                  }`}
                >
                  <span
                    className={`text-lg transition-transform duration-300 ${
                      isActive ? 'scale-110' : 'group-hover:scale-110'
                    }`}
                  >
                    {tab.icon}
                  </span>

                  <span className="tracking-wide">
                    {tab.label}
                  </span>
                </button>
              );
            })}
          </nav>
        </div>

        <div className="p-5 border-t border-white/5 bg-white/[0.02] text-center hidden md:block">
          <p className="text-[10px] font-mono font-semibold text-zinc-500 uppercase tracking-[0.3em]">
            Secure Client Node
          </p>
        </div>
      </aside>

      <main className="flex-1 p-6 md:p-10 lg:p-12 max-w-7xl mx-auto w-full overflow-y-auto">
        <div className="rounded-3xl bg-white/80 backdrop-blur-sm border border-zinc-200/70 shadow-xl shadow-zinc-200/40 min-h-full p-6 md:p-8">
          {currentTab === 'food-order' && <FoodOrderTab />}
          {currentTab === 'reservations' && <ReservationTab />}
        </div>
      </main>
    </div>
  );
}