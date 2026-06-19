import React from 'react';
import { useOrders } from '../../context/OrderContext';
import { MOCK_MENU } from '../../utils/mockData';

export default function AIExecutiveReport() {
  const { orders = [], reviews = [] } = useOrders() || {};

  const itemQuantities = {};
  orders.forEach(order => {
    (order.items || []).forEach(item => {
      itemQuantities[item.name] = (itemQuantities[item.name] || 0) + (item.quantity || 0);
    });
  });

  const topPerformingItem = Object.keys(itemQuantities).length > 0
    ? Object.keys(itemQuantities).reduce((a, b) => itemQuantities[a] > itemQuantities[b] ? a : b)
    : "None Recorded";

  const itemToBeImproved = Object.keys(itemQuantities).length > 0
    ? Object.keys(itemQuantities).reduce((a, b) => itemQuantities[a] < itemQuantities[b] ? b : a)
    : "None Recorded";

  const lowRatingReviews = reviews.filter(r => (r.rating || 5) <= 3);
  const criticalServiceReviews = reviews.filter(r => 
    r.comment?.toLowerCase().includes('service') || 
    r.comment?.toLowerCase().includes('slow') || 
    r.comment?.toLowerCase().includes('wait')
  );

  const generatePlainInsights = () => {
    const insights = [];

    if (topPerformingItem !== "None Recorded") {
      insights.push({
        type: 'success',
        title: "Product Performance Milestone",
        message: `Your ${topPerformingItem} is currently outperforming all other selections inside SyncServe. Consider adjusting its menu real estate or pairing options to capitalize on this traction.`
      });
    } else {
      insights.push({
        type: 'neutral',
        title: "Product Performance Balanced",
        message: "Menu throughput remains evenly distributed. No single dominant item signature detected on this operational cycle."
      });
    }

    if (itemToBeImproved !== "None Recorded" && itemToBeImproved !== topPerformingItem) {
      insights.push({
        type: 'info',
        title: "Menu Item Refinement Needed",
        message: `The ${itemToBeImproved} is currently presenting the lowest conversion throughput. Re-evaluate pricing models, recipe design, or feature it via promotions to stimulate volume.`
      });
    }

    if (criticalServiceReviews.length > 0) {
      insights.push({
        type: 'danger',
        title: "Service Delivery Friction Detected",
        message: `Your service is receiving critical feedback from guests. Real-time review text mentions wait thresholds or staff interactions—reassess kitchen handoff priority immediately.`
      });
    } else if (lowRatingReviews.length > 0) {
      insights.push({
        type: 'warning',
        title: "Taste Assessment Flags",
        message: "Overall satisfaction drop localized in food evaluation parameters. Review portion consistency and seasoning accuracy."
      });
    } else {
      insights.push({
        type: 'success',
        title: "Operational Status Optimal",
        message: "Customer assessment scores remain highly favorable. Keep current staffing allocations unchanged."
      });
    }

    return insights;
  };

  const insights = generatePlainInsights();

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <div>
        <h2 className="text-xl font-bold tracking-tight text-zinc-900">SyncServe AI Executive Report</h2>
        <p className="text-xs text-zinc-400 font-medium uppercase tracking-wider mt-0.5">Plain-Language Diagnostic Observations</p>
      </div>

      <div className="space-y-4">
        {insights.map((insight, idx) => {
          const colorStyles = 
            insight.type === 'success' ? 'bg-emerald-50 border-emerald-200/60 text-emerald-900' :
            insight.type === 'danger' ? 'bg-rose-50 border-rose-200/60 text-rose-900' :
            insight.type === 'warning' ? 'bg-amber-50 border-amber-200/60 text-amber-900' :
            insight.type === 'info' ? 'bg-blue-50 border-blue-200/60 text-blue-900' :
            'bg-zinc-50 border-zinc-200/60 text-zinc-900';

          const icon = 
            insight.type === 'success' ? '📈' :
            insight.type === 'danger' ? '⚠️' :
            insight.type === 'warning' ? '🛑' :
            insight.type === 'info' ? '🔧' : '💡';

          return (
            <div key={idx} className={`border p-5 rounded-2xl shadow-premium flex gap-4 items-start transition-all ${colorStyles}`}>
              <div className="text-xl shrink-0 p-1.5 bg-white/80 rounded-xl border border-black/5 shadow-xs">{icon}</div>
              <div className="space-y-1">
                <h4 className="font-bold text-sm tracking-tight">{insight.title}</h4>
                <p className="text-xs opacity-85 leading-relaxed font-medium">{insight.message}</p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4">
        <div className="bg-white border border-zinc-200 p-4 rounded-xl shadow-xs">
          <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Top Variant</p>
          <p className="text-xs font-bold text-zinc-900 truncate mt-1" title={topPerformingItem}>{topPerformingItem}</p>
        </div>

        <div className="bg-white border border-zinc-200 p-4 rounded-xl shadow-xs">
          <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Item to be Improved</p>
          <p className="text-xs font-bold text-zinc-900 truncate mt-1" title={itemToBeImproved}>{itemToBeImproved}</p>
        </div>
        
        <div className="bg-white border border-zinc-200 p-4 rounded-xl shadow-xs">
          <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Critical Reviews</p>
          <p className="text-xs font-bold text-zinc-900 mt-1">{lowRatingReviews.length} Flagged</p>
        </div>

        <div className="bg-white border border-zinc-200 p-4 rounded-xl shadow-xs">
          <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Service Flags</p>
          <p className="text-xs font-bold text-zinc-900 mt-1">{criticalServiceReviews.length} Mentions</p>
        </div>
      </div>
    </div>
  );
}