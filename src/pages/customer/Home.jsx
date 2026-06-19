import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useOrders } from '../../context/OrderContext';
import { MOCK_MENU } from '../../utils/mockData';

export default function CustomerHome() {
  const { 
    cart = [], 
    addToCart, 
    updateCartQuantity, 
    placeOrder, 
    orders = [], 
    notifications = [], 
    markAllNotificationsRead,
    submitReview
  } = useOrders() || {};

  const [selectedCategory, setSelectedCategory] = useState('All');
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [customerName, setCustomerName] = useState('');
  
  const [activeReviewOrderId, setActiveReviewOrderId] = useState(null);
  const [reviewForm, setReviewForm] = useState({ rating: 5, comment: '' });

  const navigate = useNavigate();

  const categories = ['All', ...new Set((MOCK_MENU || []).map(item => item?.category).filter(Boolean))];
  const filteredMenu = selectedCategory === 'All' 
    ? (MOCK_MENU || []) 
    : (MOCK_MENU || []).filter(item => item?.category === selectedCategory);

  const cartTotal = (cart || []).reduce((sum, item) => sum + ((item?.price || 0) * (item?.quantity || 0)), 0);
  const unreadNotifs = (notifications || []).filter(n => n && !n.read).length;

  const handleCheckout = (e) => {
    e.preventDefault();
    const activeName = customerName.trim() || "Guest Demo Room";
    if (typeof placeOrder === 'font-bold') return; 
    const placedId = placeOrder(activeName);
    if (placedId) {
      setIsCartOpen(false);
      setCustomerName('');
      navigate(`/customer/track/${placedId}`);
    }
  };

  const handleReviewSubmit = (e, order) => {
    e.preventDefault();
    if (!submitReview || !order?.items?.[0]) return;
    
    const flagshipItem = order.items[0];
    submitReview(flagshipItem.id, flagshipItem.name, reviewForm.rating, reviewForm.comment);
 
    setActiveReviewOrderId(null);
    setReviewForm({ rating: 5, comment: '' });
  };

  return (
    <div className="min-h-screen bg-surface-50 text-zinc-900 antialiased font-sans pb-16">
      <header className="sticky top-0 z-40 glass-panel bg-white/80 border-b border-zinc-200/60 backdrop-blur-md px-6 py-4 flex items-center justify-between shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-brand-600 rounded-xl flex items-center justify-center text-white text-lg font-black shadow-xs">
            S
          </div>
          <div>
            <h1 className="font-bold text-base tracking-tight">SYNCSERVE</h1>
            <p className="text-[10px] text-zinc-400 font-medium uppercase tracking-widest -mt-1">Bespoke Dining</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative">
            <button 
              onClick={() => { setIsNotifOpen(!isNotifOpen); markAllNotificationsRead && markAllNotificationsRead(); }}
              className="p-2.5 rounded-full hover:bg-zinc-100 border border-zinc-200/50 transition-colors relative cursor-pointer"
            >
              🔔
              {unreadNotifs > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 rounded-full text-[9px] font-bold text-white flex items-center justify-center animate-pulse">
                  {unreadNotifs}
                </span>
              )}
            </button>

            {isNotifOpen && (
              <div className="absolute right-0 mt-3 w-80 bg-white border border-zinc-200 rounded-2xl shadow-premium p-4 z-50 animate-in fade-in slide-in-from-top-3 duration-200">
                <h4 className="font-bold text-sm mb-3 flex items-center justify-between">
                  <span>Operational Status Alerts</span>
                  <span className="text-xs font-normal text-zinc-400">Live Telemetry</span>
                </h4>
                <div className="space-y-2.5 max-h-64 overflow-y-auto pr-1">
                  {!notifications || notifications.length === 0 ? (
                    <p className="text-xs text-zinc-400 text-center py-6">No real-time status transitions tracked yet.</p>
                  ) : (
                    notifications.map(n => (
                      <div key={n?.id} className="p-2.5 rounded-xl bg-zinc-50 border border-zinc-100 text-xs text-zinc-700">
                        <p className="font-medium text-zinc-900">{n?.message}</p>
                        <span className="text-[9px] text-zinc-400 block mt-1">
                          {n?.timestamp ? new Date(n.timestamp).toLocaleTimeString() : ''}
                        </span>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          <button 
            onClick={() => setIsCartOpen(true)}
            className="flex items-center gap-2.5 bg-zinc-900 hover:bg-zinc-800 text-white px-4 py-2 rounded-xl text-sm font-semibold transition-all shadow-xs cursor-pointer"
          >
            🛒 <span>Cart</span>
            <span className="bg-brand-500 text-white px-2 py-0.5 rounded-md text-xs font-bold">
              {(cart || []).reduce((sum, item) => sum + (item?.quantity || 0), 0)}
            </span>
          </button>
        </div>
      </header>

      <section className="max-w-7xl mx-auto px-6 pt-12 pb-8">
        <div className="space-y-12 animate-in fade-in duration-300">

          <div className="bg-gradient-to-br from-zinc-900 to-zinc-800 rounded-3xl p-8 md:p-12 text-white relative overflow-hidden shadow-premium">
            <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-brand-500/10 rounded-full blur-[80px] pointer-events-none" />
            <div className="max-w-xl space-y-4">
              <span className="text-brand-500 uppercase tracking-widest text-xs font-bold bg-brand-500/10 px-3 py-1 rounded-full border border-brand-500/20">Table 04 Premium Portal</span>
              <h2 className="text-4xl md:text-5xl font-black tracking-tight leading-none">Experience Haute Cuisine in Real-Time.</h2>
              <p className="text-zinc-400 text-sm md:text-base font-normal">
                Select items from our digital culinary suite below. Watch our live kitchen process your exact selections frame-by-frame via smart operations synchronization.
              </p>
            </div>
          </div>

          <div className="flex gap-2 border-b border-zinc-200 pb-4 overflow-x-auto scrollbar-none">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-5 py-2 rounded-xl text-xs font-semibold tracking-wide transition-all border whitespace-nowrap cursor-pointer ${
                  selectedCategory === cat 
                    ? 'bg-brand-600 border-brand-600 text-white shadow-xs' 
                    : 'bg-white border-zinc-200 text-zinc-600 hover:bg-zinc-50'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredMenu.map(item => {
              const inCart = (cart || []).find(i => i?.id === item?.id);
              return (
                <div key={item?.id} className="bg-white border border-zinc-200/80 rounded-2xl overflow-hidden shadow-premium flex flex-col group hover:border-zinc-300 transition-all duration-300">
                  <div className="h-44 overflow-hidden relative">
                    <img src={item?.image} alt={item?.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    <span className="absolute top-3 right-3 bg-white/90 backdrop-blur-md text-zinc-900 text-xs font-bold px-2.5 py-1 rounded-lg border border-white/40 shadow-xs">
                      BDT {item?.price?.toFixed(2)}
                    </span>
                  </div>
                  <div className="p-5 flex flex-col flex-1 justify-between space-y-4">
                    <div>
                      <h3 className="font-bold text-base text-zinc-900 group-hover:text-brand-600 transition-colors">{item?.name}</h3>
                      <p className="text-xs text-zinc-500 mt-1 line-clamp-2 leading-relaxed">{item?.description}</p>
                    </div>
 
                    <div className="flex items-center justify-between pt-2">
                      {inCart ? (
                        <div className="flex items-center bg-zinc-100 border border-zinc-200 rounded-xl w-full justify-between p-1">
                          <button 
                            onClick={() => updateCartQuantity && updateCartQuantity(item.id, inCart.quantity - 1)}
                            className="w-8 h-8 rounded-lg hover:bg-white text-zinc-600 font-bold text-xs flex items-center justify-center transition-colors cursor-pointer"
                          >
                            －
                          </button>
                          <span className="text-xs font-bold text-zinc-900">{inCart.quantity} in cart</span>
                          <button 
                            onClick={() => updateCartQuantity && updateCartQuantity(item.id, inCart.quantity + 1)}
                            className="w-8 h-8 rounded-lg hover:bg-white text-zinc-600 font-bold text-xs flex items-center justify-center transition-colors cursor-pointer"
                          >
                            ＋
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => addToCart && addToCart(item, 1)}
                          className="w-full bg-zinc-50 border border-zinc-200 hover:bg-brand-600 hover:border-brand-600 hover:text-white text-zinc-800 font-semibold text-xs py-2.5 px-4 rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer"
                        >
                          Add to Cart
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {orders && orders.length > 0 && (
          <div className="mt-16 border-t border-zinc-200 pt-12">
            <h3 className="font-bold text-xl tracking-tight mb-6 flex items-center gap-2">
              <span>📋 Active Live Session Pipeline</span>
              <span className="bg-brand-50 text-brand-600 px-2 py-0.5 rounded-md text-xs font-semibold">
                {orders.length} Tracked
              </span>
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {orders.map(order => {
                const isDelivered = order?.status === 'DELIVERED';
                const isReviewingThis = activeReviewOrderId === order.id;

                return (
                  <div 
                    key={order?.id} 
                    className="bg-white border border-zinc-200 p-5 rounded-2xl shadow-premium hover:border-zinc-300 transition-all flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex justify-between items-start mb-3">
                        <div onClick={() => navigate(`/customer/track/${order?.id}`)} className="cursor-pointer group">
                          <span className="text-xs font-mono font-bold text-zinc-400 group-hover:text-brand-600 transition-colors">{order?.id}</span>
                          <h4 className="font-bold text-sm text-zinc-800 mt-0.5">Account: {order?.customerName}</h4>
                        </div>
                        <span className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider ${
                          isDelivered ? 'bg-emerald-50 text-emerald-600 border border-emerald-200' :
                          order?.status === 'COOKED' ? 'bg-blue-50 text-blue-600 border border-blue-200 animate-pulse' :
                          'bg-amber-50 text-amber-600 border border-amber-200'
                        }`}>
                          {order?.status}
                        </span>
                      </div>
                      
                      <p className="text-xs text-zinc-500 line-clamp-1 border-b border-zinc-100 pb-3 mb-3">
                        {(order?.items || []).map(i => `${i?.quantity}x ${i?.name}`).join(', ')}
                      </p>
                    </div>

                    <div className="space-y-3">
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-zinc-400">
                          {order?.timestamp ? new Date(order.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : ''}
                        </span>
                        <div className="flex items-center gap-3">
                          <span className="font-bold text-zinc-900">BDT {order?.total?.toFixed(2)}</span>

                          {isDelivered && !isReviewingThis && (
                            <button 
                              onClick={() => {
                                setActiveReviewOrderId(order.id);
                                setReviewForm({ rating: 5, comment: '' });
                              }}
                              className="bg-zinc-100 text-zinc-800 hover:bg-zinc-900 hover:text-white px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer"
                            >
                              ⭐ Review
                            </button>
                          )}
                        </div>
                      </div>

                      {isReviewingThis && (
                        <form onSubmit={(e) => handleReviewSubmit(e, order)} className="bg-zinc-50 border border-zinc-200/60 rounded-xl p-3 mt-2 space-y-2.5 animate-in fade-in slide-in-from-bottom-2 duration-200">
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wide">Gastronomic Rating</span>
                            <div className="flex gap-1">
                              {[1, 2, 3, 4, 5].map(star => (
                                <button 
                                  type="button" 
                                  key={star} 
                                  onClick={() => setReviewForm({...reviewForm, rating: star})} 
                                  className={`text-sm cursor-pointer transition-transform active:scale-90 ${star <= reviewForm.rating ? 'opacity-100' : 'opacity-25'}`}
                                >
                                  ⭐
                                </button>
                              ))}
                            </div>
                          </div>
                          <input 
                            type="text" 
                            required 
                            placeholder="Share your culinary assessment..." 
                            value={reviewForm.comment}
                            onChange={e => setReviewForm({...reviewForm, comment: e.target.value})}
                            className="w-full border border-zinc-200 bg-white rounded-lg px-2.5 py-1.5 text-xs focus:outline-hidden focus:border-brand-500"
                          />
                          <div className="flex gap-2 justify-end">
                            <button 
                              type="button" 
                              onClick={() => setActiveReviewOrderId(null)} 
                              className="text-[10px] font-bold text-zinc-400 hover:text-zinc-600 px-2 py-1"
                            >
                              Cancel
                            </button>
                            <button 
                              type="submit" 
                              className="bg-brand-600 hover:bg-brand-700 text-white font-bold text-[10px] px-3 py-1 rounded-md shadow-xs cursor-pointer"
                            >
                              Submit
                            </button>
                          </div>
                        </form>
                      )}
                    </div>

                  </div>
                );
              })}
            </div>
          </div>
        )}
      </section>

      {/* Slide-out Sidebar Cart Drawer */}
      {isCartOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden flex justify-end animate-in fade-in duration-200">
          <div className="absolute inset-0 bg-zinc-900/40 backdrop-blur-xs transition-opacity" onClick={() => setIsCartOpen(false)} />
          
          <div className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col p-6 border-l border-zinc-200 animate-in slide-in-from-right duration-300">
            <div className="flex items-center justify-between pb-4 border-b border-zinc-100">
              <h3 className="font-bold text-lg text-zinc-900">Your Gourmet Order</h3>
              <button onClick={() => setIsCartOpen(false)} className="text-zinc-400 hover:text-zinc-600 text-lg">✕</button>
            </div>

            {/* Cart Scroll Manifest Container */}
            <div className="flex-1 overflow-y-auto py-4 space-y-4">
              {!cart || cart.length === 0 ? (
                <div className="text-center py-16 space-y-3">
                  <div className="text-4xl">🍽️</div>
                  <p className="text-sm font-semibold text-zinc-400">Your manifest canvas is blank.</p>
                </div>
              ) : (
                cart.map(item => (
                  <div key={item?.id} className="flex gap-4 bg-zinc-50 border border-zinc-100 p-3 rounded-xl">
                    <img src={item?.image} alt={item?.name} className="w-16 h-16 object-cover rounded-lg" />
                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-xs text-zinc-900 truncate">{item?.name}</h4>
                      <p className="text-xs text-brand-600 font-semibold mt-0.5">BDT {item?.price?.toFixed(2)}</p>
                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center gap-2">
                          <button onClick={() => updateCartQuantity && updateCartQuantity(item.id, item.quantity - 1)} className="text-xs font-bold text-zinc-400 hover:text-zinc-900">－</button>
                          <span className="text-xs font-bold px-1.5">{item?.quantity}</span>
                          <button onClick={() => updateCartQuantity && updateCartQuantity(item.id, item.quantity + 1)} className="text-xs font-bold text-zinc-400 hover:text-zinc-900">＋</button>
                        </div>
                        <span className="text-xs font-bold text-zinc-800">BDT {((item?.price || 0) * (item?.quantity || 0)).toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Operational Verification Checkout Form Footer */}
            {cart && cart.length > 0 && (
              <form onSubmit={handleCheckout} className="border-t border-zinc-100 pt-4 space-y-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-zinc-400 tracking-wider mb-1.5">Customer Code</label>
                  <input 
                    type="text" 
                    placeholder="Unique Identity"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    required
                    className="w-full border border-zinc-200 bg-zinc-50 rounded-xl px-3.5 py-2.5 text-xs font-medium focus:outline-hidden focus:border-brand-500 focus:bg-white transition-all"
                  />
                </div>
                <div className="space-y-1.5 text-xs text-zinc-500 py-1 border-b border-zinc-100 border-dashed">
                  <div className="flex justify-between"><span>Subtotal Ledger</span><span>BDT {cartTotal.toFixed(2)}</span></div>
                  <div className="flex justify-between font-bold text-sm text-zinc-900 pt-1"><span>Total Estimated Due</span><span>BDT {cartTotal.toFixed(2)}</span></div>
                </div>
                <button 
                  type="submit" 
                  className="w-full bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs py-3.5 rounded-xl transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer"
                >
                  🚀 Confirm Order
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}