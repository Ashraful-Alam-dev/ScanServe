import React from 'react';
import { useOrders } from '../../context/OrderContext';

export default function ReservationManager() {
  const { reservations = [], updateReservationStatus } = useOrders() || {};

  const handleStatusChange = (id, currentStatus) => {
    if (!updateReservationStatus) return;
    
    let nextStatus;
    switch(currentStatus) {
      case 'PENDING':
        nextStatus = 'CONFIRMED';
        break;
      case 'CONFIRMED':
        nextStatus = 'ARRIVED';
        break;
      case 'ARRIVED':
        nextStatus = 'COMPLETED';
        break;
      default:
        return;
    }
    updateReservationStatus(id, nextStatus);
  };

  const getStatusStyle = (status) => {
    switch(status) {
      case 'PENDING':
        return 'bg-amber-50 text-amber-700 border-amber-200 animate-pulse';
      case 'CONFIRMED':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'ARRIVED':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'COMPLETED':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      default:
        return 'bg-zinc-50 text-zinc-700 border-zinc-200';
    }
  };

  const getButtonText = (status) => {
    switch(status) {
      case 'PENDING':
        return '✓ Confirm Booking';
      case 'CONFIRMED':
        return '⚡ Mark Arrived';
      case 'ARRIVED':
        return '🎯 Complete Service';
      default:
        return '✓ Completed';
    }
  };

  const shouldShowButton = (status) => {
    return status !== 'COMPLETED';
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-zinc-200 pb-4 gap-4">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-zinc-900">Bespoke Placement Engine</h2>
          <p className="text-xs text-zinc-400 font-medium uppercase tracking-wider mt-0.5">Live Space Allocations</p>
        </div>
        <div className="flex gap-2">
          <span className="bg-zinc-900 text-white text-xs font-bold px-3 py-1.5 rounded-xl border border-zinc-800">
            👥 {reservations.filter(r => r.status !== 'COMPLETED').length} Active Horizons
          </span>
          <span className="bg-purple-50 text-purple-700 text-xs font-bold px-3 py-1.5 rounded-xl border border-purple-200">
            ✓ {reservations.filter(r => r.status === 'COMPLETED').length} Completed
          </span>
        </div>
      </div>

      {!reservations || reservations.length === 0 ? (
        <div className="bg-white border border-zinc-200 rounded-2xl p-16 text-center shadow-xs">
          <div className="text-4xl mb-3">🪑</div>
          <p className="text-sm font-semibold text-zinc-400">No reservation requests filed yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {reservations.map(res => {
            const status = res.status || 'PENDING';
            const isCompleted = status === 'COMPLETED';
            
            return (
              <div 
                key={res.id} 
                className={`bg-white border rounded-2xl p-5 shadow-premium flex flex-col justify-between group transition-all ${
                  isCompleted 
                    ? 'border-purple-200 opacity-75 hover:opacity-100' 
                    : 'border-zinc-200 hover:border-zinc-300'
                }`}
              >
                <div>
                  <div className="flex justify-between items-start mb-3">
                    <span className="text-[10px] font-mono font-bold text-zinc-400 group-hover:text-brand-600 transition-colors">
                      {res.id}
                    </span>
                    <span className={`px-2.5 py-0.5 rounded-md text-[9px] font-black uppercase tracking-wider border ${getStatusStyle(status)}`}>
                      {status}
                    </span>
                  </div>
                  
                  <h3 className="font-bold text-base text-zinc-900 mb-1">{res.name}</h3>
                  <div className="space-y-1 text-xs text-zinc-500">
                    <p className="flex items-center gap-1.5">📍 <span className="font-medium text-zinc-700">{res.details}</span></p>
                    <p className="flex items-center gap-1.5">⏰ <span className="font-mono">{res.date} @ {res.time}</span></p>
                  </div>
                  
                  {res.arrivedAt && (
                    <p className="text-[10px] text-emerald-600 mt-2 flex items-center gap-1">
                      <span>🟢</span> Arrived: {new Date(res.arrivedAt).toLocaleTimeString()}
                    </p>
                  )}
                  {res.completedAt && (
                    <p className="text-[10px] text-purple-600 mt-1 flex items-center gap-1">
                      <span>✅</span> Completed: {new Date(res.completedAt).toLocaleTimeString()}
                    </p>
                  )}
                </div>

                <div className="mt-6 pt-4 border-t border-zinc-100 flex items-center justify-between">
                  <span className="text-xs font-bold text-zinc-800">👥 {res.covers} Covers</span>
                  
                  {shouldShowButton(status) && (
                    <button
                      onClick={() => handleStatusChange(res.id, status)}
                      className={`font-bold text-[10px] uppercase tracking-wider px-3 py-2 rounded-xl transition-all cursor-pointer shadow-xs ${
                        status === 'ARRIVED'
                          ? 'bg-purple-600 hover:bg-purple-700 text-white'
                          : 'bg-zinc-900 hover:bg-brand-600 text-white'
                      }`}
                    >
                      {getButtonText(status)}
                    </button>
                  )}
                  
                  {isCompleted && (
                    <span className="text-[10px] font-bold text-purple-600 flex items-center gap-1">
                      <span>✓</span> Service Fulfilled
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}