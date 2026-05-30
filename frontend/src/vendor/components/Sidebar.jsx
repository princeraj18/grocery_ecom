import React from "react";
import { Link, useLocation } from "react-router-dom";

export default function Sidebar() {

  const location = useLocation();

  const menus = [
    {
      name: "Analytics",
      path: "/vendor/analytics",
    },
    {
      name: "Products",
      path: "/vendor/products",
    },
    {
      name: "Add Product",
      path: "/vendor/products/create",
    },
    {
      name: "Orders",
      path: "/vendor/orders",
    }, {
      name: "Inventory",
      path: "/vendor/inventory",
    },
    {
      name: "Coupons",
      path: "/vendor/coupons",
    }
   ,
    {
      name: "Reviews",
      path: "/vendor/reviews",
    },
    {
      name: "Profile",
      path: "/vendor/profile",
    },
  ];

  return (
    <div className="w-64 min-h-screen bg-black text-white p-5">

      <h1 className="text-2xl font-bold mb-10">
        Vendor Panel
      </h1>

      <div className="space-y-3">

        {menus.map((menu) => (

          <Link
            key={menu.path}
            to={menu.path}
            className={`block px-4 py-3 rounded-lg transition ${
              location.pathname === menu.path
                ? "bg-green-600"
                : "hover:bg-gray-800"
            }`}
          >
            {menu.name}
          </Link>
        ))}

      </div>

    </div>
  );
}