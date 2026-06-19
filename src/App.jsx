import React from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { OrderProvider } from './context/OrderContext';
import CustomerHome from './pages/customer/CustomerWorkspace';
import TrackOrder from './pages/customer/TrackOrder';
import ManagementDashboard from './pages/management/ManagementWorkspace';

function WelcomePortal() {
  return (
    <div className="min-h-screen bg-surface-900 text-white flex flex-col justify-center items-center px-4 relative overflow-hidden">

      <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-brand-600/10 rounded-full blur-[120px]" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[600px] h-[600px] bg-emerald-500/10 rounded-full blur-[120px]" />

      <div className="text-center max-w-2xl z-10 space-y-6">
        <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 px-4 py-1.5 rounded-full text-xs font-medium text-brand-500 tracking-wide backdrop-blur-md">
          ✨ SyncServe Restaurant Prototype v4.0
        </div>
        
        <h1 className="text-5xl md:text-6xl font-bold tracking-tight bg-gradient-to-b from-white to-surface-200 bg-clip-text text-transparent">
          Next-Gen Culinary Operations.
        </h1>
        
        <p className="text-base text-zinc-400 max-w-md mx-auto">
          A high-fidelity business case prototype demonstrating instantaneous synchronization between customer experience and kitchen execution.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-lg mx-auto pt-8">
          <Link
            to="/customer"
            target="_blank"
            className="group relative flex flex-col items-start p-6 rounded-2xl bg-white/[0.03] border border-white/10 hover:border-brand-500/50 transition-all duration-300 text-left hover:shadow-[0_0_30px_rgba(16,185,129,0.05)]"
          >
            <div className="p-3 rounded-xl bg-brand-500/10 text-brand-500 mb-4 group-hover:scale-110 transition-transform">
              🛒
            </div>
            <h3 className="font-semibold text-lg text-white">Customer App</h3>
            <p className="text-xs text-zinc-400 mt-1">Browse digital menu, place instant orders, and view live real-time visual tracking pipelines.</p>
            <span className="text-xs text-brand-500 font-medium mt-4 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
              Open Client View →
            </span>
          </Link>

          <Link
            to="/management"
            target="_blank"
            className="group relative flex flex-col items-start p-6 rounded-2xl bg-white/[0.03] border border-white/10 hover:border-purple-500/50 transition-all duration-300 text-left hover:shadow-[0_0_30px_rgba(168,85,247,0.05)]"
          >
            <div className="p-3 rounded-xl bg-purple-500/10 text-purple-400 mb-4 group-hover:scale-110 transition-transform">
              📊
            </div>
            <h3 className="font-semibold text-lg text-white">Management Suite</h3>
            <p className="text-xs text-zinc-400 mt-1">Real-time order fulfillment pipeline, production control grids, and instant telemetry dashboards.</p>
            <span className="text-xs text-purple-400 font-medium mt-4 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
              Launch Console →
            </span>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <OrderProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<WelcomePortal />} />
          <Route path="/customer" element={<CustomerHome />} />
          <Route path="/customer/track/:orderId" element={<TrackOrder />} />
          <Route path="/management" element={<ManagementDashboard />} />
        </Routes>
      </BrowserRouter>
      <Toaster 
        position="top-right" 
        toastOptions={{
          className: 'glass-panel !text-zinc-900 font-medium border !border-zinc-200 shadow-premium text-sm py-3 px-4 rounded-xl',
          duration: 4000
        }} 
      />
    </OrderProvider>
  );
}