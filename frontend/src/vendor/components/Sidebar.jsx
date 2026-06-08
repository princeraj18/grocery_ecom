import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { 
  BarChart3, ShoppingBag, PlusCircle, Truck, 
  Boxes, Ticket, MessageSquare, User, LogOut, Store 
} from "lucide-react";

export default function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();

  const menus = [
    { name: "Analytics", path: "/vendor/analytics", icon: BarChart3 },
    { name: "Products", path: "/vendor/products", icon: ShoppingBag },
    { name: "Add Product", path: "/vendor/products/create", icon: PlusCircle },
    { name: "Orders", path: "/vendor/orders", icon: Truck }, 
    { name: "Inventory", path: "/vendor/inventory", icon: Boxes },
    { name: "Coupons", path: "/vendor/coupons", icon: Ticket },
    { name: "Reviews", path: "/vendor/reviews", icon: MessageSquare },
    { name: "Profile", path: "/vendor/profile", icon: User },
  ];

  const handleLogout = () => {
    localStorage.removeItem("vendorToken");
    localStorage.removeItem("vendorData");
    navigate("/vendor/login");
  };

  return (
    <div className="flex h-screen sticky top-0 left-0 z-40 bg-slate-950 border-r border-slate-800 text-slate-200 font-poppins shrink-0">
      
      {/* 1. PRIMARY NAVIGATION RAIL (ICON RAIL - RIGHT SIDE) */}
      <div className="w-16 flex flex-col items-center py-6 border-r border-slate-900 bg-slate-950">
        <div className="mb-8 p-2 bg-emerald-600 rounded-lg text-white">
          <Store size={20} />
        </div>
        
        <div className="flex-1 flex flex-col gap-6">
          {menus.map((menu) => (
            <Link 
              key={menu.path} 
              to={menu.path}
              className={`p-2 rounded-lg transition-all duration-200 flex items-center justify-center ${
                location.pathname === menu.path 
                  ? 'bg-slate-800 text-emerald-400' 
                  : 'text-slate-500 hover:text-slate-300 hover:bg-slate-900'
              }`}
            >
              <menu.icon size={20} />
            </Link>
          ))}
        </div>
      </div>

      {/* 2. SECONDARY CONTEXT RAIL (TEXT LINKS - LEFT SIDE) */}
      <div className="w-52 flex flex-col justify-between py-6 px-4 bg-slate-950/50">
        <div>
          <h1 className="text-sm font-bold text-white mb-8 px-2">Vendor Portal</h1>
          <div className="space-y-1">
            {menus.map((menu) => (
              <Link
                key={menu.path}
                to={menu.path}
                className={`block px-3 py-2.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition-colors ${
                  location.pathname === menu.path
                    ? "bg-emerald-600/10 text-emerald-400"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                {menu.name}
              </Link>
            ))}
          </div>
        </div>

        <button 
          onClick={handleLogout}
          className="flex items-center gap-2 px-3 py-2.5 text-xs font-bold uppercase text-rose-400 hover:bg-rose-950/30 rounded-lg transition-colors"
        >
          <LogOut size={14} />
          Exit
        </button>
      </div>
    </div>
  );
}