import React from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { 
  LayoutDashboard, Package, Wallet, User, LogOut, Truck 
} from "lucide-react";

export default function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const currentPath = location.pathname;

  // ========================================================
  // STYLING MIXINS (POPPINS, ENHANCED CONTRAST, ROUNDED-XL)
  // ========================================================

  // Detailed Desktop Main Links Styling
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

  const handleLogout = () => {
    localStorage.removeItem("deliveryToken");
    localStorage.removeItem("deliveryPartner");
    navigate("/login");
  };

  const menuItems = [
    { name: "Dashboard", path: "/", icon: LayoutDashboard },
    { name: "Orders Pipeline", path: "/orders", icon: Package },
    { name: "Earnings Log", path: "/earnings", icon: Wallet },
    { name: "My Profile", path: "/profile", icon: User },
  ];

  // Helper flags to highlight the left dock icons accurately
  const isHomeActive = currentPath === "/";
  const isOrdersActive = currentPath.startsWith("/orders");
  const isEarningsActive = currentPath.startsWith("/earnings");
  const isProfileActive = currentPath.startsWith("/profile");

  return (
    <>
      {/* DESKTOP SIDEBAR ARCHITECTURE */}
      <aside className="hidden md:flex h-screen sticky top-0 left-0 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 shrink-0 font-poppins select-none">
        
        {/* 1. LEFT ICON ONLY SIDEBAR (SLIM DOCK) */}
        <div className="w-16 bg-slate-50 dark:bg-slate-950 flex flex-col items-center py-6 justify-between border-r border-slate-200 dark:border-slate-800 h-full overflow-y-auto no-scrollbar shrink-0 gap-6">
          
          <div className="flex flex-col items-center gap-4 w-full px-2">
            {/* Delivery Fleet Brand Badge */}
            <div className="h-9 w-9 bg-gradient-to-tr from-emerald-600 to-teal-500 rounded-xl flex items-center justify-center text-white shadow-md shadow-emerald-600/10 text-sm shrink-0 mb-2">
              <Truck size={18} strokeWidth={2.5} />
            </div>
            
            <NavLink to="/" className={iconDockClass(isHomeActive)} title="Dashboard Overview">
              <LayoutDashboard size={19} strokeWidth={2} />
            </NavLink>

            <NavLink to="/orders" className={iconDockClass(isOrdersActive)} title="Shipments & Packages">
              <Package size={19} strokeWidth={2} />
            </NavLink>

            <NavLink to="/earnings" className={iconDockClass(isEarningsActive)} title="Financial Logs">
              <Wallet size={19} strokeWidth={2} />
            </NavLink>
          </div>

          <div className="flex flex-col items-center gap-4 w-full px-2 shrink-0">
            <NavLink 
              to="/profile" 
              className={`h-9 w-9 border rounded-full flex items-center justify-center cursor-pointer transition ${
                isProfileActive 
                  ? "bg-emerald-50 border-emerald-500 text-emerald-600 ring-2 ring-emerald-600/20 dark:bg-emerald-950 dark:border-emerald-500 dark:text-emerald-300" 
                  : "bg-slate-200 border-slate-300/50 hover:bg-slate-300 text-slate-600 dark:bg-slate-800 dark:border-slate-700 dark:hover:bg-slate-700 dark:text-slate-300"
              }`}
              title="Courier Account Profile"
            >
              <User size={16} />
            </NavLink>
          </div>

        </div>

        {/* 2. MAIN SIDEBAR (TEXT LINKS MENU DETAILED) */}
        <div className="w-52 bg-white dark:bg-slate-900 p-5 border-r border-slate-100 dark:border-slate-800 flex flex-col h-full overflow-hidden">
          
          {/* Header Title Block */}
          <div className="mb-6 py-1 shrink-0">
            <h1 className="text-base font-extrabold text-slate-900 dark:text-white tracking-wide uppercase">
              Partner Hub
            </h1>
            <p className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold tracking-widest uppercase mt-0.5">Logistics Node</p>
          </div>

          {/* Nav Links Scroller */}
          <div className="flex flex-col gap-1.5 flex-1 overflow-y-auto pr-1 no-scrollbar">
            <div className="pb-1.5 shrink-0">
              <p className="text-[10px] font-extrabold tracking-widest text-slate-400 dark:text-slate-500 uppercase px-2.5">Navigation</p>
            </div>

            {menuItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === "/"}
                className={navLinkClass}
              >
                <item.icon size={17} strokeWidth={2} />
                {item.name}
              </NavLink>
            ))}
          </div>

          {/* Sign Out Trigger Action */}
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
      </aside>

      {/* MOBILE BOTTOM TAB NAVIGATION BAR */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 flex justify-around py-2.5 z-50 shadow-lg font-poppins">
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.path === "/"}
            className={({ isActive }) =>
              `flex flex-col items-center gap-1 text-[10px] font-bold uppercase transition-all ${
                isActive ? "text-emerald-600 dark:text-emerald-400" : "text-slate-400 dark:text-slate-500"
              }`
            }
          >
            <item.icon size={19} strokeWidth={2} />
            <span className="scale-90 tracking-tight">{item.name.split(" ")[0]}</span>
          </NavLink>
        ))}
      </nav>
    </>
  );
}