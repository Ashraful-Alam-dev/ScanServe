import React, { useState } from 'react';
import { useOrders } from '../../context/OrderContext';
import { ORDER_STATUSES } from '../../utils/mockData';

export default function ManagementDashboard() {
  const { orders, updateOrderStatus } = useOrders();
  const [selectedOrder, setSelectedOrder] = useState(null);
  const totalOrders = orders.length;
  const countByStatus = (status) => orders.filter(o => o.status === status).length;

  const kpis = [
    { label: 'Gross Pipeline Ledger', value: `${orders.reduce((s, o) => s + o.total, 0).toFixed(2)}`, desc: 'Aggregate platform scope', icon: '💰', color: 'border-l-zinc-900' },
    { label: 'Pending Processing', value: countByStatus(ORDER_STATUSES.PENDING), desc: 'In queue framework', icon: '📥', color: 'border-l-amber-500' },
    { label: 'Active Cook Cycles', value: countByStatus(ORDER_STATUSES.COOKING), desc: 'On flame cluster', icon: '🍳', color: 'border-l-orange-500' },
    { label: 'Staged / Hot-Verified', value: countByStatus(ORDER_STATUSES.COOKED), desc: 'Awaiting dispatch', icon: '✨', color: 'border-l-blue-500' },
    { label: 'Completed Deliveries', value: countByStatus(ORDER_STATUSES.DELIVERED), desc: 'Fulfillment targets hit', icon: '🎉', color: 'border-l-emerald-500' }
  ];

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 antialiased font-sans pb-12">
      <header className="border-b border-zinc-800 bg-zinc-900/50 backdrop-blur-md px-8 py-5 flex items-center justify-between sticky top-0 z-30">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-purple-600 rounded-xl flex items-center justify-center text-white text-xl font-bold shadow-lg">
            Ω
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-bold text-lg tracking-tight text-white">ScanServe Operations Hub</h1>
              <span className="bg-purple-500/10 text-purple-400 border border-purple-500/20 text-[10px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider">Kitchen Node Alpha</span>
            </div>
            <p className="text-xs text-zinc-400 font-medium">Enterprise Orchestration Management Layer</p>
          </div>
        </div>

        <div className="text-xs text-zinc-400 bg-zinc-800 border border-zinc-700 px-3 py-1.5 rounded-lg flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>Cross-Tab Synchronization Stream Engaged</span>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-8 pt-8 space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {kpis.map((kpi, idx) => (
            <div key={idx} className={`bg-zinc-900 border border-zinc-800 rounded-xl p-5 border-l-4 shadow-xl ${kpi.color}`}>
              <div className="flex justify-between items-start">
                <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider">{kpi.label}</span>
                <span className="text-lg">{kpi.icon}</span>
              </div>
              <p className="text-2xl font-black text-white tracking-tight mt-2">{kpi.value}</p>
              <span className="text-[10px] text-zinc-500 mt-0.5 block">{kpi.desc}</span>
            </div>
          ))}
        </div>
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl overflow-hidden">
          <div className="p-6 border-b border-zinc-800 flex justify-between items-center">
            <div>
              <h2 className="text-base font-bold text-white tracking-tight">Active Production Stream</h2>
              <p className="text-xs text-zinc-400 mt-0.5">Real-time incoming execution queue logs.</p>
            </div>
            <span className="text-xs font-bold bg-zinc-800 border border-zinc-700 text-zinc-300 px-3 py-1 rounded-lg">
              {orders.length} Global Manifest Entries Managed
            </span>
          </div>

          {orders.length === 0 ? (
            <div className="text-center py-20 space-y-3">
              <div className="text-4xl">📭</div>
              <h3 className="font-bold text-zinc-300 text-sm">Production queue clear.</h3>
              <p className="text-xs text-zinc-500 max-w-xs mx-auto">No orders submitted via the customer deployment channels yet.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-zinc-900 text-zinc-400 border-b border-zinc-800 font-bold uppercase tracking-wider">
                    <th className="p-4 pl-6">Order String Node</th>
                    <th className="p-4">Customer Segment</th>
                    <th className="p-4">Manifest Payload Summary</th>
                    <th className="p-4">Timestamp Logistics</th>
                    <th className="p-4">State Signature</th>
                    <th className="p-4 text-right pr-6">Operational Control Matrix</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800/60 font-medium text-zinc-300">
                  {orders.map(order => (
                    <tr 
                      key={order.id} 
                      onClick={() => setSelectedOrder(order)}
                      className={`hover:bg-zinc-800/40 transition-colors cursor-pointer ${selectedOrder?.id === order.id ? 'bg-zinc-800/60' : ''}`}
                    >
                      <td className="p-4 pl-6 font-mono font-bold text-purple-400">{order.id}</td>
                      <td className="p-4 text-white font-semibold">{order.customerName}</td>
                      <td className="p-4 max-w-xs truncate text-zinc-400">
                        {order.items.map(i => `${i.quantity}x ${i.name}`).join(', ')}
                      </td>
                      <td className="p-4 text-zinc-500">{new Date(order.timestamp).toLocaleTimeString()}</td>
                      <td className="p-4">
                        <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wide border ${
                          order.status === 'DELIVERED' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' :
                          order.status === 'COOKED' ? 'bg-blue-500/10 border-blue-500/20 text-blue-400 animate-pulse' :
                          order.status === 'COOKING' ? 'bg-orange-500/10 border-orange-500/20 text-orange-400' :
                          'bg-amber-500/10 border-amber-500/20 text-amber-400'
                        }`}>
                          {order.status}
                        </span>
                      </td>
                      <td className="p-4 text-right pr-6" onClick={(e) => e.stopPropagation()}>
                        <div className="inline-flex gap-1.5">
                          {order.status === ORDER_STATUSES.PENDING && (
                            <button 
                              onClick={() => updateOrderStatus(order.id, ORDER_STATUSES.COOKING)}
                              className="bg-amber-600 hover:bg-amber-700 text-white font-bold text-[10px] px-2.5 py-1 rounded-md transition-all shadow-md"
                            >
                              ⚡ Accept & Cook
                            </button>
                          )}
                          {order.status === ORDER_STATUSES.COOKING && (
                            <button 
                              onClick={() => updateOrderStatus(order.id, ORDER_STATUSES.COOKED)}
                              className="bg-orange-600 hover:bg-orange-700 text-white font-bold text-[10px] px-2.5 py-1 rounded-md transition-all shadow-md"
                            >
                              ✨ Complete Plate Ready
                            </button>
                          )}
                          {order.status === ORDER_STATUSES.COOKED && (
                            <button 
                              onClick={() => updateOrderStatus(order.id, ORDER_STATUSES.DELIVERED)}
                              className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-[10px] px-2.5 py-1 rounded-md transition-all shadow-md"
                            >
                              📦 Complete Handover Hand-Off
                            </button>
                          )}
                          {order.status === ORDER_STATUSES.DELIVERED && (
                            <span className="text-zinc-500 text-[11px] italic pr-2">✓ Lifecycle Archive Saved</span>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>

      {selectedOrder && (
        <div className="fixed inset-0 z-40 overflow-hidden flex justify-end animate-in fade-in duration-200">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-xs" onClick={() => setSelectedOrder(null)} />
          
          <div className="relative w-full max-w-md bg-zinc-900 border-l border-zinc-800 h-full p-6 shadow-2xl flex flex-col justify-between text-zinc-300 animate-in slide-in-from-right duration-300">
            <div className="space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-zinc-800">
                <div>
                  <span className="font-mono text-purple-400 font-bold text-sm tracking-wider">{selectedOrder.id}</span>
                  <h3 className="text-base font-bold text-white tracking-tight mt-0.5">Control Registry Panel</h3>
                </div>
                <button onClick={() => setSelectedOrder(null)} className="text-zinc-500 hover:text-zinc-300 text-lg">✕</button>
              </div>

              <div className="space-y-4">
                <div>
                  <span className="text-[10px] uppercase font-bold text-zinc-500 tracking-wider">Assigned Identity Label</span>
                  <p className="text-sm font-bold text-white mt-0.5">{selectedOrder.customerName}</p>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-zinc-500 tracking-wider">Internal Lifecycle Signature State</span>
                  <p className="text-xs font-mono font-bold uppercase mt-1 text-brand-500 bg-brand-500/10 border border-brand-500/20 px-2.5 py-1 rounded-md inline-block">
                    {selectedOrder.status}
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <span className="text-[10px] uppercase font-bold text-zinc-500 tracking-wider block">Production Build Items Manifest</span>
                <div className="bg-zinc-950/60 rounded-xl p-4 border border-zinc-800 divide-y divide-zinc-800/50">
                  {selectedOrder.items.map(item => (
                    <div key={item.id} className="py-2.5 flex justify-between items-center text-xs">
                      <div>
                        <span className="font-mono font-bold text-purple-400 bg-purple-500/10 px-1.5 py-0.5 rounded-sm mr-2">{item.quantity}x</span>
                        <span className="text-zinc-200 font-medium">{item.name}</span>
                      </div>
                      <span className="font-mono text-zinc-400">${(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                  <div className="pt-3 mt-3 flex justify-between items-center text-xs font-bold text-white">
                    <span>Total Financial Value Manifested</span>
                    <span className="text-base text-brand-400 font-mono">${selectedOrder.total.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-zinc-950 p-4 border border-zinc-800 rounded-xl space-y-3.5">
              <span className="text-[10px] uppercase font-bold text-zinc-400 tracking-wider block text-center">Calibrate Stream Pipeline Machine Step</span>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <button 
                  onClick={() => { updateOrderStatus(selectedOrder.id, ORDER_STATUSES.COOKING); setSelectedOrder(null); }}
                  className="bg-zinc-800 hover:bg-zinc-700 text-white p-2.5 rounded-lg border border-zinc-700/60 font-semibold"
                >
                  🍳 Processing Phase
                </button>
                <button 
                  onClick={() => { updateOrderStatus(selectedOrder.id, ORDER_STATUSES.COOKED); setSelectedOrder(null); }}
                  className="bg-zinc-800 hover:bg-zinc-700 text-white p-2.5 rounded-lg border border-zinc-700/60 font-semibold"
                >
                  ✨ Plate Ready Staged
                </button>
              </div>
              <button 
                onClick={() => { updateOrderStatus(selectedOrder.id, ORDER_STATUSES.DELIVERED); setSelectedOrder(null); }}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold p-2.5 rounded-lg block text-center shadow-md transition-colors"
              >
                🎉 Complete Final Handover Delivery
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}