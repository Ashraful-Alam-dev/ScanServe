import React, { createContext, useContext, useState, useEffect } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { ORDER_STATUSES, MOCK_MENU } from '../utils/mockData';
import toast from 'react-hot-toast';

const OrderContext = createContext();

export function OrderProvider({ children }) {
  const [orders, setOrders] = useLocalStorage('smart_resto_orders', []);
  const [cart, setCart] = useState([]);
  const [notifications, setNotifications] = useLocalStorage('smart_resto_notifications', []);
  
  const [reservations, setReservations] = useLocalStorage('smart_resto_reservations', []);
  
  const [reviews, setReviews] = useLocalStorage('smart_resto_reviews', [
    { id: 'REV-1', itemId: 'm1', itemName: 'Truffle Umami Burger', rating: 5, comment: 'Incredible depth of flavor. The brioche bun was exceptionally fresh.', timestamp: new Date().toISOString() },
    { id: 'REV-2', itemId: 'm2', itemName: 'Hot Honey Pepperoni Pizza', rating: 4, comment: 'Spicy and sweet ratio is exceptional, maybe slightly charry on the edges.', timestamp: new Date().toISOString() }
  ]);

  const [inventory, setInventory] = useLocalStorage('smart_resto_inventory', {
    'm1': { name: 'Truffle Umami Burger Stock', current: 42, minThreshold: 15, unit: 'patties' },
    'm2': { name: 'Hot Honey Pepperoni Pizza Sourdough', current: 8, minThreshold: 20, unit: 'dough balls' }, 
    'm3': { name: 'Smoked Rosemary Old Fashioned Bourbon', current: 85, minThreshold: 10, unit: 'pours' },
    'm4': { name: 'Deconstructed Matcha Tiramisu Mascarpone', current: 19, minThreshold: 8, unit: 'servings' }
  });

  const addToCart = (item, quantity) => {
    if (!item) return;
    const currentStock = inventory[item.id]?.current ?? 99;
    if (currentStock <= 0) {
      toast.error(`Apologies! ${item.name} is currently out of stock.`);
      return;
    }

    setCart((prevCart) => {
      const existing = prevCart.find((i) => i.id === item.id);
      const targetQty = existing ? existing.quantity + quantity : quantity;
      
      if (targetQty > currentStock) {
        toast.error(`Cannot add more items. Maximum available stock reached (${currentStock}).`);
        return prevCart;
      }

      if (existing) {
        return prevCart.map((i) => i.id === item.id ? { ...i, quantity: targetQty } : i);
      }
      return [...prevCart, { ...item, quantity }];
    });
    toast.success(`Added ${quantity}x ${item.name} to cart!`);
  };

  const updateCartQuantity = (id, quantity) => {
    const currentStock = inventory[id]?.current ?? 99;
    if (quantity > currentStock) {
      toast.error(`Operational stock limit reached (${currentStock} units).`);
      return;
    }
    if (quantity <= 0) {
      setCart((prev) => prev.filter((item) => item.id !== id));
      return;
    }
    setCart((prev) => prev.map((item) => (item.id === id ? { ...item, quantity } : item)));
  };

  const placeOrder = (customerName = "Guest Demo") => {
    if (!cart || cart.length === 0) return null;

    setInventory(prevInv => {
      const updated = { ...prevInv };
      cart.forEach(cartItem => {
        if (updated[cartItem.id]) {
          updated[cartItem.id].current = Math.max(0, updated[cartItem.id].current - cartItem.quantity);
        }
      });
      return updated;
    });

    const initialStatus = ORDER_STATUSES?.PENDING || 'PENDING';

    const newOrder = {
      id: `ORD-${Math.floor(100000 + Math.random() * 900000)}`,
      customerName,
      items: [...cart],
      total: cart.reduce((sum, item) => sum + (item.price || 0) * (item.quantity || 0), 0),
      status: initialStatus,
      timestamp: new Date().toISOString(),
    };

    setOrders((prevOrders) => [newOrder, ...(prevOrders || [])]);
    addNotification(newOrder.id, `Order ${newOrder.id} placed by ${customerName}!`, 'info');
    setCart([]);
    toast.success('Order processed and inventory stock deducted!', { icon: '📦' });
    return newOrder.id;
  };

  const updateOrderStatus = (orderId, nextStatus) => {
    setOrders((prevOrders) =>
      (prevOrders || []).map((order) => {
        if (order.id === orderId) {
          const updatedOrder = { ...order, status: nextStatus };
          let alertMsg = `Your order ${orderId} status updated to ${nextStatus}`;
          
          if (nextStatus === ORDER_STATUSES?.COOKING || nextStatus === 'COOKING') alertMsg = `🍳 Chef accepted order ${orderId}!`;
          if (nextStatus === ORDER_STATUSES?.COOKED || nextStatus === 'COOKED') alertMsg = `✨ Order ${orderId} is plate-ready!`;
          if (nextStatus === ORDER_STATUSES?.DELIVERED || nextStatus === 'DELIVERED') alertMsg = `🎉 Order ${orderId} has been served!`;

          addNotification(orderId, alertMsg, String(nextStatus).toLowerCase());
          return updatedOrder;
        }
        return order;
      })
    );
  };

  const createReservation = (reservationData) => {
    const newRes = {
      id: `RES-${Math.floor(1000 + Math.random() * 9000)}`,
      status: 'PENDING',
      ...reservationData
    };
    setReservations(prev => [newRes, ...(prev || [])]);
    toast.success(`Booking confirmed! Reference: ${newRes.id}`, { icon: '📅' });
    return newRes.id;
  };

  const updateReservationStatus = (id, nextStatus) => {
    setReservations((prevRes) =>
      (prevRes || []).map((res) => {
        if (res.id === id) {
          toast.success(`Reservation ${id} updated to ${nextStatus}!`);
          return { ...res, status: nextStatus };
        }
        return res;
      })
    );
  };

  const submitReview = (itemId, itemName, rating, comment) => {
    const newReview = {
      id: `REV-${Date.now()}`,
      itemId,
      itemName,
      rating: Number(rating),
      comment,
      timestamp: new Date().toISOString()
    };
    setReviews(prev => [newReview, ...(prev || [])]);
    toast.success(`Review posted for ${itemName}!`, { icon: '⭐' });
  };

  const addNotification = (orderId, message, type) => {
    const newNotif = {
      id: `NOTIF-${Date.now()}`,
      orderId,
      message,
      type,
      read: false,
      timestamp: new Date().toISOString(),
    };
    setNotifications((prev) => [newNotif, ...(prev || [])]);
  };

  const markAllNotificationsRead = () => {
    setNotifications((prev) => (prev || []).map((n) => ({ ...n, read: true })));
  };

  const generateAIReport = () => {
    const salesPerformance = {};
    (MOCK_MENU || []).forEach(item => { 
      salesPerformance[item.id] = { name: item.name, unitsSold: 0, revenue: 0, reviews: [] }; 
    });

    (orders || []).forEach(order => {
      (order?.items || []).forEach(item => {
        if (salesPerformance[item.id]) {
          salesPerformance[item.id].unitsSold += (item.quantity || 0);
          salesPerformance[item.id].revenue += (item.price || 0) * (item.quantity || 0);
        }
      });
    });

    (reviews || []).forEach(rev => {
      if (salesPerformance[rev.itemId]) {
        salesPerformance[rev.itemId].reviews.push(rev.rating);
      }
    });

    const menuDiagnostics = Object.keys(salesPerformance).map(id => {
      const data = salesPerformance[id];
      const avgReview = data.reviews.length ? (data.reviews.reduce((s, r) => s + r, 0) / data.reviews.length).toFixed(1) : 'N/A';
      return { id, ...data, avgReview };
    });

    const topSeller = [...menuDiagnostics].sort((a,b) => b.unitsSold - a.unitsSold)[0];
    const lowStockAlerts = Object.keys(inventory || {}).filter(id => inventory[id].current <= inventory[id].minThreshold).map(id => ({ name: inventory[id].name, current: inventory[id].current, unit: inventory[id].unit }));
    const criticalReviewAlerts = menuDiagnostics.filter(d => d.avgReview !== 'N/A' && Number(d.avgReview) <= 3.5);

    let summaryParagraph = `SyncServe optimization metrics identify strong market traction for the ${topSeller?.name || 'core menu'}. `;
    let logicActionableNode = "Maintain active price scaling strategies.";

    if (lowStockAlerts.length > 0) {
      summaryParagraph += `Critical supply bottlenecks discovered across ${lowStockAlerts.length} supply nodes. `;
      logicActionableNode = `Generate automated replenishment orders for ${lowStockAlerts.map(i => i.name).join(', ')} immediately to protect service velocity margins.`;
    }

    if (criticalReviewAlerts.length > 0) {
      summaryParagraph += `Warning: Quality scoring variance detected on product lines with lower consumer reviews.`;
    }

    return {
      metricsTable: menuDiagnostics,
      executiveSummary: summaryParagraph,
      prescriptiveAction: logicActionableNode,
      supplyChainAlertCount: lowStockAlerts.length,
      lowStockItems: lowStockAlerts
    };
  };

  return (
    <OrderContext.Provider
      value={{
        orders, cart, notifications, inventory, reservations, reviews,
        addToCart, updateCartQuantity, placeOrder, updateOrderStatus,
        markAllNotificationsRead, createReservation, updateReservationStatus, // Exported status update handler
        submitReview, generateAIReport
      }}
    >
      {children}
    </OrderContext.Provider>
  );
}

export function useOrders() {
  return useContext(OrderContext);
}