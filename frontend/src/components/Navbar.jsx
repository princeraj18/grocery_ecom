import React, {
  useState,
  useContext,
  useRef,
  useEffect,
  useMemo,
} from "react";
import {
  FaShoppingCart,
  FaUser,
  FaBars,
  FaTimes,
  FaSearch,
  FaHeart,
  FaMapMarkerAlt,
  FaBolt,
} from "react-icons/fa";
import { useNavigate, useLocation } from "react-router-dom";

import { ShopContext } from "../context/ShopContext";
import { dummyProducts } from "../assets/greencart_assets/assets";

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
  const { cartItems, wishlistItems, products } = useContext(ShopContext);

  const showSearchBar =
    location.pathname === "/" || location.pathname === "/products";

  const clearSearch = () => {
    setSearch("");
    localStorage.removeItem("productSearch");
  };

  const handleNavigation = (path) => {
    clearSearch();
    navigate(path);
  };

  const allProducts = [...dummyProducts, ...products];

  const suggestions = useMemo(() => {
    if (!search.trim()) return [];
    const regex = new RegExp(search, "i");
    return allProducts.filter((product) => regex.test(product.name)).slice(0, 6);
  }, [search, products]);

  const cartCount = cartItems.reduce(
    (total, item) => total + item.quantity,
    0
  );

  const wishlistCount = Array.isArray(wishlistItems)
    ? wishlistItems.length
    : 0;

  useEffect(() => {
    const handler = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setUserMenu(false);
      }
    };

    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  useEffect(() => {
    if (location.pathname !== "/" && location.pathname !== "/products") {
      clearSearch();
    }
  }, [location.pathname]);

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearch(value);
    localStorage.setItem("productSearch", value);
    navigate("/products");
  };

  const handleSelectProduct = (product) => {
    setSearch("");
    localStorage.setItem("productSearch", product.name);
    navigate(`/products/${product._id}`);
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/login");
    setUserMenu(false);
  };

  const menuItems = [
    { label: "Home", path: "/" },
    { label: "Products", path: "/products" },
    { label: "About Us", path: "/about" },
    { label: "Contact Us", path: "/contact" },
  ];

  const SearchBox = ({ mobile = false }) => (
    <div className="relative w-full">
      <input
        type="text"
        value={search}
        onChange={handleSearch}
        placeholder="Search atta, milk, fruits..."
        className={`w-full rounded border border-slate-200 bg-[#f6f7f1] px-4 py-3 text-sm text-slate-900 outline-none focus:border-[#0c831f] focus:bg-white ${
          mobile ? "" : "lg:w-80"
        }`}
      />

      {search && suggestions.length > 0 && (
        <div className="absolute left-0 top-14 z-50 w-full overflow-hidden rounded-[8px] border border-slate-100 bg-white text-black shadow-xl">
          {suggestions.map((product) => (
            <div
              key={product._id}
              onClick={() => handleSelectProduct(product)}
              className="flex cursor-pointer items-center gap-3 border-b px-4 py-3 hover:bg-slate-50"
            >
              <img
                src={product.image[0]}
                alt=""
                className="h-12 w-12 rounded bg-[#f6f7f1] object-contain"
              />
              <div>
                <p className="font-bold">{product.name}</p>
                <p className="text-sm font-bold text-[#0c831f]">
                  Rs. {product.offerPrice}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <nav className="sticky top-0 z-50 border-b border-slate-200 bg-white text-slate-900 shadow-sm">
      <div className="relative flex items-center justify-between gap-3 px-4 py-3 lg:px-8">
        <div
          onClick={() => handleNavigation("/")}
          className="cursor-pointer whitespace-nowrap"
        >
          <div className="flex items-center gap-2">
            <span className="flex h-9 w-9 items-center justify-center rounded bg-[#f7d851] text-[#0c831f]">
              <FaBolt />
            </span>
            <div>
              <p className="text-xl font-black leading-none text-[#0c831f] md:text-2xl">
                Grocify
              </p>
              <p className="hidden text-[11px] font-bold text-slate-500 sm:block">
                fresh grocery
              </p>
            </div>
          </div>
        </div>

        <div className="hidden min-w-[150px] lg:block">
          <p className="text-xs font-bold uppercase text-slate-500">Deliver to</p>
          <div className="mt-0.5 flex items-center gap-1 text-sm font-black">
            <FaMapMarkerAlt className="text-[#0c831f]" />
            Home in 10-30 min
          </div>
        </div>

        <div className="hidden items-center gap-6 text-sm font-bold lg:flex">
          {menuItems.map((item) => (
            <span
              key={item.path}
              onClick={() => handleNavigation(item.path)}
              className="cursor-pointer hover:text-[#0c831f]"
            >
              {item.label}
            </span>
          ))}
        </div>

        <div className="hidden items-center gap-4 lg:flex">
          {showSearchBar && <SearchBox />}

          <div
            className="relative flex h-10 w-10 cursor-pointer items-center justify-center rounded border border-slate-200 text-lg hover:border-red-200 hover:text-red-500"
            onClick={() => navigate("/wishlist")}
          >
            <FaHeart />
            {wishlistCount > 0 && (
              <span className="absolute -right-2 -top-2 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
                {wishlistCount}
              </span>
            )}
          </div>

          <div
            className="relative flex h-10 cursor-pointer items-center gap-2 rounded bg-[#0c831f] px-4 text-sm font-black text-white"
            onClick={() => navigate("/cart")}
          >
            <FaShoppingCart />
            <span>Cart</span>
            {cartCount > 0 && (
              <span className="absolute -right-2 -top-2 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
                {cartCount}
              </span>
            )}
          </div>

          <div className="relative" ref={menuRef}>
            <button
              onClick={() => setUserMenu(!userMenu)}
              className="flex h-10 w-10 items-center justify-center rounded border border-slate-200 hover:border-[#0c831f]"
            >
              <FaUser />
            </button>

            {userMenu && (
              <div className="absolute right-0 z-50 mt-3 w-48 overflow-hidden rounded-[8px] border border-slate-100 bg-white text-black shadow-lg">
                {user ? (
                  <>
                    <div className="border-b bg-slate-50 px-4 py-3 font-bold">
                      Hi, {user.name}
                    </div>
                    <div
                      onClick={() => navigate("/profile")}
                      className="cursor-pointer px-4 py-3 hover:bg-slate-50"
                    >
                      Profile
                    </div>
                    <div
                      onClick={() => navigate("/orders")}
                      className="cursor-pointer px-4 py-3 hover:bg-slate-50"
                    >
                      Orders
                    </div>
                    <div
                      onClick={handleLogout}
                      className="cursor-pointer px-4 py-3 text-red-500 hover:bg-slate-50"
                    >
                      Logout
                    </div>
                  </>
                ) : (
                  <>
                    <div
                      onClick={() => navigate("/login")}
                      className="cursor-pointer px-4 py-3 hover:bg-slate-50"
                    >
                      Login
                    </div>
                    <div
                      onClick={() => navigate("/register")}
                      className="cursor-pointer px-4 py-3 hover:bg-slate-50"
                    >
                      Register
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center gap-3 lg:hidden">
          {showSearchBar && (
            <button
              onClick={() => setShowSearch(!showSearch)}
              className="text-xl text-slate-800"
            >
              <FaSearch />
            </button>
          )}
          <button
            onClick={() => setOpen(!open)}
            className="text-xl text-slate-800"
          >
            {open ? <FaTimes /> : <FaBars />}
          </button>
        </div>
      </div>

      {showSearch && showSearchBar && (
        <div className="px-4 pb-3 lg:hidden">
          <SearchBox mobile />
        </div>
      )}

      {open && (
        <div className="mx-4 mb-4 mt-2 flex flex-col gap-4 rounded-[8px] bg-[#172337] p-4 text-white lg:hidden">
          {menuItems.map((item) => (
            <span
              key={item.path}
              onClick={() => {
                handleNavigation(item.path);
                setOpen(false);
              }}
              className="cursor-pointer"
            >
              {item.label}
            </span>
          ))}
          <span
            onClick={() => {
              navigate("/wishlist");
              setOpen(false);
            }}
            className="cursor-pointer"
          >
            Wishlist ({wishlistCount})
          </span>
          <span
            onClick={() => {
              navigate("/cart");
              setOpen(false);
            }}
            className="cursor-pointer"
          >
            Cart ({cartCount})
          </span>

          {user ? (
            <>
              <span
                onClick={() => {
                  navigate("/profile");
                  setOpen(false);
                }}
                className="cursor-pointer"
              >
                Profile
              </span>
              <span
                onClick={() => {
                  navigate("/orders");
                  setOpen(false);
                }}
                className="cursor-pointer"
              >
                Orders
              </span>
              <span
                onClick={() => {
                  handleLogout();
                  setOpen(false);
                }}
                className="cursor-pointer text-red-300"
              >
                Logout
              </span>
            </>
          ) : (
            <>
              <span
                onClick={() => {
                  navigate("/login");
                  setOpen(false);
                }}
                className="cursor-pointer"
              >
                Login
              </span>
              <span
                onClick={() => {
                  navigate("/register");
                  setOpen(false);
                }}
                className="cursor-pointer"
              >
                Register
              </span>
            </>
          )}
        </div>
      )}
    </nav>
  );
}
