import React, { useState } from 'react';
import { useOrders } from '../../context/OrderContext';

export default function InventoryTracker() {
  const { orders = [] } = useOrders() || {};

  const [stock, setStock] = useState([
    { id: 'ing-01', name: 'Premium Angus Beef Patties', quantity: 48, unit: 'units', minimum: 15 },
    { id: 'ing-02', name: 'Artisanal Brioche Buns', quantity: 60, unit: 'units', minimum: 15 },
    { id: 'ing-03', name: 'Fresh Avocado Pulp', quantity: 8, unit: 'kg', minimum: 10 },
    { id: 'ing-04', name: 'Truffle Aioli Emulsion', quantity: 4.5, unit: 'liters', minimum: 2.0 },
    { id: 'ing-05', name: 'Imported Parmigiano Reggiano', quantity: 12, unit: 'kg', minimum: 5 }
  ]);

  const handleRestock = (id) => {
    setStock(prev => prev.map(item => 
      item.id === id 
        ? { ...item, quantity: item.quantity + (item.unit === 'units' ? 20 : 5) } 
        : item
    ));
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <div className="flex justify-between items-center border-b border-zinc-200 pb-4">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-zinc-900">Inventory Supply Monitoring</h2>
          <p className="text-xs text-zinc-400 font-medium uppercase tracking-wider mt-0.5">Live Raw Material Ledger</p>
        </div>
      </div>

      <div className="bg-white border border-zinc-200 rounded-2xl shadow-premium overflow-hidden">
        <div className="divide-y divide-zinc-100">
          {stock.map(item => {
            const isCritical = item.quantity <= item.minimum;
            
            return (
              <div key={item.id} className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 group hover:bg-zinc-50/40 transition-colors">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h4 className="font-bold text-sm text-zinc-900">{item.name}</h4>
                    {isCritical && (
                      <span className="bg-rose-50 text-rose-600 border border-rose-200 px-2 py-0.5 rounded-md text-[9px] font-black uppercase tracking-wider animate-pulse">
                        ⚠️ Low Supply
                      </span>
                    )}
                  </div>
                  <p className="text-[10px] font-mono text-zinc-400 font-bold uppercase tracking-wider">Resource Allocation ID: {item.id}</p>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-6">
                  <div className="text-right">
                    <p className={`font-mono text-sm font-bold ${isCritical ? 'text-rose-600' : 'text-zinc-900'}`}>
                      {item.quantity} {item.unit}
                    </p>
                    <p className="text-[10px] text-zinc-400 font-medium">Safe Floor: {item.minimum} {item.unit}</p>
                  </div>

                  <button
                    onClick={() => handleRestock(item.id)}
                    className="bg-zinc-100 hover:bg-zinc-900 text-zinc-800 hover:text-white font-bold text-[10px] uppercase tracking-wider px-3 py-2 rounded-xl border border-zinc-200/40 transition-all cursor-pointer shadow-xs"
                  >
                    ⚡ Top Up
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}