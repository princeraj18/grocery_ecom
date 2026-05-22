import React, { useState, useContext, useRef, useEffect } from "react";
import { ShopContext } from "../context/ShopContext";
import {
  FaShoppingCart,
  FaUser,
  FaBars,
  FaTimes,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [userMenu, setUserMenu] = useState(false);

  const navigate = useNavigate();
  const { cartItems } = useContext(ShopContext);

  const menuRef = useRef();

  const cartCount = cartItems.reduce(
    (total, item) => total + item.quantity,
    0
  );

  // Close dropdown when clicked outside
  useEffect(() => {
    const handler = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setUserMenu(false);
      }
    };

    document.addEventListener("mousedown", handler);

    return () => {
      document.removeEventListener("mousedown", handler);
    };
  }, []);
  const user = JSON.parse(localStorage.getItem("user"));

const handleLogout = () => {
  localStorage.removeItem("user");
  navigate("/login");
  setUserMenu(false);
};

  return (
    <nav className="bg-blue-600 text-white px-4 py-3 flex items-center justify-between relative shadow-md">

      {/* Logo */}
      <div className="text-2xl font-bold">Grocify</div>

      {/* Desktop Menu */}
      <div className="hidden md:flex items-center gap-6 font-medium">
        <span
          onClick={() => navigate("/")}
          className="cursor-pointer hover:text-gray-200"
        >
          Home
        </span>

        <span
          onClick={() => navigate("/products")}
          className="cursor-pointer hover:text-gray-200"
        >
          Products
        </span>

        <span
          onClick={() => navigate("/about")}
          className="cursor-pointer hover:text-gray-200"
        >
          About Us
        </span>

        <span
          onClick={() => navigate("/contact")}
          className="cursor-pointer hover:text-gray-200"
        >
          Contact Us
        </span>
      </div>

      {/* Desktop Icons */}
      <div className="hidden md:flex items-center gap-5 text-xl relative">

        {/* Cart */}
        <div
          className="relative cursor-pointer"
          onClick={() => navigate("/cart")}
        >
          <FaShoppingCart className="text-xl hover:text-gray-200" />

          {cartCount > 0 && (
            <span className="absolute -top-2 -right-3 bg-red-500 text-white text-[10px] min-w-[18px] h-[18px] rounded-full flex items-center justify-center font-bold">
              {cartCount}
            </span>
          )}
        </div>

       <div className="relative" ref={menuRef}>
  <FaUser
    onClick={() => setUserMenu(!userMenu)}
    className="cursor-pointer hover:text-gray-200"
  />

  {userMenu && (
    <div className="absolute right-0 mt-3 w-48 bg-white text-black rounded-lg shadow-lg overflow-hidden z-50">

      {user ? (
        <>
          <div className="px-4 py-3 border-b bg-gray-50 font-medium">
            Hi, {user.name}
          </div>

          <div
            onClick={() => {
              navigate("/profile");
              setUserMenu(false);
            }}
            className="px-4 py-3 hover:bg-gray-100 cursor-pointer"
          >
            Profile
          </div>

          <div
            onClick={() => {
              navigate("/orders");
              setUserMenu(false);
            }}
            className="px-4 py-3 hover:bg-gray-100 cursor-pointer"
          >
            My Orders
          </div>

          <div
            onClick={handleLogout}
            className="px-4 py-3 hover:bg-gray-100 cursor-pointer text-red-500"
          >
            Logout
          </div>
        </>
      ) : (
        <>
          <div
            onClick={() => {
              navigate("/login");
              setUserMenu(false);
            }}
            className="px-4 py-3 hover:bg-gray-100 cursor-pointer"
          >
            Login
          </div>

          <div
            onClick={() => {
              navigate("/register");
              setUserMenu(false);
            }}
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

      {/* Mobile Button */}
      <div
        className="md:hidden text-2xl cursor-pointer"
        onClick={() => setOpen(!open)}
      >
        {open ? <FaTimes /> : <FaBars />}
      </div>

      {/* Mobile Menu */}
      {open && (
        <div className="absolute top-full left-0 w-full bg-white text-black shadow-lg flex flex-col gap-4 p-4 md:hidden">

          {/* Search */}
          <input
            type="text"
            placeholder="Search..."
            className="w-full px-3 py-2 border rounded-md outline-none"
          />

          {/* Mobile Icons */}
          <div className="flex justify-around text-xl py-2">

            {/* Cart */}
            <div
              className="relative cursor-pointer"
              onClick={() => navigate("/cart")}
            >
              <FaShoppingCart />

              {cartCount > 0 && (
                <span className="absolute -top-2 -right-3 bg-red-500 text-white text-[10px] min-w-[18px] h-[18px] rounded-full flex items-center justify-center font-bold">
                  {cartCount}
                </span>
              )}
            </div>

            {/* User */}
      <div className="relative">
  <FaUser
    onClick={() => setUserMenu(!userMenu)}
    className="cursor-pointer"
  />

  {userMenu && (
    <div className="absolute right-0 mt-3 w-44 bg-white border rounded-lg shadow-lg text-sm z-50">

      {user ? (
        <>
          <div className="px-4 py-3 border-b bg-gray-50 font-medium">
            Hi, {user.name}
          </div>

          <div
            onClick={() => {
              navigate("/profile");
              setUserMenu(false);
            }}
            className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
          >
            Profile
          </div>

          <div
            onClick={() => {
              navigate("/orders");
              setUserMenu(false);
            }}
            className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
          >
            My Orders
          </div>

          <div
            onClick={handleLogout}
            className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-red-500"
          >
            Logout
          </div>
        </>
      ) : (
        <>
          <div
            onClick={() => {
              navigate("/login");
              setUserMenu(false);
            }}
            className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
          >
            Login
          </div>

          <div
            onClick={() => {
              navigate("/register");
              setUserMenu(false);
            }}
            className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
          >
            Register
          </div>
        </>
      )}
    </div>
  )}
</div>

          </div>
        </div>
      )}
    </nav>
  );
}