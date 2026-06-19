import React, { useState, useMemo } from 'react';
import { useOrders } from '../../context/OrderContext';
import { MOCK_MENU } from '../../utils/mockData';

export default function InventoryTracker() {
  const { orders = [] } = useOrders() || {};

  const [rawMaterials, setRawMaterials] = useState([
    { id: 'rm-01', name: 'Chicken', quantity: 25, unit: 'kg', minimum: 10 },
    { id: 'rm-02', name: 'Beef', quantity: 10, unit: 'kg', minimum: 12 },
    { id: 'rm-03', name: 'Brioche Buns', quantity: 45, unit: 'units', minimum: 15 },
    { id: 'rm-04', name: 'Potatoes', quantity: 18, unit: 'kg', minimum: 8 },
    { id: 'rm-05', name: 'Ice Cream', quantity: 12, unit: 'liters', minimum: 5 }
  ]);

  const salesMetrics = useMemo(() => {
    try {
      const storedOrders = localStorage.getItem('smart_resto_orders');
      const ordersList = storedOrders ? JSON.parse(storedOrders) : [];
      
      let grandTotalSales = 0;
      const itemSalesTracker = {};

      ordersList.forEach(order => {
        grandTotalSales += (order.total || 0);

        (order.items || []).forEach(item => {
          const lowerName = item.name.toLowerCase();
          
          if (!itemSalesTracker[lowerName]) {
            itemSalesTracker[lowerName] = {
              name: item.name,
              totalRevenue: 0
            };
          }
          itemSalesTracker[lowerName].totalRevenue += ((item.price || 0) * (item.quantity || 0));
        });
      });

      const menuItems = MOCK_MENU.map(m => m.name);
      const salesData = menuItems.map(menuName => {
        const lowerMenuName = menuName.toLowerCase();
        const found = Object.keys(itemSalesTracker).find(key => 
          key.includes(lowerMenuName) || lowerMenuName.includes(key)
        );
        
        if (found) {
          return {
            itemName: menuName,
            totalRevenue: itemSalesTracker[found].totalRevenue
          };
        }
        
        return {
          itemName: menuName,
          totalRevenue: 0
        };
      });

      return { grandTotalSales, salesData };
    } catch (error) {
      console.error("Failed to parse sales ledger data from storage", error);
      return { grandTotalSales: 0, salesData: [] };
    }
  }, [orders]);

  const handleRestock = (id) => {
    setRawMaterials(prev => prev.map(item => 
      item.id === id 
        ? { ...item, quantity: item.quantity + (item.unit === 'units' ? 20 : 5) } 
        : item
    ));
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <div className="flex justify-between items-center border-b border-zinc-200 pb-4">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-zinc-900">SyncServe Analytics & Supply Monitoring</h2>
          <p className="text-xs text-zinc-400 font-medium uppercase tracking-wider mt-0.5">Live Raw Material Ledger & Sales Overview</p>
        </div>
      </div>

      <div className="bg-zinc-900 text-white p-6 rounded-2xl shadow-premium flex flex-col justify-between sm:flex-row items-start sm:items-center gap-4">
        <div>
          <p className="text-xs text-zinc-400 font-bold uppercase tracking-wider">Total Revenue</p>
          <h3 className="text-3xl font-black tracking-tight mt-1">
            {salesMetrics.grandTotalSales.toLocaleString()}
          </h3>
        </div>
        <div className="text-xs bg-zinc-800 px-3 py-1.5 rounded-xl text-zinc-300 border border-zinc-700/50">
          📍 Base Currency: <span className="text-white font-bold">BDT</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white border border-zinc-200 rounded-2xl shadow-premium overflow-hidden">
          <div className="bg-zinc-900 px-5 py-3">
            <h3 className="text-sm font-bold text-white tracking-tight">📦 Raw Material Inventory</h3>
          </div>
          <div className="divide-y divide-zinc-100">
            {rawMaterials.map(item => {
              const isCritical = item.quantity <= item.minimum;
              
              return (
                <div key={item.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-zinc-50/40 transition-colors">
                  <div className="space-y-1 flex-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-sm text-zinc-900">{item.name}</h4>
                      {isCritical && (
                        <span className="bg-rose-50 text-rose-600 border border-rose-200 px-2 py-0.5 rounded-md text-[9px] font-black uppercase tracking-wider animate-pulse">
                          ⚠️ Low
                        </span>
                      )}
                    </div>
                    <p className="text-[10px] font-mono text-zinc-400 font-bold uppercase tracking-wider">ID: {item.id}</p>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className={`font-mono text-sm font-bold ${isCritical ? 'text-rose-600' : 'text-zinc-900'}`}>
                        {item.quantity} {item.unit}
                      </p>
                      <p className="text-[10px] text-zinc-400 font-medium">Min: {item.minimum} {item.unit}</p>
                    </div>

                    <button
                      onClick={() => handleRestock(item.id)}
                      className="bg-zinc-100 hover:bg-zinc-900 text-zinc-800 hover:text-white font-bold text-[10px] uppercase tracking-wider px-3 py-2 rounded-xl border border-zinc-200/40 transition-all cursor-pointer shadow-xs whitespace-nowrap"
                    >
                      ⚡ Top Up
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="bg-white border border-zinc-200 rounded-2xl shadow-premium overflow-hidden">
          <div className="bg-zinc-900 px-5 py-3">
            <h3 className="text-sm font-bold text-white tracking-tight">📊 Sales Performance</h3>
          </div>
          <div className="divide-y divide-zinc-100">
            {salesMetrics.salesData.map((item, index) => (
              <div key={index} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-zinc-50/40 transition-colors">
                <div className="space-y-1 flex-1">
                  <div className="flex items-center gap-2">
                    <h4 className="font-bold text-sm text-zinc-900">{item.itemName}</h4>
                  </div>
                </div>

                <div className="text-right min-w-[120px]">
                  <p className="text-[10px] text-zinc-400 font-semibold uppercase tracking-wider">Total Revenue</p>
                  <p className="font-mono text-sm font-bold text-emerald-600">
                    {item.totalRevenue.toLocaleString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
          <div className="bg-zinc-50 px-5 py-3 border-t border-zinc-200">
            <div className="flex justify-between items-center">
              <span className="text-xs font-bold text-zinc-600 uppercase tracking-wider">Total Revenue</span>
              <span className="font-mono text-lg font-black text-emerald-600">
                {salesMetrics.grandTotalSales.toLocaleString()}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}