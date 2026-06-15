import React, { useState } from 'react';
import { useOrders } from '../../context/OrderContext';

export default function ReservationTab() {
  const { reservations = [], createReservation } = useOrders() || {};
  
  const [formData, setFormData] = useState({
    name: '',
    type: 'Table',
    details: 'Table 4 (Window View)',
    date: '',
    time: '',
    covers: 2
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!createReservation) return;

    createReservation({
      ...formData,
      status: 'PENDING'
    });

    setFormData({ name: '', type: 'Table', details: 'Table 4 (Window View)', date: '', time: '', covers: 2 });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-7xl mx-auto animate-in fade-in duration-300">
      <div className="bg-white border border-zinc-200/80 rounded-2xl p-6 shadow-premium h-fit">
        <h3 className="font-bold text-base text-zinc-900 tracking-tight mb-1">Book Premium Seating</h3>
        <p className="text-xs text-zinc-400 mb-6 font-medium uppercase tracking-wider">Veloce Placement Engine</p>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase text-zinc-400 tracking-wider mb-1.5">Host Account Identity</label>
            <input 
              type="text" 
              required 
              placeholder="e.g., Alexander Wright" 
              value={formData.name} 
              onChange={e => setFormData({...formData, name: e.target.value})} 
              className="w-full border border-zinc-200 bg-zinc-50 rounded-xl px-3.5 py-2.5 text-xs font-medium focus:outline-hidden focus:border-brand-500 focus:bg-white transition-all" 
            />
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold uppercase text-zinc-400 tracking-wider mb-1.5">Allocation Space</label>
              <select 
                value={formData.type} 
                onChange={e => setFormData({...formData, type: e.target.value, details: e.target.value === 'Table' ? 'Table 4 (Window View)' : 'Entire Main Deck Lounge'})} 
                className="w-full border border-zinc-200 bg-zinc-50 rounded-xl px-3.5 py-2.5 text-xs font-bold focus:outline-hidden focus:border-brand-500 focus:bg-white transition-all"
              >
                <option value="Table">Bespoke Table</option>
                <option value="Full Hall">Exclusive Lounge</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold uppercase text-zinc-400 tracking-wider mb-1.5">Expected Covers</label>
              <input 
                type="number" 
                min="1" 
                required 
                value={formData.covers} 
                onChange={e => setFormData({...formData, covers: parseInt(e.target.value) || 1})} 
                className="w-full border border-zinc-200 bg-zinc-50 rounded-xl px-3.5 py-2.5 text-xs font-mono font-bold focus:outline-hidden focus:border-brand-500 focus:bg-white transition-all" 
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold uppercase text-zinc-400 tracking-wider mb-1.5">Target Horizon Date</label>
              <input 
                type="date" 
                required 
                value={formData.date} 
                onChange={e => setFormData({...formData, date: e.target.value})} 
                className="w-full border border-zinc-200 bg-zinc-50 rounded-xl px-3.5 py-2.5 text-xs font-medium focus:outline-hidden focus:border-brand-500 focus:bg-white transition-all" 
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase text-zinc-400 tracking-wider mb-1.5">Chronos Time Marker</label>
              <input 
                type="time" 
                required 
                value={formData.time} 
                onChange={e => setFormData({...formData, time: e.target.value})} 
                className="w-full border border-zinc-200 bg-zinc-50 rounded-xl px-3.5 py-2.5 text-xs font-medium focus:outline-hidden focus:border-brand-500 focus:bg-white transition-all" 
              />
            </div>
          </div>

          <button type="submit" className="w-full bg-zinc-900 hover:bg-zinc-800 text-white font-bold text-xs py-3.5 rounded-xl transition-all shadow-xs cursor-pointer">
            Secure Seating Reservation
          </button>
        </form>
      </div>

      <div className="lg:col-span-2 space-y-4">
        <h3 className="font-bold text-base text-zinc-900 tracking-tight flex items-center gap-2">
          <span>📋 Your Session Reservation History</span>
          <span className="bg-zinc-900 text-white px-2 py-0.5 rounded-md text-[10px] font-mono font-bold">
            {reservations.length} Active
          </span>
        </h3>

        {reservations.length === 0 ? (
          <div className="bg-white border border-zinc-200/60 rounded-2xl p-12 text-center shadow-xs">
            <p className="text-xs text-zinc-400 font-medium">No live placements initiated on this profile context.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {reservations.map(res => {
              const status = res.status || 'PENDING';
              return (
                <div key={res.id} className="bg-white border border-zinc-200 p-5 rounded-2xl shadow-premium flex flex-col justify-between group hover:border-zinc-300 transition-all">
                  <div>
                    <div className="flex justify-between items-start mb-2">
                      <span className="text-[10px] font-mono font-bold text-zinc-400 group-hover:text-brand-600 transition-colors">{res.id}</span>
                      
                      <span className={`px-2 py-0.5 rounded-md text-[9px] font-black uppercase tracking-wider border ${
                        status === 'ARRIVED' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                        status === 'CONFIRMED' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                        'bg-amber-50 text-amber-700 border-amber-200 animate-pulse'
                      }`}>
                        {status}
                      </span>
                    </div>
                    <h4 className="font-bold text-sm text-zinc-900 mb-1">{res.name}</h4>
                    <p className="text-xs text-zinc-500 flex items-center gap-1">📍 {res.details}</p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-zinc-100 flex justify-between items-center text-xs text-zinc-400 font-medium">
                    <span>🗓️ {res.date} at {res.time}</span>
                    <span className="font-bold text-zinc-800">👥 {res.covers} Seats</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}