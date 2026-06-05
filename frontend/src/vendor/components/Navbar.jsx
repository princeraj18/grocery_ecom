import React, {
  useEffect,
  useState,
} from "react";

import { useNavigate } from "react-router-dom";

import axios from "axios";
import ThemeToggle from "./ThemeToggle";

export default function Navbar() {

  const navigate = useNavigate();

  const [vendor, setVendor] =
    useState(null);

  // ======================================
  // FETCH VENDOR PROFILE
  // ======================================
  useEffect(() => {

    const fetchVendor =
      async () => {

        try {

          const token =
            localStorage.getItem(
              "vendorToken"
            );

          if (!token) return;

          const { data } =
            await axios.get(
              "http://localhost:5000/api/vendors/profile",
              {
                headers: {
                  Authorization:
                    `Bearer ${token}`,
                },
              }
            );

          setVendor(data);

        } catch (error) {

          console.log(error);
        }
      };

    fetchVendor();

  }, []);

  // ======================================
  // LOGOUT
  // ======================================
  const handleLogout = () => {

    localStorage.removeItem(
      "vendorToken"
    );

    localStorage.removeItem(
      "vendor"
    );

    navigate("/vendor/login");
  };

  return (

    <div className="bg-white shadow px-6 py-4 flex items-center justify-between dark:bg-slate-900 dark:text-white">

      {/* TITLE */}
      <h1 className="text-2xl font-bold">
        Vendor Panel
      </h1>

      {/* RIGHT SIDE */}
      <div className="flex items-center gap-4">

        {/* VENDOR INFO */}
        <div className="flex items-center gap-3">

          {/* PROFILE IMAGE */}
          <img
            src={
              vendor?.logo
                ? vendor.logo
                : "https://i.pravatar.cc/150"
            }
            alt="Vendor"
            className="w-11 h-11 rounded-full object-cover border-2 border-gray-300"
          />

          {/* NAME */}
          <div className="hidden md:block">

            <h3 className="font-semibold text-sm">
              {
                vendor?.shopName
              }
            </h3>

            <p className="text-xs text-gray-500">
              {
                vendor?.ownerName
              }
            </p>

          </div>

        </div>

        {/* LOGOUT */}
        <ThemeToggle />

        <button
          onClick={handleLogout}
          className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
        >
          Logout
        </button>

      </div>

    </div>
  );
}
