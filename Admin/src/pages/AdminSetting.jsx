import React, { useState, useEffect } from "react";
import { 
  Settings, 
  Store, 
  Truck, 
  CreditCard, 
  Save, 
  Loader2, 
  AlertCircle, 
  CheckCircle2,
  RefreshCw
} from "lucide-react";
import api from "../services/api";

const AdminSetting = () => {
  const [activeTab, setActiveTab] = useState("platform");
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Comprehensive System Configurations State matching production application features
  const [settings, setSettings] = useState({
    // Tab 1: Platform Meta
    siteName: "ShopEase Grocery",
    supportEmail: "support@shopease.com",
    isMaintenanceMode: false,
    currencySymbol: "INR (₹)",

    // Tab 2: Store Mechanics
    minOrderValue: 299,
    taxPercentage: 5,
    autoAssignDelivery: true,
    enableNotifications: true,

    // Tab 3: Logistics / Delivery Rules
    baseDeliveryFee: 40,
    freeDeliveryThreshold: 999,
    perKmSurcharge: 10,
    maxDeliveryRadiusKm: 15,

    // Tab 4: Gateways & Processing Flags
    enableCOD: true,
    enableOnlinePayment: true,
    testModeGateways: false
  });

  // =========================================
  // LOAD APP-WIDE CONFIGURATIONS FROM SERVER
  // =========================================
  const fetchSettings = async () => {
    try {
      setFetching(true);
      setError("");
      const { data } = await api.get("/admin/settings");
      if (data.success && data.settings) {
        setSettings(data.settings);
      }
    } catch (err) {
      console.error("SETTINGS SYNC FAILURE:", err);
      // Fallback message; keeping default values visually active if route is new
      setError(err.response?.data?.message || "Failed to sync settings from database cluster.");
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  // =========================================
  // CONTROL HANDLERS
  // =========================================
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSettings(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : type === "number" ? Number(value) : value
    }));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError("");
      setSuccess("");

      const { data } = await api.put("/admin/settings", settings);
      if (data.success) {
        setSuccess("Global platform configurations updated successfully.");
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    } catch (err) {
      console.error("SETTINGS SAVE CRASH:", err);
      setError(err.response?.data?.message || "Failed to commit system setting configurations.");
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="flex h-64 flex-col items-center justify-center text-slate-500 dark:text-slate-400 font-poppins gap-3">
        <Loader2 className="animate-spin text-indigo-600" size={32} />
        <span className="text-xs font-extrabold uppercase tracking-widest text-slate-400">
          Fetching Master Application Properties...
        </span>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 font-poppins">
      
      {/* HEADER BANNER */}
      <div className="border-b border-slate-200 dark:border-slate-800 pb-5 flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <Settings className="text-indigo-600 animate-spin-slow" size={26} />
            <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-white tracking-wide uppercase">
              System Settings Console
            </h1>
          </div>
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mt-1">
            Configure financial bounds, logistics variables, gateways, and platform state
          </p>
        </div>
        <button 
          onClick={fetchSettings}
          className="p-2 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-500 dark:text-slate-400 rounded-xl hover:bg-slate-50 transition cursor-pointer"
          title="Reload configurations"
        >
          <RefreshCw size={16} />
        </button>
      </div>

      {/* DISPATCH NOTIFICATIONS ALERTS */}
      {error && (
        <div className="rounded-xl border border-rose-100 bg-rose-50 p-4 text-rose-700 text-sm font-semibold flex items-center gap-3 shadow-xs">
          <AlertCircle className="shrink-0" size={18} />
          <p>{error}</p>
        </div>
      )}

      {success && (
        <div className="rounded-xl border border-emerald-100 bg-emerald-50 p-4 text-emerald-700 text-sm font-semibold flex items-center gap-3 shadow-xs">
          <CheckCircle2 className="shrink-0" size={18} />
          <p>{success}</p>
        </div>
      )}

      {/* MASTER SETTINGS WORKSPACE GRID */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-start">
        
        {/* SIDE TABS CONTROLLER BAR */}
        <div className="flex md:flex-col overflow-x-auto md:overflow-x-visible gap-2 bg-slate-200/50 p-1.5 rounded-2xl border border-slate-200 dark:border-slate-800/60 shrink-0 whitespace-nowrap">
          <button
            onClick={() => setActiveTab("platform")}
            className={`flex items-center gap-2.5 px-4 py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition w-full cursor-pointer ${ activeTab === "platform" ? "bg-indigo-600 text-white shadow-xs" : "text-slate-600 dark:text-slate-400 hover:bg-white dark:bg-slate-900/60" }`}
          >
            <Settings size={16} />
            <span>Platform</span>
          </button>
          
          <button
            onClick={() => setActiveTab("store")}
            className={`flex items-center gap-2.5 px-4 py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition w-full cursor-pointer ${ activeTab === "store" ? "bg-indigo-600 text-white shadow-xs" : "text-slate-600 dark:text-slate-400 hover:bg-white dark:bg-slate-900/60" }`}
          >
            <Store size={16} />
            <span>Store Operations</span>
          </button>

          <button
            onClick={() => setActiveTab("logistics")}
            className={`flex items-center gap-2.5 px-4 py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition w-full cursor-pointer ${ activeTab === "logistics" ? "bg-indigo-600 text-white shadow-xs" : "text-slate-600 dark:text-slate-400 hover:bg-white dark:bg-slate-900/60" }`}
          >
            <Truck size={16} />
            <span>Logistics Rules</span>
          </button>

          <button
            onClick={() => setActiveTab("gateways")}
            className={`flex items-center gap-2.5 px-4 py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition w-full cursor-pointer ${ activeTab === "gateways" ? "bg-indigo-600 text-white shadow-xs" : "text-slate-600 dark:text-slate-400 hover:bg-white dark:bg-slate-900/60" }`}
          >
            <CreditCard size={16} />
            <span>Gateways</span>
          </button>
        </div>

        {/* INPUT PANEL CANVAS */}
        <form onSubmit={handleFormSubmit} className="md:col-span-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xs overflow-hidden">
          
          <div className="p-6 md:p-8 space-y-6 min-h-[300px]">
            
            {/* TAB 1: GENERAL PLATFORM CONTEXT */}
            {activeTab === "platform" && (
              <div className="space-y-5 animate-fadeIn">
                <h3 className="text-sm font-black text-slate-800 dark:text-slate-100 uppercase tracking-widest border-b border-slate-100 dark:border-slate-800 pb-2">Platform Identity Configuration</h3>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-extrabold uppercase text-slate-400 tracking-wider">Application Platform Name</label>
                    <input 
                      type="text" name="siteName" value={settings.siteName} onChange={handleInputChange} required
                      className="w-full text-xs font-semibold px-4 py-3 bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-xl focus:bg-white dark:bg-slate-900 focus:ring-2 focus:ring-indigo-100 focus:border-indigo-600 transition outline-hidden text-slate-800 dark:text-slate-100"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-extrabold uppercase text-slate-400 tracking-wider">System Support Email</label>
                    <input 
                      type="email" name="supportEmail" value={settings.supportEmail} onChange={handleInputChange} required
                      className="w-full text-xs font-semibold px-4 py-3 bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-xl focus:bg-white dark:bg-slate-900 focus:ring-2 focus:ring-indigo-100 focus:border-indigo-600 transition outline-hidden text-slate-800 dark:text-slate-100"
                    />
                  </div>
                </div>

                <div className="p-4 rounded-xl border border-amber-100 bg-amber-50/60 flex items-center justify-between gap-4">
                  <div>
                    <h4 className="text-xs font-bold text-amber-800 uppercase tracking-wide">Emergency System Maintenance Mode</h4>
                    <p className="text-[11px] text-amber-600 font-medium mt-0.5">Activating this locks client applications and blocks new ordering pipelines across endpoints.</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input 
                      type="checkbox" name="isMaintenanceMode" checked={settings.isMaintenanceMode} onChange={handleInputChange}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-slate-200 peer-focus:outline-hidden rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white dark:bg-slate-900 after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-500"></div>
                  </label>
                </div>
              </div>
            )}

            {/* TAB 2: STORE CART MECHANICS */}
            {activeTab === "store" && (
              <div className="space-y-5 animate-fadeIn">
                <h3 className="text-sm font-black text-slate-800 dark:text-slate-100 uppercase tracking-widest border-b border-slate-100 dark:border-slate-800 pb-2">Operational Bounds Parameters</h3>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-extrabold uppercase text-slate-400 tracking-wider">Minimum Cart Total Checkout (₹)</label>
                    <input 
                      type="number" name="minOrderValue" value={settings.minOrderValue} onChange={handleInputChange} min="0" required
                      className="w-full text-xs font-semibold px-4 py-3 bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-xl focus:bg-white dark:bg-slate-900 focus:ring-2 focus:ring-indigo-100 focus:border-indigo-600 transition outline-hidden text-slate-800 dark:text-slate-100"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-extrabold uppercase text-slate-400 tracking-wider">Global Order Tax Assessment (%)</label>
                    <input 
                      type="number" name="taxPercentage" value={settings.taxPercentage} onChange={handleInputChange} min="0" max="100" required
                      className="w-full text-xs font-semibold px-4 py-3 bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-xl focus:bg-white dark:bg-slate-900 focus:ring-2 focus:ring-indigo-100 focus:border-indigo-600 transition outline-hidden text-slate-800 dark:text-slate-100"
                    />
                  </div>
                </div>

                <hr className="border-slate-100 dark:border-slate-800" />

                <div className="flex items-center justify-between p-2.5">
                  <div>
                    <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wide">Automated Delivery Partner Engine</h4>
                    <p className="text-[11px] text-slate-400 font-medium mt-0.5">Intelligently match incoming orders to the closest active delivery agent automatically.</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input 
                      type="checkbox" name="autoAssignDelivery" checked={settings.autoAssignDelivery} onChange={handleInputChange}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-slate-200 peer-focus:outline-hidden rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white dark:bg-slate-900 after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                  </label>
                </div>
              </div>
            )}

            {/* TAB 3: LOGISTICS AND DISTANCE CONSTANTS */}
            {activeTab === "logistics" && (
              <div className="space-y-5 animate-fadeIn">
                <h3 className="text-sm font-black text-slate-800 dark:text-slate-100 uppercase tracking-widest border-b border-slate-100 dark:border-slate-800 pb-2">Logistics Pricing Formulas</h3>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-extrabold uppercase text-slate-400 tracking-wider">Base Courier Setup Fee (₹)</label>
                    <input 
                      type="number" name="baseDeliveryFee" value={settings.baseDeliveryFee} onChange={handleInputChange} min="0" required
                      className="w-full text-xs font-semibold px-4 py-3 bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-xl focus:bg-white dark:bg-slate-900 focus:ring-2 focus:ring-indigo-100 focus:border-indigo-600 transition outline-hidden text-slate-800 dark:text-slate-100"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-extrabold uppercase text-slate-400 tracking-wider">Free Delivery Cart Waiver (₹)</label>
                    <input 
                      type="number" name="freeDeliveryThreshold" value={settings.freeDeliveryThreshold} onChange={handleInputChange} min="0" required
                      className="w-full text-xs font-semibold px-4 py-3 bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-xl focus:bg-white dark:bg-slate-900 focus:ring-2 focus:ring-indigo-100 focus:border-indigo-600 transition outline-hidden text-slate-800 dark:text-slate-100"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-extrabold uppercase text-slate-400 tracking-wider">Distance Scaler Surcharge (₹ / km)</label>
                    <input 
                      type="number" name="perKmSurcharge" value={settings.perKmSurcharge} onChange={handleInputChange} min="0" required
                      className="w-full text-xs font-semibold px-4 py-3 bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-xl focus:bg-white dark:bg-slate-900 focus:ring-2 focus:ring-indigo-100 focus:border-indigo-600 transition outline-hidden text-slate-800 dark:text-slate-100"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-extrabold uppercase text-slate-400 tracking-wider">Maximum Shipping Boundary (km)</label>
                    <input 
                      type="number" name="maxDeliveryRadiusKm" value={settings.maxDeliveryRadiusKm} onChange={handleInputChange} min="1" required
                      className="w-full text-xs font-semibold px-4 py-3 bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-xl focus:bg-white dark:bg-slate-900 focus:ring-2 focus:ring-indigo-100 focus:border-indigo-600 transition outline-hidden text-slate-800 dark:text-slate-100"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* TAB 4: GATEWAYS SWITCH BOARD */}
            {activeTab === "gateways" && (
              <div className="space-y-5 animate-fadeIn">
                <h3 className="text-sm font-black text-slate-800 dark:text-slate-100 uppercase tracking-widest border-b border-slate-100 dark:border-slate-800 pb-2">Active Financial Channels</h3>
                
                <div className="space-y-1">
                  <div className="flex items-center justify-between p-3 rounded-xl border border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:bg-slate-900/50 transition">
                    <div>
                      <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wide">Cash On Delivery (COD)</h4>
                      <p className="text-[11px] text-slate-400 font-medium">Allow physical payment clearing strings upon order drop off.</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input 
                        type="checkbox" name="enableCOD" checked={settings.enableCOD} onChange={handleInputChange}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-slate-200 peer-focus:outline-hidden rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white dark:bg-slate-900 after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between p-3 rounded-xl border border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:bg-slate-900/50 transition">
                    <div>
                      <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wide">Online Digital Gateways (Razorpay/Stripe)</h4>
                      <p className="text-[11px] text-slate-400 font-medium">Activate processing hooks for credit cards, digital wallets, and UPI networks.</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input 
                        type="checkbox" name="enableOnlinePayment" checked={settings.enableOnlinePayment} onChange={handleInputChange}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-slate-200 peer-focus:outline-hidden rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white dark:bg-slate-900 after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                    </label>
                  </div>
                </div>

                <div className="p-4 rounded-xl border border-rose-100 bg-rose-50/60 flex items-center justify-between gap-4">
                  <div>
                    <h4 className="text-xs font-bold text-rose-800 uppercase tracking-wide">Sandbox / Test Mode Execution</h4>
                    <p className="text-[11px] text-rose-600 font-medium mt-0.5">Forces all active online checkout pipelines into simulated test modes instead of calling live bank accounts.</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input 
                      type="checkbox" name="testModeGateways" checked={settings.testModeGateways} onChange={handleInputChange}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-slate-200 peer-focus:outline-hidden rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white dark:bg-slate-900 after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-rose-500"></div>
                  </label>
                </div>
              </div>
            )}

          </div>

          {/* PERSISTENCE DECK ACTION PANEL FOOTER */}
          <div className="px-6 py-4 bg-slate-50 dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs uppercase tracking-wider transition flex items-center gap-2 shadow-sm disabled:opacity-60 cursor-pointer"
            >
              {loading ? (
                <Loader2 className="animate-spin" size={14} />
              ) : (
                <Save size={14} />
              )}
              <span>Commit Changes to System</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};

export default AdminSetting;