import React from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { 
  BarChart3, ShoppingBag, PlusCircle, Truck, 
  Boxes, Ticket, MessageSquare, User, LogOut, Store,
  Settings
} from "lucide-react";

export default function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const currentPath = location.pathname;

  // ========================================================
  // STYLING MIXINS (POPPINS, ENHANCED CONTRAST, ROUNDED-XL)
  // ========================================================
  
  // Detailed Right Panel Links Styling
  const navLinkClass = ({ isActive }) =>
    `flex items-center gap-3 p-2.5 rounded-xl transition-all duration-200 text-xs font-semibold shrink-0 font-poppins ${
      isActive
        ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/10"
        : "text-slate-500 dark:text-slate-400 hover:bg-slate-100 hover:text-slate-900 dark:hover:bg-slate-800 dark:hover:text-white"
    }`;

  // Left Slim Icon Dock Links Styling
  const iconDockClass = (isActive) =>
    `p-3 rounded-xl transition-all duration-200 relative group shrink-0 ${
      isActive 
        ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/20" 
        : "text-slate-400 hover:bg-slate-100 hover:text-slate-800 dark:text-slate-500 dark:hover:bg-slate-800 dark:hover:text-white"
    }`;

  // Helper states to light up structural dock shortcuts if sub-paths are active
  const isOverviewActive = currentPath === "/vendor/analytics";
  const isCatalogActive = currentPath.startsWith("/vendor/products") || currentPath.startsWith("/vendor/orders") || currentPath.startsWith("/vendor/inventory");
  const isPromoActive = currentPath.startsWith("/vendor/coupons") || currentPath.startsWith("/vendor/reviews");
  const isProfileActive = currentPath === "/vendor/profile";

  const handleLogout = () => {
    localStorage.removeItem("vendorToken");
    localStorage.removeItem("vendorData");
    navigate("/vendor/login");
  };

  return (
    <div className="flex h-screen bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 sticky top-0 overflow-hidden select-none border-r border-slate-200 dark:border-slate-800 font-poppins shrink-0">
      
      {/* ========================================================
          1. LEFT ICON ONLY SIDEBAR (SLIM DOCK CATEGORIES)
         ======================================================== */}
      <div className="w-16 bg-slate-50 dark:bg-slate-950 flex flex-col items-center py-6 justify-between border-r border-slate-200 dark:border-slate-800 h-full overflow-y-auto no-scrollbar shrink-0 gap-6">
        
        {/* Top Block: Brand Identifier & Short Links */}
        <div className="flex flex-col items-center gap-4 w-full px-2">
          {/* Vendor Channel Main Emblem */}
          <div className="h-9 w-9 bg-gradient-to-tr from-emerald-600 to-teal-500 rounded-xl flex items-center justify-center text-white shadow-md shadow-emerald-600/10 text-sm shrink-0 mb-2">
            <Store size={18} strokeWidth={2.5} />
          </div>
          
          {/* CATEGORY 1: ANALYTICS HUB */}
          <NavLink to="/vendor/analytics" className={iconDockClass(isOverviewActive)} title="Analytics Insights">
            <BarChart3 size={19} strokeWidth={2} />
          </NavLink>

          {/* CATEGORY 2: OPERATIONAL STOCKROOM */}
          <NavLink to="/vendor/products" className={iconDockClass(isCatalogActive)} title="Catalog & Logistics Management">
            <Boxes size={19} strokeWidth={2} />
          </NavLink>

          {/* CATEGORY 3: ENGAGEMENT MODULES */}
          <NavLink to="/vendor/coupons" className={iconDockClass(isPromoActive)} title="Offers & Reviews">
            <Ticket size={19} strokeWidth={2} />
          </NavLink>
        </div>

        {/* Bottom Block: Profile Context Node & Power Trigger */}
        <div className="flex flex-col items-center gap-4 w-full px-2 shrink-0">
          <NavLink 
            to="/vendor/profile" 
            className={`h-9 w-9 border rounded-full flex items-center justify-center cursor-pointer transition ${
              isProfileActive 
                ? "bg-emerald-50 border-emerald-500 text-emerald-600 ring-2 ring-emerald-600/20 dark:bg-emerald-950 dark:border-emerald-500 dark:text-emerald-300" 
                : "bg-slate-200 border-slate-300/50 hover:bg-slate-300 text-slate-600 dark:bg-slate-800 dark:border-slate-700 dark:hover:bg-slate-700 dark:text-slate-300"
            }`}
            title="Vendor Core Profile"
          >
            <User size={16} />
          </NavLink>
        </div>

      </div>

      {/* ========================================================
          2. MAIN SIDEBAR (TEXT LINKS MENU DETAILED)
         ======================================================== */}
      <div className="w-56 bg-white dark:bg-slate-900 p-5 border-r border-slate-100 dark:border-slate-800 flex flex-col h-full overflow-hidden">
        
        {/* LOGO TILES */}
        <div className="mb-6 py-1 shrink-0">
          <h1 className="text-base font-extrabold text-slate-900 dark:text-white tracking-wide uppercase">
            Vendor Portal
          </h1>
          <p className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold tracking-widest uppercase mt-0.5">Merchant Base</p>
        </div>

        {/* COMPONENT SCROLL SYSTEM CONTAINER */}
        <div className="flex flex-col gap-1.5 flex-1 overflow-y-auto pr-1 no-scrollbar">
          
          {/* SEGMENT 1: MATRICES OVERVIEW */}
          <div className="pb-1.5 shrink-0">
            <p className="text-[10px] font-extrabold tracking-widest text-slate-400 dark:text-slate-500 uppercase px-2.5">Performance</p>
          </div>
          <NavLink to="/vendor/analytics" className={navLinkClass}>
            <BarChart3 size={17} strokeWidth={2} />
            Analytics
          </NavLink>

          {/* SEGMENT 2: LOGISTICS CORE */}
          <div className="pt-4 pb-1.5 shrink-0">
            <p className="text-[10px] font-extrabold tracking-widest text-slate-400 dark:text-slate-500 uppercase px-2.5">Stock & Sales</p>
          </div>
          <NavLink to="/vendor/products" className={navLinkClass} end>
            <ShoppingBag size={17} strokeWidth={2} />
            Products List
          </NavLink>
          <NavLink to="/vendor/products/create" className={navLinkClass}>
            <PlusCircle size={17} strokeWidth={2} />
            Add New Product
          </NavLink>
          <NavLink to="/vendor/orders" className={navLinkClass}>
            <Truck size={17} strokeWidth={2} />
            Orders Pipeline
          </NavLink>
          <NavLink to="/vendor/inventory" className={navLinkClass}>
            <Boxes size={17} strokeWidth={2} />
            Inventory Audit
          </NavLink>

          {/* SEGMENT 3: PROMOTIONS AND REVIEWS */}
          <div className="pt-4 pb-1.5 shrink-0">
            <p className="text-[10px] font-extrabold tracking-widest text-slate-400 dark:text-slate-500 uppercase px-2.5">Marketing</p>
          </div>
          <NavLink to="/vendor/coupons" className={navLinkClass}>
            <Ticket size={17} strokeWidth={2} />
            Coupons Engine
          </NavLink>
          <NavLink to="/vendor/reviews" className={navLinkClass}>
            <MessageSquare size={17} strokeWidth={2} />
            Customer Reviews
          </NavLink>

          {/* SEGMENT 4: ACCOUNT MANAGEMENT */}
          <div className="pt-4 pb-1.5 shrink-0">
            <p className="text-[10px] font-extrabold tracking-widest text-slate-400 dark:text-slate-500 uppercase px-2.5">Settings</p>
          </div>
          <NavLink to="/vendor/profile" className={navLinkClass}>
            <User size={17} strokeWidth={2} />
            Profile Configuration
          </NavLink>

        </div>

        {/* FOOTER INTERFACE DISPATCH NODE */}
        <div className="pt-4 border-t border-slate-100 dark:border-slate-800/60 shrink-0">
          <button 
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-2.5 py-2.5 text-xs font-bold uppercase text-rose-500 hover:bg-rose-50 dark:text-rose-400 dark:hover:bg-rose-950/20 rounded-xl transition-all active:scale-[0.98]"
          >
            <LogOut size={16} strokeWidth={2.5} />
            Sign Out
          </button>
        </div>

      </div>
    </div>
  );
}