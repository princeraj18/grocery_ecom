import React, { useEffect } from "react";
import { createPortal } from "react-dom";
import { 
  FaTimes, 
  FaUser, 
  FaSignOutAlt, 
  FaSignInAlt, 
  FaUserPlus 
} from "react-icons/fa";

const Sidebar = ({
  open,
  onClose,
  onNavigate,
  handleLogout,
  cartCount = 0,
  wishlistCount = 0,
  unreadNotificationCount = 0,
}) => {
  // Prevent background scrolling when mobile sidebar drawer is open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [open]);

  const user = JSON.parse(localStorage.getItem("user"));

  const links = [
    { label: "Home", path: "/" },
    { label: "Products", path: "/products" },
    { label: "About Us", path: "/about" },
    { label: "Coupons", path: "/coupons" },
    {
      label: "Notifications",
      path: "/notification",
      count: unreadNotificationCount,
    },
    {
      label: "Wishlist",
      path: "/wishlist",
      count: wishlistCount,
    },
    {
      label: "Cart",
      path: "/cart",
      count: cartCount,
    },
    {
      label: "Contact Us",
      path: "/contact",
    },
    {
      label: "User Support",
      path: "/usersupport",
    },
  ];

  if (typeof document === "undefined") return null;

  return createPortal(
    <div
      className={`fixed inset-0 z-[999] lg:hidden transition-all duration-300 ${
        open 
          ? "opacity-100 pointer-events-auto visible" 
          : "opacity-0 pointer-events-none invisible"
      }`}
    >
      {/* Dark Backdrop Overlay */}
      <div
        onClick={onClose}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
      />

      {/* Slide-out Sidebar Drawer Container */}
      <aside
        className={`
          fixed right-0 top-0 h-full
          bg-white dark:bg-slate-900
          border-l border-slate-200 dark:border-slate-800
          shadow-2xl
          transition-transform duration-300 ease-in-out
          flex flex-col
          w-[80%]
          sm:w-[60%]
          md:w-[45%]
          ${open ? "translate-x-0" : "translate-x-full"}
        `}
      >
        {/* Header Section */}
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 px-5 py-4 shrink-0 bg-white dark:bg-slate-900">
          <div>
            <h2 className="text-2xl font-black text-[#0c831f] dark:text-emerald-400">
              Grocify
            </h2>
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              Navigation Menu
            </p>
          </div>

          <button
            onClick={onClose}
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          >
            <FaTimes />
          </button>
        </div>

        {/* User Profile Info Card */}
        <div className="border-b border-slate-200 dark:border-slate-800 px-5 py-5 shrink-0 bg-slate-50 dark:bg-slate-950">
          {user ? (
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#e9f6eb] dark:bg-emerald-950/60 text-[#0c831f] dark:text-emerald-400 font-black text-lg border border-[#0c831f]/20 shadow-inner shrink-0">
                {user.name ? user.name[0].toUpperCase() : "U"}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-extrabold text-slate-900 dark:text-white text-sm truncate">
                  Hi, {user.name}
                </h3>
                <p className="text-[11px] font-medium text-slate-500 dark:text-slate-400 truncate">
                  {user.email}
                </p>
                <button
                  onClick={() => {
                    onNavigate("/profile");
                    onClose();
                  }}
                  className="mt-1.5 text-xs font-bold text-[#0c831f] dark:text-emerald-400 hover:underline flex items-center gap-1"
                >
                  <FaUser className="text-[9px]" /> View Profile
                </button>
              </div>
            </div>
          ) : (
            <div>
              <h3 className="font-extrabold text-slate-900 dark:text-white text-sm">
                Welcome to Grocify!
              </h3>
              <p className="text-[11px] font-medium text-slate-500 dark:text-slate-400 mt-0.5">
                Log in to shop fresh groceries
              </p>
              <div className="mt-3 flex gap-2">
                <button
                  onClick={() => {
                    onNavigate("/login");
                    onClose();
                  }}
                  className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-[#0c831f] hover:bg-[#096b19] dark:bg-emerald-600 dark:hover:bg-emerald-500 text-white text-xs font-bold shadow-sm transition active:scale-95"
                >
                  <FaSignInAlt className="text-[10px]" /> Sign In
                </button>
                <button
                  onClick={() => {
                    onNavigate("/register");
                    onClose();
                  }}
                  className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-bold transition active:scale-95"
                >
                  <FaUserPlus className="text-[10px]" /> Register
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Scrollable Nav Item Content Area */}
        <div className="flex-1 overflow-y-auto py-4 px-3 bg-white dark:bg-slate-900">
          {links.map((link) => (
            <button
              key={link.path}
              onClick={() => {
                onNavigate(link.path);
                onClose();
              }}
              className="
                group
                flex
                w-full
                items-center
                justify-between
                rounded-xl
                px-4
                py-3
                mb-1
                text-left
                font-bold
                text-slate-800
                dark:text-slate-200
                hover:bg-slate-100
                dark:hover:bg-slate-800/80
                hover:text-[#0c831f]
                dark:hover:text-emerald-400
                transition-all
              "
            >
              <span className="text-sm sm:text-base">{link.label}</span>

              {link.count > 0 && (
                <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1.5 text-[10px] sm:text-xs font-bold text-white">
                  {link.count}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Logout block (shown if user is logged in) */}
        {user && (
          <div className="px-3 pb-3 shrink-0 border-t border-slate-100 dark:border-slate-800/60 pt-3 bg-white dark:bg-slate-900">
            <button
              onClick={() => {
                handleLogout();
                onClose();
              }}
              className="
                group
                flex
                w-full
                items-center
                gap-3
                rounded-xl
                px-4
                py-3
                text-left
                font-bold
                text-rose-500
                hover:bg-rose-50
                dark:hover:bg-rose-950/20
                transition-all
                active:scale-95
              "
            >
              <FaSignOutAlt className="text-sm" />
              <span className="text-sm sm:text-base">Sign Out</span>
            </button>
          </div>
        )}

        {/* Footer Info Section */}
        <div className="border-t border-slate-200 dark:border-slate-800 px-5 py-4 shrink-0 bg-slate-50 dark:bg-slate-950">
          <p className="text-center text-xs text-slate-500 dark:text-slate-400">
            © 2026 Grocify
          </p>
        </div>
      </aside>
    </div>,
    document.body
  );
};

export default Sidebar;