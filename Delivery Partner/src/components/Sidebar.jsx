import React from "react";
import {
  NavLink,
  useNavigate,
} from "react-router-dom";

export default function Sidebar() {

  const navigate =
    useNavigate();

  // =====================================
  // LOGOUT FUNCTION
  // =====================================
  const handleLogout =
    () => {

      // Remove Token
      localStorage.removeItem(
        "deliveryToken"
      );

      // Optional:
      localStorage.removeItem(
        "deliveryPartner"
      );

      // Redirect to Login
      navigate("/login");
    };

  // =====================================
  // MENU ITEMS
  // =====================================
  const menuItems = [
    {
      name: "Dashboard",
      icon: "📊",
      path: "/",
    },
    {
      name: "Orders",
      icon: "📦",
      path: "/orders",
    },
    {
      name: "Earnings",
      icon: "💰",
      path: "/earnings",
    },
    {
      name: "Profile",
      icon: "👤",
      path: "/profile",
    },
  ];

  return (
    <>

      {/* =====================================
          DESKTOP SIDEBAR
      ===================================== */}
      <aside className="hidden md:flex flex-col w-64 bg-slate-900 text-slate-300 h-[calc(100vh-4rem)] p-4 border-r border-slate-800">

        {/* MENU */}
        <div className="space-y-2 flex-1">

          {menuItems.map(
            (
              item,
              index
            ) => (

              <NavLink
                key={index}
                to={item.path}
                className={({
                  isActive,
                }) =>
                  `w-full flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-200 hover:bg-slate-800 hover:text-white ${
                    isActive
                      ? "bg-orange-500/10 text-orange-500 font-semibold"
                      : "text-slate-400"
                  }`
                }
              >

                <span className="text-xl">
                  {item.icon}
                </span>

                <span>
                  {item.name}
                </span>

              </NavLink>
            )
          )}

        </div>

        {/* =====================================
            LOGOUT BUTTON
        ===================================== */}
        <button
          onClick={
            handleLogout
          }
          className="w-full flex items-center gap-4 px-4 py-3 rounded-xl text-red-400 hover:bg-red-500/10 transition-colors mt-auto"
        >

          <span>
            🚪
          </span>

          <span>
            Logout
          </span>

        </button>

      </aside>

      {/* =====================================
          MOBILE BOTTOM NAVIGATION
      ===================================== */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-slate-900 border-t border-slate-800 flex justify-around py-2 z-50">

        {menuItems.map(
          (
            item,
            index
          ) => (

            <NavLink
              key={index}
              to={item.path}
              className={({
                isActive,
              }) =>
                `flex flex-col items-center gap-1 text-xs p-2 transition-all ${
                  isActive
                    ? "text-orange-500 font-medium"
                    : "text-slate-400"
                }`
              }
            >

              <span className="text-lg">
                {item.icon}
              </span>

              <span>
                {item.name}
              </span>

            </NavLink>
          )
        )}

        {/* MOBILE LOGOUT */}
        <button
          onClick={
            handleLogout
          }
          className="flex flex-col items-center gap-1 text-xs p-2 text-red-400"
        >

          <span className="text-lg">
            🚪
          </span>

          <span>
            Logout
          </span>

        </button>

      </nav>

    </>
  );
}