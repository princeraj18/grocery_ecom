
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
  FaBolt,
} from "react-icons/fa";

import {
  useNavigate,
  useLocation,
} from "react-router-dom";

import { ShopContext } from "../context/ShopContext";

export default function Navbar() {
  const [open, setOpen] =
    useState(false);

  const [userMenu, setUserMenu] =
    useState(false);

  const [showSearch, setShowSearch] =
    useState(false);

  const [search, setSearch] =
    useState(
      localStorage.getItem(
        "productSearch"
      ) || ""
    );

  const navigate = useNavigate();
  const location = useLocation();
  const menuRef = useRef();

  const user = JSON.parse(
    localStorage.getItem("user")
  );

  const {
    cartItems,
    wishlistItems,
    products,
  } = useContext(ShopContext);

  // =========================
  // SHOW SEARCH BAR
  // =========================

  const showSearchBar =
    location.pathname === "/" ||
    location.pathname ===
      "/products";

  // =========================
  // SEARCH SYNC
  // =========================

  useEffect(() => {
    const syncSearch = () => {
      const savedSearch =
        localStorage.getItem(
          "productSearch"
        ) || "";

      setSearch(savedSearch);
    };

    window.addEventListener(
      "storage",
      syncSearch
    );

    window.addEventListener(
      "productSearchUpdated",
      syncSearch
    );

    return () => {
      window.removeEventListener(
        "storage",
        syncSearch
      );

      window.removeEventListener(
        "productSearchUpdated",
        syncSearch
      );
    };
  }, []);

  // =========================
  // SEARCH SUGGESTIONS
  // =========================

  const suggestions = useMemo(() => {
    if (!search.trim())
      return [];

    const regex = new RegExp(
      search,
      "i"
    );

    return products
      .filter(
        (product) =>
          regex.test(
            product.name
          ) ||
          regex.test(
            product.category
              ?.text || ""
          )
      )
      .slice(0, 6);
  }, [search, products]);

  // =========================
  // COUNTS
  // =========================

  const cartCount =
    Array.isArray(cartItems)
      ? cartItems.reduce(
          (total, item) =>
            total +
            item.quantity,
          0
        )
      : 0;

  const wishlistCount =
    Array.isArray(
      wishlistItems
    )
      ? wishlistItems.length
      : 0;

  // =========================
  // CLOSE USER MENU
  // =========================

  useEffect(() => {
    const handler = (e) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(
          e.target
        )
      ) {
        setUserMenu(false);
      }
    };

    document.addEventListener(
      "mousedown",
      handler
    );

    return () =>
      document.removeEventListener(
        "mousedown",
        handler
      );
  }, []);

  // =========================
  // CLEAR SEARCH
  // =========================

  const clearSearch = () => {
    setSearch("");

    localStorage.removeItem(
      "productSearch"
    );

    window.dispatchEvent(
      new Event(
        "productSearchUpdated"
      )
    );
  };

  // =========================
  // NAVIGATION
  // =========================

  const handleNavigation = (
    path
  ) => {
    clearSearch();

    navigate(path);

    setOpen(false);
  };

  // =========================
  // HANDLE SEARCH
  // =========================

  const handleSearch = (e) => {
    const value =
      e.target.value;

    setSearch(value);

    localStorage.setItem(
      "productSearch",
      value
    );

    window.dispatchEvent(
      new Event(
        "productSearchUpdated"
      )
    );

    if (
      location.pathname !==
      "/products"
    ) {
      navigate("/products");
    }
  };

 
  const handleSelectProduct = (
    product
  ) => {
    localStorage.setItem(
      "productSearch",
      product.name
    );

    window.dispatchEvent(
      new Event(
        "productSearchUpdated"
      )
    );

     navigate(`/products/${product._id}`);


    setShowSearch(false);
    setOpen(false);
  };

  // =========================
  // LOGOUT
  // =========================

  const handleLogout = () => {
    localStorage.removeItem(
      "user"
    );

    navigate("/login");

    setUserMenu(false);
    setOpen(false);
  };

  // =========================
  // MENU ITEMS
  // =========================

  const menuItems = [
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
      label: "Contact Us",
      path: "/contact",
    },
  ];

  // =========================
  // SEARCH BOX
  // =========================

  const SearchBox = ({
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
              className={`w-full rounded border border-slate-200 bg-[#f6f7f1] px-4 py-3 text-sm outline-none focus:border-[#0c831f] focus:bg-white ${
          mobile
            ? ""
            : "lg:w-80"
        }`}
    />

      {search &&
        suggestions.length >
          0 && (
          <div className="absolute left-0 top-14 z-50 w-full overflow-hidden rounded-[8px] border border-slate-100 bg-white shadow-xl">

            {suggestions.map(
              (product) => {
                const image =
                  Array.isArray(
                    product.image
                  )
                    ? product
                        .image[0]
                    : product.image;

                const offerPrice =
                  product
                    .variants?.[0]
                    ?.offerPrice ||
                  0;

                return (
                  <div
                    key={
                      product._id
                    }
                    onClick={() =>
                      handleSelectProduct(
                        product
                      )
                    }
                    className="flex cursor-pointer items-center gap-3 border-b px-4 py-3 hover:bg-slate-50"
                  >
                    <img
                      src={
                        image ||
                        "https://via.placeholder.com/150"
                      }
                      alt={
                        product.name
                      }
                      className="h-12 w-12 rounded bg-[#f6f7f1] object-contain"
                    />

                    <div>
                      <p className="font-bold">
                        {
                          product.name
                        }
                      </p>

                      <p className="text-sm font-bold text-[#0c831f]">
                        Rs.{" "}
                        {
                          offerPrice
                        }
                      </p>
                    </div>
                  </div>
                );
              }
            )}
          </div>
        )}
    </div>
  );

  return (
    <nav className="sticky top-0 z-50 border-b border-slate-200 bg-white shadow-sm">

      <div className="relative flex items-center justify-between gap-3 px-4 py-3 lg:px-8">

        {/* LOGO */}

        <div
          onClick={() =>
            handleNavigation("/")
          }
          className="cursor-pointer whitespace-nowrap"
        >
          <div className="flex items-center gap-2">

            <span className="flex h-9 w-9 items-center justify-center rounded bg-[#f7d851] text-[#0c831f]">
              <FaBolt />
            </span>

            <div>
              <p className="text-xl font-black text-[#0c831f] md:text-2xl">
                Grocify
              </p>

              <p className="hidden text-[11px] font-bold text-slate-500 sm:block">
                fresh grocery
              </p>
            </div>
          </div>
        </div>

        {/* SEARCH */}

        <div className="hidden lg:block">
          {showSearchBar && (
            <SearchBox />
          )}
        </div>

        {/* DESKTOP MENU */}

        <div className="hidden items-center gap-6 text-sm font-bold lg:flex">
          {menuItems.map(
            (item) => (
              <span
                key={
                  item.path
                }
                onClick={() =>
                  handleNavigation(
                    item.path
                  )
                }
                className="cursor-pointer hover:text-[#0c831f]"
              >
                {
                  item.label
                }
              </span>
            )
          )}
        </div>

        {/* RIGHT SIDE */}

        <div className="hidden items-center gap-4 lg:flex">

          {user && (
            <>
              <div
                className="relative flex h-10 w-10 cursor-pointer items-center justify-center rounded border border-slate-200"
                onClick={() =>
                  navigate(
                    "/wishlist"
                  )
                }
              >
                <FaHeart />

                {wishlistCount >
                  0 && (
                  <span className="absolute -right-2 -top-2 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
                    {
                      wishlistCount
                    }
                  </span>
                )}
              </div>

              <div
                className="relative flex h-10 cursor-pointer items-center gap-2 rounded bg-[#0c831f] px-4 text-sm font-black text-white"
                onClick={() =>
                  navigate("/cart")
                }
              >
                <FaShoppingCart />

                <span>
                  Cart
                </span>

                {cartCount >
                  0 && (
                  <span className="absolute -right-2 -top-2 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
                    {
                      cartCount
                    }
                  </span>
                )}
              </div>
            </>
          )}

          {/* USER */}

          <div
            className="relative"
            ref={menuRef}
          >
            <button
              onClick={() =>
                setUserMenu(
                  !userMenu
                )
              }
              className="flex h-10 w-10 items-center justify-center rounded border border-slate-200"
            >
              <FaUser />
            </button>

            {userMenu && (
              <div className="absolute right-0 z-50 mt-3 w-48 overflow-hidden rounded-[8px] border border-slate-100 bg-white shadow-lg">

                {user ? (
                  <>
                    <div className="border-b bg-slate-50 px-4 py-3 font-bold">
                      Hi,{" "}
                      {
                        user.name
                      }
                    </div>

                    <div
                      onClick={() =>
                        navigate(
                          "/profile"
                        )
                      }
                      className="cursor-pointer px-4 py-3 hover:bg-slate-50"
                    >
                      Profile
                    </div>

                    <div
                      onClick={() =>
                        navigate(
                          "/orders"
                        )
                      }
                      className="cursor-pointer px-4 py-3 hover:bg-slate-50"
                    >
                      Orders
                    </div>

                    <div
                      onClick={
                        handleLogout
                      }
                      className="cursor-pointer px-4 py-3 text-red-500 hover:bg-slate-50"
                    >
                      Logout
                    </div>
                  </>
                ) : (
                  <>
                    <div
                      onClick={() =>
                        navigate(
                          "/login"
                        )
                      }
                      className="cursor-pointer px-4 py-3 hover:bg-slate-50"
                    >
                      Login
                    </div>

                    <div
                      onClick={() =>
                        navigate(
                          "/register"
                        )
                      }
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

        {/* MOBILE BUTTONS */}

        <div className="flex items-center gap-3 lg:hidden">

          {showSearchBar && (
            <button
              onClick={() =>
                setShowSearch(
                  !showSearch
                )
              }
              className="text-xl"
            >
              <FaSearch />
            </button>
          )}

          <button
            onClick={() =>
              setOpen(!open)
            }
            className="text-xl"
          >
            {open ? (
              <FaTimes />
            ) : (
              <FaBars />
            )}
          </button>
        </div>
      </div>

      {/* MOBILE SEARCH */}

      {showSearch &&
        showSearchBar && (
          <div className="px-4 pb-3 lg:hidden">
            <SearchBox mobile />
          </div>
        )}

      {/* MOBILE SIDEBAR */}

      {open && (
        <div className="flex flex-col gap-4 border-t bg-white px-4 py-4 lg:hidden">

          {menuItems.map(
            (item) => (
              <span
                key={
                  item.path
                }
                onClick={() =>
                  handleNavigation(
                    item.path
                  )
                }
                className="cursor-pointer font-semibold"
              >
                {
                  item.label
                }
              </span>
            )
          )}

          {user && (
            <>
              <span
                onClick={() =>
                  navigate(
                    "/wishlist"
                  )
                }
                className="cursor-pointer font-semibold"
              >
                Wishlist (
                {
                  wishlistCount
                }
                )
              </span>

              <span
                onClick={() =>
                  navigate("/cart")
                }
                className="cursor-pointer font-semibold"
              >
                Cart (
                {cartCount})
              </span>
            </>
          )}

          {user ? (
            <>
              <span
                onClick={() =>
                  navigate(
                    "/profile"
                  )
                }
                className="cursor-pointer font-semibold"
              >
                Profile
              </span>

              <span
                onClick={() =>
                  navigate(
                    "/orders"
                  )
                }
                className="cursor-pointer font-semibold"
              >
                Orders
              </span>

              <span
                onClick={
                  handleLogout
                }
                className="cursor-pointer font-semibold text-red-500"
              >
                Logout
              </span>
            </>
          ) : (
            <>
              <span
                onClick={() =>
                  navigate(
                    "/login"
                  )
                }
                className="cursor-pointer font-semibold"
              >
                Login
              </span>

              <span
                onClick={() =>
                  navigate(
                    "/register"
                  )
                }
                className="cursor-pointer font-semibold"
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

