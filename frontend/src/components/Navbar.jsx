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
} from "react-icons/fa";
import {
  useNavigate,
  useLocation,
} from "react-router-dom";

import {
  ShopContext,
} from "../context/ShopContext";

import {
  dummyProducts,
} from "../assets/greencart_assets/assets";

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
const clearSearch = () => {
  setSearch("");
  localStorage.removeItem("productSearch");
};
const handleNavigation = (path) => {
  clearSearch();
  navigate(path);
};
  const navigate = useNavigate();

  const location = useLocation();

const {
  cartItems,
  wishlistItems,
  products,
} = useContext(ShopContext);
  const menuRef = useRef();

  const user = JSON.parse(
    localStorage.getItem("user")
  );

  // =========================
  // SHOW SEARCH ONLY ON
  // HOME & PRODUCTS PAGE
  // =========================
  const showSearchBar =
    location.pathname === "/" ||
    location.pathname === "/products";

  // =========================
  // MERGE PRODUCTS
  // =========================
  const allProducts = [
    ...dummyProducts,
    ...products,
  ];

  // =========================
  // SEARCH SUGGESTIONS
  // =========================
  const suggestions = useMemo(() => {

    if (!search.trim()) return [];

    const regex = new RegExp(
      search,
      "i"
    );

    return allProducts
      .filter(
        (product) =>
          regex.test(product.name)
      )
      .slice(0, 6);

  }, [search, products]);

  // =========================
  // CART COUNT
  // =========================
  const cartCount =
    cartItems.reduce(
      (total, item) =>
        total + item.quantity,
      0
    );

const wishlistCount =
  Array.isArray(wishlistItems)
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

    return () => {

      document.removeEventListener(
        "mousedown",
        handler
      );
    };

  }, []);


  // =========================
// CLEAR SEARCH ON ROUTE CHANGE
// =========================
useEffect(() => {
  if (
    location.pathname !== "/" &&
    location.pathname !== "/products"
  ) {
    clearSearch();
  }
}, [location.pathname]);
  // =========================
  // HANDLE SEARCH
  // =========================
  const handleSearch = (e) => {

    const value = e.target.value;

    setSearch(value);

    localStorage.setItem(
      "productSearch",
      value
    );

    navigate("/products");
  };

  // =========================
  // SELECT PRODUCT
  // =========================
  const handleSelectProduct = (
    product
  ) => {

    setSearch("");

    localStorage.setItem(
      "productSearch",
      product.name
    );

    navigate(
      `/products/${product._id}`
    );
  };

  // =========================
  // LOGOUT
  // =========================
  const handleLogout = () => {

    localStorage.removeItem("user");

    navigate("/login");

    setUserMenu(false);
  };

  return (

    <nav className="bg-blue-600 text-white px-4 py-3 shadow-md relative z-50">

      <div className="flex items-center justify-between">

        {/* LOGO */}
        <div
            onClick={() => handleNavigation("/")}
          className="text-2xl font-bold cursor-pointer"
        >
          Grocify
        </div>

        {/* DESKTOP MENU */}
        <div className="hidden lg:flex items-center gap-6 font-medium">

          <span
            onClick={() =>
              handleNavigation("/")
            }
            className="cursor-pointer hover:text-gray-200"
          >
            Home
          </span>

          <span
            onClick={() =>
              handleNavigation("/products")
            }
            className="cursor-pointer hover:text-gray-200"
          >
            Products
          </span>

          <span
            onClick={() =>
              navigate("/about")
            }
            className="cursor-pointer hover:text-gray-200"
          >
            About Us
          </span>

          <span
            onClick={() =>
              navigate("/contact")
            }
            className="cursor-pointer hover:text-gray-200"
          >
            Contact Us
          </span>

        </div>

        {/* RIGHT SIDE */}
        <div className="hidden lg:flex items-center gap-5 relative">

          {/* SEARCH BAR */}
          {showSearchBar && (

            <div className="relative">

              <input
                type="text"
                value={search}
                onChange={handleSearch}
                placeholder="Search products..."
                className="px-4 py-2 rounded-lg bg-white text-black outline-none w-72"
              />

              {/* SUGGESTIONS */}
              {search &&
                suggestions.length > 0 && (

                <div className="absolute top-14 left-0 w-full bg-white text-black rounded-lg shadow-xl overflow-hidden z-50">

                  {suggestions.map(
                    (product) => (

                      <div
                        key={
                          product._id
                        }
                        onClick={() =>
                          handleSelectProduct(
                            product
                          )
                        }
                        className="flex items-center gap-3 px-4 py-3 hover:bg-gray-100 cursor-pointer border-b"
                      >

                        <img
                          src={
                            product.image[0]
                          }
                          alt=""
                          className="w-12 h-12 object-cover rounded"
                        />

                        <div>

                          <p className="font-medium">
                            {product.name}
                          </p>

                          <p className="text-sm text-green-600">
                            ₹
                            {
                              product.offerPrice
                            }
                          </p>

                        </div>

                      </div>
                    )
                  )}

                </div>
              )}

            </div>
          )}

         {/* WISHLIST */}
<div
  className="relative cursor-pointer text-xl hover:text-red-200"
  onClick={() => navigate("/wishlist")}
>

  <FaHeart />

  {wishlistCount > 0 && (

    <span className="absolute -top-2 -right-3 bg-red-500 text-white text-[10px] min-w-[18px] h-[18px] rounded-full flex items-center justify-center font-bold">

      {wishlistCount}

    </span>
  )}

</div>

{/* CART */}
<div
  className="relative cursor-pointer text-xl"
  onClick={() => navigate("/cart")}
>
  <FaShoppingCart />

  {cartCount > 0 && (
    <span className="absolute -top-2 -right-3 bg-red-500 text-white text-[10px] min-w-[18px] h-[18px] rounded-full flex items-center justify-center font-bold">
      {cartCount}
    </span>
  )}
</div>
          {/* USER */}
          <div
            className="relative"
            ref={menuRef}
          >

            <FaUser
              onClick={() =>
                setUserMenu(
                  !userMenu
                )
              }
              className="cursor-pointer text-xl"
            />

            {userMenu && (

              <div className="absolute right-0 mt-3 w-48 bg-white text-black rounded-lg shadow-lg overflow-hidden z-50">

                {user ? (
                  <>

                    <div className="px-4 py-3 border-b bg-gray-50 font-medium">
                      Hi, {user.name}
                    </div>

                    <div
                      onClick={() =>
                        navigate(
                          "/profile"
                        )
                      }
                      className="px-4 py-3 hover:bg-gray-100 cursor-pointer"
                    >
                      Profile
                    </div>

                    <div
                      onClick={() =>
                        navigate(
                          "/orders"
                        )
                      }
                      className="px-4 py-3 hover:bg-gray-100 cursor-pointer"
                    >
                      Orders
                    </div>

                    <div
                      onClick={
                        handleLogout
                      }
                      className="px-4 py-3 hover:bg-gray-100 cursor-pointer text-red-500"
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
                      className="px-4 py-3 hover:bg-gray-100 cursor-pointer"
                    >
                      Login
                    </div>

                    <div
                      onClick={() =>
                        navigate(
                          "/register"
                        )
                      }
                      className="px-4 py-3 hover:bg-gray-100 cursor-pointer"
                    >
                      Register
                    </div>

                  </>
                )}

              </div>
            )}

          </div>

        </div>

        {/* MOBILE RIGHT */}
        <div className="flex lg:hidden items-center gap-4 text-xl">

          {/* SEARCH ICON */}
          {showSearchBar && (
            <FaSearch
              className="cursor-pointer"
              onClick={() =>
                setShowSearch(
                  !showSearch
                )
              }
            />
          )}

          {/* MENU ICON */}
          <div
            onClick={() =>
              setOpen(!open)
            }
            className="cursor-pointer"
          >

            {open
              ? <FaTimes />
              : <FaBars />}

          </div>

        </div>

      </div>

      {/* MOBILE SEARCH */}
      {showSearch &&
        showSearchBar && (

        <div className="mt-4 lg:hidden relative">

          <input
            type="text"
            value={search}
            onChange={handleSearch}
            placeholder="Search products..."
            className="w-full px-4 py-3 rounded-lg text-black outline-none"
          />
          

          {/* MOBILE SUGGESTIONS */}
          {search &&
            suggestions.length > 0 && (

            <div className="bg-white text-black rounded-lg shadow-lg mt-2 overflow-hidden">

              {suggestions.map(
                (product) => (

                  <div
                    key={
                      product._id
                    }
                    onClick={() =>
                      handleSelectProduct(
                        product
                      )
                    }
                    className="flex items-center gap-3 px-4 py-3 border-b hover:bg-gray-100 cursor-pointer"
                  >

                    <img
                      src={
                        product.image[0]
                      }
                      alt=""
                      className="w-12 h-12 rounded object-cover"
                    />

                    <div>

                      <p className="font-medium">
                        {product.name}
                      </p>

                      <p className="text-sm text-green-600">
                        ₹
                        {
                          product.offerPrice
                        }
                      </p>

                    </div>

                  </div>
                )
              )}

            </div>
          )}

        </div>
      )}
{/* MOBILE MENU */}
{open && (
  <div className="lg:hidden mt-4 bg-blue-700 rounded-lg p-4 flex flex-col gap-4">

    <span
      onClick={() => {
        handleNavigation("/");
        setOpen(false);
      }}
      className="cursor-pointer"
    >
      Home
    </span>

    <span
      onClick={() => {
        handleNavigation("/products");
        setOpen(false);
      }}
      className="cursor-pointer"
    >
      Products
    </span>

    <span
      onClick={() => {
        navigate("/about");
        setOpen(false);
      }}
      className="cursor-pointer"
    >
      About Us
    </span>

    <span
      onClick={() => {
        navigate("/contact");
        setOpen(false);
      }}
      className="cursor-pointer"
    >
      Contact Us
    </span>

    <span
      onClick={() => {
        navigate("/wishlist");
        setOpen(false);
      }}
      className="cursor-pointer"
    >
      Wishlist
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