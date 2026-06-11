import React, {
  useState,
  useContext,
  useRef,
  useEffect,
  useMemo,
  memo,
} from "react";

import {
  FaShoppingCart,
  FaUser,
  FaBars,
  FaTimes,
  FaSearch,
  FaHeart,
  FaBolt,
  FaBell,
} from "react-icons/fa";

import { useNavigate, useLocation } from "react-router-dom";

import { ShopContext } from "../context/ShopContext";
import Sidebar from "./Sidebar";
import ThemeToggle from "./ThemeToggle";

// ======================================
// SEARCH BOX COMPONENT (MEMOIZED)
// ======================================
const SearchBox = memo(
  ({
    search,
    setSearch,
    suggestions,
    handleSelectProduct,
    mobile = false,
  }) => (
    <div className="relative w-full">
      <input
        type="text"
        placeholder="Search groceries..."
        value={search}
        onChange={(e) => {
          setSearch(e.target.value);
          localStorage.setItem("productSearch", e.target.value);
        }}
        className={`w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 px-4 py-2.5 text-sm outline-none focus:border-[#0c831f] dark:focus:border-emerald-500 focus:bg-white dark:focus:bg-slate-900 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 transition-colors ${
          mobile ? "" : "w-64 xl:w-80"
        }`}
      />

      {search && suggestions.length > 0 && (
        <div className="absolute left-0 top-14 z-50 w-full overflow-hidden rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xl">
          {suggestions.map((product) => {
            const image = Array.isArray(product.image)
              ? product.image[0]
              : product.image;

            const offerPrice = product.variants?.[0]?.offerPrice || 0;

            return (
              <div
                key={product._id}
                onClick={() => handleSelectProduct(product)}
                className="flex cursor-pointer items-center gap-3 border-b border-slate-100 dark:border-slate-800/60 px-4 py-3 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800/50 text-slate-800 dark:text-slate-200 transition-colors"
              >
                <img
                  src={image || "https://via.placeholder.com/150"}
                  alt={product.name}
                  className="h-12 w-12 rounded-lg bg-slate-100 dark:bg-slate-950 object-contain p-1"
                />

                <div className="flex-1 min-w-0">
                  <p className="font-bold text-xs sm:text-sm truncate">
                    {product.name}
                  </p>
                  <p className="text-sm font-black text-[#0c831f] dark:text-emerald-400 mt-0.5">
                    ₹ {offerPrice}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  )
);

SearchBox.displayName = "SearchBox";

// ======================================
// MAIN NAVBAR COMPONENT
// ======================================
export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [userMenu, setUserMenu] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [search, setSearch] = useState(
    localStorage.getItem("productSearch") || ""
  );

  const navigate = useNavigate();
  const location = useLocation();
  const menuRef = useRef();

  const user = JSON.parse(localStorage.getItem("user"));

  const {
    cartItems,
    wishlistItems,
    products,
    unreadNotificationCount,
  } = useContext(ShopContext);

  const showSearchBar =
    location.pathname === "/" || location.pathname === "/products";

  // ======================================
  // SEARCH SUGGESTIONS COMPUTE
  // ======================================
  const suggestions = useMemo(() => {
    if (!search.trim()) return [];

    const regex = new RegExp(search, "i");

    return products
      .filter(
        (product) =>
          regex.test(product.name) ||
          regex.test(product.category?.text || "")
      )
      .slice(0, 6);
  }, [search, products]);

  // ======================================
  // TELEMETRY COUNTS (MEMOIZED FIX)
  // ======================================
  const cartCount = useMemo(() => {
    return Array.isArray(cartItems)
      ? cartItems.reduce((total, item) => total + item.quantity, 0)
      : 0;
  }, [cartItems]);

  const wishlistCount = useMemo(() => {
    if (!wishlistItems) return 0;

    // Handles { wishlist: { items: [...] } } schema wrappers
    if (Array.isArray(wishlistItems.items)) {
      return wishlistItems.items.length;
    }

    // Handles pure arrays direct payload models [...]
    if (Array.isArray(wishlistItems)) {
      return wishlistItems.length;
    }

    return 0;
  }, [wishlistItems]);

  // ======================================
  // CLOSE USER DROPDOWN CONTEXT LAYER
  // ======================================
  useEffect(() => {
    const handler = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setUserMenu(false);
      }
    };

    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleNavigation = (path) => {
    navigate(path);
    setOpen(false);
  };

  const handleSelectProduct = (product) => {
    navigate(`/products/${product._id}`);
    setShowSearch(false);
    setOpen(false);
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    navigate("/");
    setUserMenu(false);
    setOpen(false);
  };

  return (
    <nav className="sticky top-0 z-50 border-b border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 backdrop-blur shadow-sm text-slate-800 dark:text-slate-100 transition-colors duration-200">
      <div className="flex items-center justify-between gap-4 px-4 py-3 md:px-6 lg:px-8 max-w-7xl mx-auto">
        
        {/* LOGO */}
        <div
          onClick={() => handleNavigation("/")}
          className="cursor-pointer select-none shrink-0"
        >
          <div className="flex items-center gap-2">
            <span className="flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-xl bg-[#f7d851] text-[#0c831f] shadow-sm">
              <FaBolt className="text-sm" />
            </span>
            <p className="text-xl sm:text-2xl font-black text-[#0c831f] dark:text-emerald-400 tracking-tight">
              Grocify
            </p>
          </div>
        </div>

        {/* DESKTOP SEARCH */}
        <div className="hidden lg:block flex-1 max-w-md mx-4">
          {showSearchBar && (
            <SearchBox
              search={search}
              setSearch={setSearch}
              suggestions={suggestions}
              handleSelectProduct={handleSelectProduct}
            />
          )}
        </div>

        {/* DESKTOP NAV REFS */}
        <div className="hidden lg:flex items-center gap-5 xl:gap-6 text-sm font-bold text-slate-600 dark:text-slate-300 shrink-0">
          <span
            onClick={() => handleNavigation("/")}
            className="cursor-pointer hover:text-[#0c831f] dark:hover:text-emerald-400 transition-colors"
          >
            Home
          </span>
          <span
            onClick={() => handleNavigation("/products")}
            className="cursor-pointer hover:text-[#0c831f] dark:hover:text-emerald-400 transition-colors"
          >
            Products
          </span>
          <span
            onClick={() => handleNavigation("/about")}
            className="cursor-pointer hover:text-[#0c831f] dark:hover:text-emerald-400 transition-colors"
          >
            About Us
          </span>
          <span
            onClick={() => handleNavigation("/coupons")}
            className="cursor-pointer hover:text-[#0c831f] dark:hover:text-emerald-400 transition-colors"
          >
            Coupons
          </span>
          <span
            onClick={() => handleNavigation("/contact")}
            className="cursor-pointer hover:text-[#0c831f] dark:hover:text-emerald-400 transition-colors"
          >
            Contact Us
          </span>
        </div>

        {/* UTILITY BAR SYSTEM (DESKTOP) */}
        <div className="hidden lg:flex items-center gap-3 shrink-0">
          <ThemeToggle />

          {/* NOTIFICATION HUB */}
          <div
            className="relative flex h-10 w-10 cursor-pointer items-center justify-center rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-100 transition-all active:scale-95"
            onClick={() => (user ? navigate("/notification") : navigate("/login"))}
          >
            <FaBell className="text-sm" />
            {user && unreadNotificationCount > 0 && (
              <span className="absolute -right-1.5 -top-1.5 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-black text-white ring-2 ring-white dark:ring-slate-900">
                {unreadNotificationCount}
              </span>
            )}
          </div>

          {/* WISHLIST TRACKER CONTAINER */}
          <div
            className="relative flex h-10 w-10 cursor-pointer items-center justify-center rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-red-500 dark:hover:text-red-400 transition-all active:scale-95"
            onClick={() => navigate("/wishlist")}
          >
            <FaHeart className="text-sm" />
            {wishlistCount > 0 && (
              <span className="absolute -right-1.5 -top-1.5 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-red-500 text-[10px] font-black text-white ring-2 ring-white dark:ring-slate-900">
                {wishlistCount}
              </span>
            )}
          </div>

          {/* CART CTA BAR */}
          <div
            className="relative flex h-10 cursor-pointer items-center gap-2 rounded-xl bg-[#0c831f] hover:bg-[#096b19] dark:bg-emerald-600 dark:hover:bg-emerald-500 px-4 text-sm font-black text-white shadow-sm transition-all active:scale-95"
            onClick={() => navigate("/cart")}
          >
            <FaShoppingCart className="text-sm" />
            <span>Cart</span>
            {cartCount > 0 && (
              <span className="absolute -right-1.5 -top-1.5 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-red-500 text-[10px] font-black text-white ring-2 ring-white dark:ring-slate-900">
                {cartCount}
              </span>
            )}
          </div>

          {/* USER CONFIG MENU OVERLAY */}
          <div className="relative" ref={menuRef}>
            <button
              onClick={() => setUserMenu(!userMenu)}
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-100 transition-all active:scale-95"
            >
              <FaUser className="text-sm" />
            </button>

            {userMenu && (
              <div className="absolute right-0 z-50 mt-3 w-52 overflow-hidden rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xl text-slate-700 dark:text-slate-300">
                {user ? (
                  <>
                    <div className="border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 px-4 py-3 font-black text-slate-900 dark:text-white text-sm truncate">
                      Hi, {user.name}
                    </div>
                    <div
                      onClick={() => { navigate("/profile"); setUserMenu(false); }}
                      className="cursor-pointer px-4 py-2.5 text-sm hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors"
                    >
                      Profile
                    </div>
                    <div
                      onClick={() => { navigate("/orders"); setUserMenu(false); }}
                      className="cursor-pointer px-4 py-2.5 text-sm hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors"
                    >
                      Orders
                    </div>
                    <div
                      onClick={() => { navigate("/notification"); setUserMenu(false); }}
                      className="cursor-pointer px-4 py-2.5 text-sm hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors"
                    >
                      Notifications
                    </div>
                    <div
                      onClick={() => { navigate("/wishlist"); setUserMenu(false); }}
                      className="cursor-pointer px-4 py-2.5 text-sm hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors"
                    >
                      Wishlist
                    </div>
                    <div
                      onClick={() => { navigate("/usersupport"); setUserMenu(false); }}
                      className="cursor-pointer px-4 py-2.5 text-sm hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors"
                    >
                      User Support
                    </div>
                    <div
                      onClick={handleLogout}
                      className="cursor-pointer px-4 py-2.5 text-sm font-bold text-red-500 border-t border-slate-100 dark:border-slate-800/80 hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors"
                    >
                      Logout
                    </div>
                  </>
                ) : (
                  <>
                    <div
                      onClick={() => { navigate("/login"); setUserMenu(false); }}
                      className="cursor-pointer px-4 py-2.5 text-sm hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors"
                    >
                      Login
                    </div>
                    <div
                      onClick={() => { navigate("/register"); setUserMenu(false); }}
                      className="cursor-pointer px-4 py-2.5 text-sm hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors"
                    >
                      Register
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
        </div>

        {/* RESPONSIVE RESPONSES SYSTEM (MOBILE / TABLET) */}
        <div className="flex items-center gap-2 sm:gap-3 lg:hidden text-slate-600 dark:text-slate-400">
          <ThemeToggle />

          {showSearchBar && (
            <button
              onClick={() => setShowSearch(!showSearch)}
              className="text-lg p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-100 transition-colors"
            >
              <FaSearch />
            </button>
          )}

          {/* MOBILE WISHLIST SHORTCUT BADGE */}
          <div
            className="relative flex h-10 w-10 cursor-pointer items-center justify-center rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-red-500 dark:hover:text-red-400 transition-all active:scale-95"
            onClick={() => navigate("/wishlist")}
          >
            <FaHeart className="text-sm" />
            {wishlistCount > 0 && (
              <span className="absolute -right-1.5 -top-1.5 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-red-500 text-[10px] font-black text-white ring-2 ring-white dark:ring-slate-900">
                {wishlistCount}
              </span>
            )}
          </div>

          {/* MOBILE CART CONTAINER */}
          <div
            className="relative flex h-10 w-10 cursor-pointer items-center justify-center rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-[#0c831f] dark:hover:text-emerald-400 transition-all active:scale-95"
            onClick={() => navigate("/cart")}
          >
            <FaShoppingCart className="text-sm" />
            {cartCount > 0 && (
              <span className="absolute -right-1.5 -top-1.5 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-red-500 text-[10px] font-black text-white ring-2 ring-white dark:ring-slate-900">
                {cartCount}
              </span>
            )}
          </div>

          <button
            onClick={() => setOpen(!open)}
            className="text-lg p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-100 transition-colors"
          >
            {open ? <FaTimes /> : <FaBars />}
          </button>
        </div>
      </div>

      {/* MOBILE SEARCH TRAY DRAWER EXTENSION */}
      {showSearch && showSearchBar && (
        <div className="px-4 pb-3 lg:hidden border-t border-slate-100 dark:border-slate-800/60 pt-2 transition-all">
          <SearchBox
            search={search}
            setSearch={setSearch}
            suggestions={suggestions}
            handleSelectProduct={handleSelectProduct}
            mobile={true}
          />
        </div>
      )}

      {/* GLOBAL SLIDE SIDEBAR DRAWER */}
      <Sidebar
        open={open}
        onClose={() => setOpen(false)}
        onNavigate={handleNavigation}
        handleLogout={handleLogout}
        cartCount={cartCount}
        wishlistCount={wishlistCount}
        unreadNotificationCount={unreadNotificationCount}
      />
    </nav>
  );
}