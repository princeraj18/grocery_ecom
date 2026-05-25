import React from "react";
import { useNavigate } from "react-router-dom";

export default function Navbar() {

  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("vendorToken");
    localStorage.removeItem("vendor");
    navigate("/vendor/login");
  };

  return (
    <div className="bg-white shadow px-6 py-4 flex items-center justify-between">

      <h1 className="text-2xl font-bold">Vendor Dashboard</h1>

      <div className="flex items-center gap-4">

        <button
          onClick={handleLogout}
          className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
        >
          Logout
        </button>

        <img
          src="https://i.pravatar.cc/40"
          alt=""
          className="w-10 h-10 rounded-full"
        />

      </div>

    </div>
  );
}