import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { 
  LayoutDashboard, 
  Users, 
  Store, 
  ShoppingBag, 
  Truck, 
  CircleDollarSign, 
  Layers, 
  PlusCircle, 
  HelpCircle, 
  Settings, 
  User,
  Briefcase,
  Sliders
} from "lucide-react";

export default function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const currentPath = location.pathname;

  // ========================================================
  // LIGHT MODE STYLING TEMPLATES (POPPINS & SEMI-BOLD)
  // ========================================================
  
  // Main Text Links Styling
  const navLinkClass = ({ isActive }) =>
    `flex items-center gap-3 p-2.5 rounded-xl transition-all duration-200 text-xs font-semibold shrink-0 font-poppins ${
      isActive
        ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/10"
        : "text-slate-500 dark:text-slate-400 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white"
    }`;

  // Left Slim Icon Dock Links Styling
  const iconDockClass = (isActive) =>
    `p-3 rounded-xl transition-all duration-200 relative group shrink-0 ${
      isActive 
        ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/20" 
        : "text-slate-400 hover:bg-slate-100 hover:text-slate-800 dark:hover:bg-slate-800 dark:hover:text-white"
    }`;

  // Helper logic to highlight the category icon if any sub-route is active
  const isOverviewActive = currentPath === "/admin" || currentPath.startsWith("/admin/users") || currentPath.startsWith("/admin/vendors");
  const isOperationsActive = currentPath.startsWith("/admin/orders") || currentPath.startsWith("/admin/delivery-partners") || currentPath.startsWith("/admin/withdrawal-requests");
  const isManagementActive = currentPath.startsWith("/admin/variants") || currentPath.startsWith("/admin/categories");
  const isSupportActive = currentPath.startsWith("/admin/support");
  const isProfileActive = currentPath === "/profile";

  return (
    <div className="flex h-screen bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 sticky top-0 overflow-hidden select-none border-r border-slate-200 dark:border-slate-800 font-poppins">
      
      {/* ========================================================
          1. LEFT ICON ONLY SIDEBAR (SLIM DOCK CATEGORIES)
         ======================================================== */}
      <div className="w-16 bg-slate-50 dark:bg-slate-950 flex flex-col items-center py-6 justify-between border-r border-slate-200 dark:border-slate-800 h-full overflow-y-auto no-scrollbar shrink-0 gap-6">
        
        {/* Top Section & Category Group Shortcuts */}
        <div className="flex flex-col items-center gap-4 w-full px-2">
          {/* Workspace Brand Logo */}
          <div className="h-9 w-9 bg-gradient-to-tr from-indigo-600 to-violet-500 rounded-xl flex items-center justify-center font-black text-white tracking-wider shadow-md text-sm shrink-0 mb-2 font-poppins">
            A
          </div>
          
          {/* CATEGORY 1: OVERVIEW */}
          <NavLink to="/admin" className={iconDockClass(isOverviewActive)} title="Overview / Accounts">
            <LayoutDashboard size={20} strokeWidth={2} />
          </NavLink>

          {/* CATEGORY 2: OPERATIONS */}
          <NavLink to="/admin/orders" className={iconDockClass(isOperationsActive)} title="Operations & Logistics">
            <Briefcase size={20} strokeWidth={2} />
          </NavLink>

          {/* CATEGORY 3: MANAGEMENT / SETUP */}
          <NavLink to="/admin/variants/create" className={iconDockClass(isManagementActive)} title="Catalog Setup">
            <Sliders size={20} strokeWidth={2} />
          </NavLink>

          {/* Section Divider */}
          <hr className="w-8 border-slate-200 dark:border-slate-700 my-1 shrink-0" />

          {/* CATEGORY 4: HELP & SUPPORT */}
          <NavLink to="/admin/support" className={iconDockClass(isSupportActive)} title="System Support">
            <HelpCircle size={20} strokeWidth={2} />
          </NavLink>
        </div>

        {/* Bottom Section: Profile & System Settings Actions */}
        <div className="flex flex-col items-center gap-4 w-full px-2 shrink-0">
          <button onClick={()=>
            navigate("/setting")
          } className="p-2.5 rounded-xl text-slate-400 hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-white transition" title="Settings">
            <Settings size={20} />
          </button>
          
          {/* SECURE ROUTE REDIRECTION AVATAR NODE */}
          <button 
            onClick={() => navigate("/profile")}
            className={`h-9 w-9 border rounded-full flex items-center justify-center cursor-pointer transition ${ isProfileActive ? "bg-indigo-50 border-indigo-500 text-indigo-600 ring-2 ring-indigo-600/20 dark:bg-indigo-950 dark:border-indigo-500 dark:text-indigo-300" : "bg-slate-200 border-slate-300/50 hover:bg-slate-300 text-slate-600 dark:bg-slate-800 dark:border-slate-700 dark:hover:bg-slate-700 dark:text-slate-300" }`}
            title="Profile Credentials & Account Scope"
          >
            <User size={18} />
          </button>
        </div>

      </div>

      {/* ========================================================
          2. MAIN SIDEBAR (TEXT LINKS MENU DETAILED)
         ======================================================== */}
      <div className="w-64 bg-white dark:bg-slate-900 p-5 border-r border-slate-100 dark:border-slate-800 flex flex-col h-full overflow-hidden">
        
        {/* LOGO TITLE */}
        <div className="mb-6 py-1 shrink-0">
          <h1 className="text-xl font-extrabold text-slate-900 dark:text-white tracking-wide uppercase font-poppins">
            Admin Panel
          </h1>
          <p className="text-[10px] text-indigo-600 font-bold tracking-widest uppercase mt-0.5 font-poppins">Control Center</p>
        </div>

        {/* MENU LINK LIST */}
        <div className="flex flex-col gap-1.5 flex-1 overflow-y-auto pr-1 custom-sidebar-scroll">
          
          {/* SECTION: OVERVIEW */}
          <div className="pb-1.5 shrink-0">
            <p className="text-[10px] font-extrabold tracking-widest text-slate-400 uppercase px-2.5 font-poppins">Overview</p>
          </div>
          <NavLink to="/admin" className={navLinkClass} end>
            <LayoutDashboard size={18} strokeWidth={2} />
            Dashboard
          </NavLink>
          <NavLink to="/admin/users" className={navLinkClass}>
            <Users size={18} strokeWidth={2} />
            Users
          </NavLink>
          <NavLink to="/admin/vendors" className={navLinkClass}>
            <Store size={18} strokeWidth={2} />
            Vendors
          </NavLink>

          {/* SECTION: OPERATIONS */}
          <div className="pt-4 pb-1.5 shrink-0">
            <p className="text-[10px] font-extrabold tracking-widest text-slate-400 uppercase px-2.5 font-poppins">Operations</p>
          </div>
          <NavLink to="/admin/orders" className={navLinkClass}>
            <ShoppingBag size={18} strokeWidth={2} />
            Orders
          </NavLink>
          <NavLink to="/admin/delivery-partners" className={navLinkClass}>
            <Truck size={18} strokeWidth={2} />
            Delivery Partners
          </NavLink>
          <NavLink to="/admin/withdrawal-requests" className={navLinkClass}>
            <CircleDollarSign size={18} strokeWidth={2} />
            Withdrawal Requests
          </NavLink>

          {/* SECTION: CATALOG MANAGEMENT */}
          <div className="pt-4 pb-1.5 shrink-0">
            <p className="text-[10px] font-extrabold tracking-widest text-slate-400 uppercase px-2.5 font-poppins">Management</p>
          </div>
          <NavLink to="/admin/variants/create" className={navLinkClass}>
            <Layers size={18} strokeWidth={2} />
            Add Variant
          </NavLink>
          <NavLink to="/admin/categories/create" className={navLinkClass}>
            <PlusCircle size={18} strokeWidth={2} />
            Add Category
          </NavLink>

          {/* SECTION: SYSTEM SUPPORT */}
          <div className="pt-4 pb-1.5 shrink-0">
            <p className="text-[10px] font-extrabold tracking-widest text-slate-400 uppercase px-2.5 font-poppins">System</p>
          </div>
          <NavLink to="/admin/support" className={navLinkClass}>
            <HelpCircle size={18} strokeWidth={2} />
            Support
          </NavLink>

        </div>
      </div>

    </div>
  );
}