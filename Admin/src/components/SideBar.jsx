import { NavLink } from "react-router-dom"

export default function Sidebar() {
  return (
    <div className="w-64 bg-black text-white min-h-screen p-5">
      <h1 className="text-2xl font-bold mb-10">
        Admin Panel
      </h1>

      <div className="flex flex-col gap-2">

        {/* DASHBOARD */}
        <NavLink
          to="/admin"
          className={({ isActive }) =>
            `p-2 rounded ${
              isActive ? "bg-white text-black" : ""
            }`
          }
        >
          Dashboard
        </NavLink>

        {/* USERS */}
        <NavLink
          to="/admin/users"
          className={({ isActive }) =>
            `p-2 rounded ${
              isActive ? "bg-white text-black" : ""
            }`
          }
        >
          Users
        </NavLink>

        {/* VENDORS */}
        <NavLink
          to="/admin/vendors"
          className={({ isActive }) =>
            `p-2 rounded ${
              isActive ? "bg-white text-black" : ""
            }`
          }
        >
          Vendors
        </NavLink>

        {/* 🛒 ORDERS (IMPORTANT - YOU WERE MISSING THIS) */}
        <NavLink
          to="/admin/orders"
          className={({ isActive }) =>
            `p-2 rounded ${
              isActive ? "bg-white text-black" : ""
            }`
          }
        >
          Orders
        </NavLink>

        <NavLink
  to="/admin/categories/create"
  className={({ isActive }) =>
    `p-2 rounded ${
      isActive
        ? "bg-white text-black"
        : ""
    }`
  }
>
  Add Category
</NavLink>

      </div>
    </div>
  )
}