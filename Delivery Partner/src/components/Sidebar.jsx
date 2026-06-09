import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { 
  LayoutDashboard, Package, Wallet, User, LogOut 
} from "lucide-react";

export default function Sidebar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("deliveryToken");
    localStorage.removeItem("deliveryPartner");
    navigate("/login");
  };

  const menuItems = [
    { name: "Dashboard", path: "/", icon: LayoutDashboard },
    { name: "Orders", path: "/orders", icon: Package },
    { name: "Earnings", path: "/earnings", icon: Wallet },
    { name: "Profile", path: "/profile", icon: User },
  ];

  return (
    <>
      {/* =====================================
          DESKTOP SIDEBAR (DUAL RAIL - LIGHT THEME)
      ===================================== */}
      <aside className="hidden md:flex h-screen sticky top-0 left-0 bg-white border-r border-gray-200 shrink-0">
        
        {/* ICON RAIL (RIGHT SIDE) */}
        <div className="w-16 flex flex-col items-center py-6 border-r border-gray-100">
          <div className="flex-1 flex flex-col gap-6">
            {menuItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `p-2.5 rounded-xl transition-all duration-200 ${
                    isActive ? "bg-emerald-50 text-emerald-600" : "text-gray-400 hover:text-gray-600 hover:bg-gray-50"
                  }`
                }
              >
                <item.icon size={22} />
              </NavLink>
            ))}
          </div>
        </div>

        {/* TEXT CONTEXT RAIL (LEFT SIDE) */}
        <div className="w-48 flex flex-col justify-between py-6 px-4 bg-gray-50/50">
          <div className="space-y-1">
            <h2 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-6 px-3">Partner Hub</h2>
            {menuItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `block px-3 py-2.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition-colors ${
                    isActive ? "bg-emerald-50 text-emerald-600" : "text-gray-500 hover:text-gray-900"
                  }`
                }
              >
                {item.name}
              </NavLink>
            ))}
          </div>

          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-3 py-2.5 text-xs font-bold uppercase text-red-500 hover:bg-red-50 rounded-lg transition-colors"
          >
            <LogOut size={14} />
            Logout
          </button>
        </div>
      </aside>

      {/* =====================================
          MOBILE BOTTOM NAVIGATION (LIGHT THEME)
      ===================================== */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 flex justify-around py-3 z-50">
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex flex-col items-center gap-1 text-[10px] font-bold uppercase transition-all ${
                isActive ? "text-emerald-600" : "text-gray-400"
              }`
            }
          >
            <item.icon size={20} />
            {item.name}
          </NavLink>
        ))}
      </nav>
    </>
  );
}