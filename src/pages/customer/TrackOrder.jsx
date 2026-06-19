import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useOrders } from '../../context/OrderContext';

export default function TrackOrder() {
  const { orderId } = useParams();
  const { orders = [] } = useOrders() || {};

  const order = (orders || []).find(o => o?.id === orderId);

  if (!order) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-surface-50 p-6 text-center space-y-4">
        <div className="text-4xl">🔍</div>
        <h2 className="text-xl font-bold">Telemetry stream lookup failed.</h2>
        <p className="text-xs text-zinc-400 max-w-xs">Order ID details not yet cataloged inside localized state.</p>
        <Link to="/customer" className="bg-zinc-900 text-white text-xs px-4 py-2 rounded-xl font-semibold">Return to Menu Suite</Link>
      </div>
    );
  }

  const pipelineStates = [
    { key: 'PENDING', label: 'Broadcast Received', desc: 'Order logged inside kitchen cluster.', icon: '📥', color: 'text-amber-500 bg-amber-50' },
    { key: 'COOKING', label: 'Culinary Assembly', desc: 'Chefs are executing your build pipeline.', icon: '🍳', color: 'text-orange-500 bg-orange-50' },
    { key: 'COOKED', label: 'Quality Verification', desc: 'Order hot, staged, and plate-verified.', icon: '✨', color: 'text-blue-500 bg-blue-50' },
    { key: 'DELIVERED', label: 'Handover Completed', desc: 'Table hand-off completed successfully.', icon: '🎉', color: 'text-emerald-500 bg-emerald-50' }
  ];

  const getStatusIndex = (current) => pipelineStates.findIndex(p => p.key === current);
  const currentIndex = getStatusIndex(order?.status);

  return (
    <div className="min-h-screen bg-surface-50 text-zinc-900 antialiased px-4 py-12">
      <div className="max-w-2xl mx-auto space-y-8">

        <div className="flex items-center justify-between border-b border-zinc-200 pb-4">
          <div>
            <Link to="/customer" className="text-xs text-zinc-400 hover:text-zinc-900 font-semibold flex items-center gap-1 mb-1">← Modify Menu Scope</Link>
            <h2 className="text-2xl font-black tracking-tight flex items-center gap-2">
              <span>Tracking System Engine</span>
              <span className="font-mono text-zinc-400 text-sm font-bold bg-zinc-100 border px-2 py-0.5 rounded-md">
                {order?.id ? order.id.toString() : ''}
              </span>
            </h2>
          </div>
          <div className="text-right">
            <span className="text-[10px] text-zinc-400 uppercase tracking-widest font-bold block">Assigned Node</span>
            <span className="text-xs font-bold bg-brand-50 border border-brand-200 text-brand-600 px-2.5 py-1 rounded-lg block mt-1">{order?.customerName}</span>
          </div>
        </div>

        <div className="bg-white border border-zinc-200 rounded-2xl p-6 shadow-premium space-y-4">
          <h3 className="font-bold text-sm text-zinc-800 uppercase tracking-wider border-b border-zinc-100 pb-2">Deployment Manifest</h3>
          <div className="divide-y divide-zinc-100">
            {(order?.items || []).map(item => (
              <div key={item?.id} className="py-2.5 flex justify-between items-center text-xs">
                <div>
                  <span className="font-bold text-zinc-900 mr-2">{item?.quantity}x</span>
                  <span className="text-zinc-600">{item?.name}</span>
                </div>
                <span className="font-mono text-zinc-500">BDT {((item?.price || 0) * (item?.quantity || 0)).toFixed(2)}</span>
              </div>
            ))}
          </div>
          <div className="flex justify-between items-center pt-4 border-t border-zinc-100 text-xs font-bold text-zinc-900">
            <span>Total Capital Manifested</span>
            <span className="text-base text-brand-600">BDT {order?.total?.toFixed(2)}</span>
          </div>
        </div>

        <div className="bg-white border border-zinc-200 rounded-3xl p-6 md:p-8 shadow-premium relative">
          {order?.status === 'DELIVERED' && (
            <div className="absolute inset-0 bg-emerald-500/[0.02] border-2 border-emerald-500/20 rounded-3xl pointer-events-none animate-pulse" />
          )}

          <h3 className="font-bold text-sm text-zinc-400 uppercase tracking-wider mb-8">Live Real-time Pipeline Logs</h3>

          <div className="relative space-y-8 before:absolute before:inset-0 before:left-6 before:top-2 before:bottom-2 before:w-[2px] before:bg-zinc-100">
            {pipelineStates.map((state, index) => {
              const isDone = index <= currentIndex;
              const isActive = index === currentIndex;

              return (
                <div key={state?.key} className={`flex gap-4 relative transition-all duration-300 ${isDone ? 'opacity-100' : 'opacity-40'}`}>

                  <div className={`w-12 h-12 rounded-full flex items-center justify-center z-10 border transition-all shadow-xs ${
                    isActive ? 'bg-zinc-950 text-white ring-4 ring-brand-500/20 border-zinc-950 scale-110' :
                    isDone ? 'bg-brand-600 text-white border-brand-600' : 'bg-white text-zinc-400 border-zinc-200'
                  }`}>
                    <span className="text-lg">{state?.icon}</span>
                  </div>

                  <div className="flex-1 pt-1">
                    <div className="flex items-center gap-2">
                      <h4 className={`text-sm font-bold tracking-tight ${isActive ? 'text-brand-600' : 'text-zinc-900'}`}>
                        {state?.label}
                      </h4>
                      {isActive && (
                        <span className="w-2 h-2 rounded-full bg-brand-500 animate-pulse-slow" />
                      )}
                    </div>
                    <p className="text-xs text-zinc-500 mt-0.5 leading-normal">{state?.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="bg-zinc-900 text-zinc-400 p-4 rounded-xl text-center text-xs border border-zinc-800">
          ⚙️ Simulator Verification Mode active. Drag or host the <Link to="/management" target="_blank" className="text-brand-500 font-bold underline hover:text-brand-400">Management Console Route</Link> onto an adjacent window panel to advance this stream pipeline state.
        </div>
      </div>
    </div>
  );
}