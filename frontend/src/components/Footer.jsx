import React from "react";
import { FaFacebook, FaInstagram, FaTwitter, FaShoppingBag } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
 function Footer() {
  const navigate = useNavigate();
  return (
    <footer className="bg-gray-900 text-white mt-10">

      {/* Top Section */}
      <div className="max-w-6xl mx-auto px-4 py-10 grid grid-cols-1 md:grid-cols-4 gap-8">

        {/* Brand */}
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <FaShoppingBag /> Grocify
          </h2>
          <p className="text-gray-400 mt-3 text-sm">
            Your one-stop destination for all shopping needs. Best deals, best prices.
          </p>
        </div>

        {/* Links */}
        <div>
          <h3 className="text-lg font-semibold mb-3">Quick Links</h3>
          <ul className="space-y-2 text-gray-400">
            <li
            onClick={()=>{
              navigate("/")
            }}
             className="hover:text-white cursor-pointer">Home</li>
            <li
             onClick={()=>{
               navigate("/about")
             }}
             className="hover:text-white cursor-pointer">About</li>
            <li
             onClick={()=>{
               navigate("/products")
             }}
             className="hover:text-white cursor-pointer">Products</li>
            <li
             onClick={()=>{
               navigate("/contact")
             }}
             className="hover:text-white cursor-pointer">Contact</li>
          </ul>
        </div>

        {/* Customer */}
        <div>
          <h3 className="text-lg font-semibold mb-3">Customer Care</h3>
          <ul className="space-y-2 text-gray-400">
            <li className="hover:text-white cursor-pointer">FAQ</li>
            <li className="hover:text-white cursor-pointer">Shipping</li>
            <li className="hover:text-white cursor-pointer">Returns</li>
            <li className="hover:text-white cursor-pointer">Support</li>
          </ul>
        </div>

        {/* Social */}
        <div>
          <h3 className="text-lg font-semibold mb-3">Follow Us</h3>
          <div className="flex gap-4 text-xl">
            <FaFacebook className="hover:text-blue-500 cursor-pointer" />
            <FaInstagram className="hover:text-pink-500 cursor-pointer" />
            <FaTwitter className="hover:text-sky-400 cursor-pointer" />
          </div>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="border-t border-gray-700 text-center py-4 text-gray-500 text-sm">
        © {new Date().getFullYear()} Grocify. All rights reserved.
      </div>

    </footer>
  );
}

export default Footer;