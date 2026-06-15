import React from 'react';
import { useOrders } from '../../context/OrderContext';

export default function ReviewTelemetry() {
  const { reviews = [] } = useOrders() || {};

  const averageRating = reviews.length > 0 
    ? (reviews.reduce((sum, r) => sum + (r.rating || 0), 0) / reviews.length).toFixed(1) 
    : "0.0";

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <div>
        <h2 className="text-xl font-bold tracking-tight text-zinc-900">Gastronomic Feedback Telemetry</h2>
        <p className="text-xs text-zinc-400 font-medium uppercase tracking-wider mt-0.5">Live Operations Assessment Stream</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="bg-white border border-zinc-200 rounded-2xl p-5 shadow-premium flex items-center justify-between">
          <div>
            <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Aggregate Assessment Score</p>
            <h3 className="text-3xl font-black text-zinc-900 mt-1">{averageRating} <span className="text-xs font-normal text-zinc-400">/ 5.0</span></h3>
          </div>
          <div className="text-2xl bg-amber-50 p-3 rounded-xl border border-amber-200/40">⭐</div>
        </div>
        <div className="bg-white border border-zinc-200 rounded-2xl p-5 shadow-premium flex items-center justify-between">
          <div>
            <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Manifest Count Tracking</p>
            <h3 className="text-3xl font-black text-zinc-900 mt-1">{reviews.length} <span className="text-xs font-normal text-zinc-400">Entries</span></h3>
          </div>
          <div className="text-2xl bg-zinc-50 p-3 rounded-xl border border-zinc-200/40">📊</div>
        </div>
      </div>

      <div className="bg-white border border-zinc-200 rounded-2xl shadow-premium overflow-hidden">
        <div className="px-5 py-4 border-b border-zinc-100 bg-zinc-50/50">
          <h3 className="font-bold text-xs text-zinc-400 uppercase tracking-wider">Historical Assessment Ledger</h3>
        </div>

        <div className="divide-y divide-zinc-100 max-h-[500px] overflow-y-auto">
          {!reviews || reviews.length === 0 ? (
            <p className="text-xs text-zinc-400 text-center py-12">No client evaluation responses verified on this stream cycle yet.</p>
          ) : (
            reviews.map(rev => (
              <div key={rev.id} className="p-5 flex flex-col md:flex-row justify-between gap-4 group hover:bg-zinc-50/50 transition-colors">
                <div className="space-y-1 flex-1">
                  <div className="flex items-center gap-2.5">
                    <span className="text-[10px] font-mono font-bold text-zinc-400">{rev.itemId || 'GENERIC'}</span>
                    <h4 className="font-bold text-sm text-zinc-900">{rev.itemName || 'Signature Menu Selection'}</h4>
                  </div>
                  <p className="text-xs text-zinc-600 leading-relaxed max-w-2xl font-medium">"{rev.comment}"</p>
                </div>

                <div className="flex md:flex-col justify-between md:items-end gap-2 shrink-0">
                  <div className="flex gap-0.5">
                    {Array.from({ length: rev.rating || 5 }).map((_, i) => (
                      <span key={i} className="text-xs">⭐</span>
                    ))}
                  </div>
                  <span className="text-[10px] font-mono text-zinc-400">
                    {rev.timestamp ? new Date(rev.timestamp).toLocaleTimeString() : 'Live Synced'}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}