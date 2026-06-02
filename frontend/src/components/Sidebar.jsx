import React, {
  useEffect,
} from "react";

import {
  FaTimes,
} from "react-icons/fa";

const Sidebar = ({
  open,
  onClose,
  onNavigate,
  cartCount = 0,
  wishlistCount = 0,
  unreadNotificationCount = 0,
}) => {
  useEffect(() => {
    if (!open) return;

    const originalOverflow =
      document.body.style.overflow;

    document.body.style.overflow =
      "hidden";

    return () => {
      document.body.style.overflow =
        originalOverflow;
    };
  }, [open]);

  const links = [
    {
      label: "Home",
      path: "/",
    },
    {
      label: "Products",
      path: "/products",
    },
    {
      label: "About Us",
      path: "/about",
    },
    {
      label: "Coupons",
      path: "/coupons",
    },
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

  return (
    <div
      className={`fixed inset-0 z-[60] lg:hidden ${
        open
          ? "pointer-events-auto"
          : "pointer-events-none"
      }`}
    >
      <div
        onClick={onClose}
        className={`absolute inset-0 bg-black/40 transition-opacity ${
          open
            ? "opacity-100"
            : "opacity-0"
        }`}
      />

      <aside
        className={`absolute right-0 top-0 h-full w-[82vw] max-w-sm bg-white shadow-2xl transition-transform duration-300 ${
          open
            ? "translate-x-0"
            : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
          <div>
            <p className="text-xl font-black text-[#0c831f]">
              Grocify
            </p>

            <p className="text-xs font-bold text-slate-500">
              Menu
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="flex h-10 w-10 items-center justify-center rounded border border-slate-200 text-slate-700 hover:bg-slate-50"
            aria-label="Close menu"
          >
            <FaTimes />
          </button>
        </div>

        <div className="flex flex-col px-4 py-4">
          {links.map((link) => (
            <button
              key={link.path}
              type="button"
              onClick={() =>
                onNavigate(link.path)
              }
              className="flex items-center justify-between rounded px-4 py-3 text-left font-semibold text-slate-800 hover:bg-[#e9f6eb] hover:text-[#0c831f]"
            >
              <span>
                {link.label}
              </span>

              {link.count > 0 && (
                <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1 text-xs font-bold text-white">
                  {link.count}
                </span>
              )}
            </button>
          ))}
        </div>
      </aside>
    </div>
  );
};

export default Sidebar;
