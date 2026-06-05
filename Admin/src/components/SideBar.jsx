import { NavLink } from "react-router-dom";

export default function Sidebar() {

  const navLinkClass = ({ isActive }) =>
    `p-3 rounded-xl transition-all duration-200 font-medium ${
      isActive
        ? "bg-white text-black"
        : "text-gray-300 hover:bg-gray-800 hover:text-white"
    }`;

  return (

    <div className="w-64 bg-black text-white min-h-screen p-5 border-r border-gray-800">

      {/* LOGO */}
      <h1 className="text-3xl font-extrabold mb-10 tracking-wide">
        Admin Panel
      </h1>

      {/* MENU */}
      <div className="flex flex-col gap-3">

        {/* DASHBOARD */}
        <NavLink
          to="/admin"
          className={navLinkClass}
        >
          Dashboard
        </NavLink>

        {/* USERS */}
        <NavLink
          to="/admin/users"
          className={navLinkClass}
        >
          Users
        </NavLink>

        {/* VENDORS */}
        <NavLink
          to="/admin/vendors"
          className={navLinkClass}
        >
          Vendors
        </NavLink>

        {/* ORDERS */}
        <NavLink
          to="/admin/orders"
          className={navLinkClass}
        >
          Orders
        </NavLink>

        {/* DELIVERY DASHBOARD */}
        <NavLink
          to="/delivery/dashboard"
          className={navLinkClass}
        >
          Delivery Dashboard
        </NavLink>
<NavLink
  to="/admin/delivery-partners"
  className={({ isActive }) =>
    `p-2 rounded ${
      isActive
        ? "bg-white text-black"
        : ""
    }`
  }
>
  Delivery Partners
</NavLink>
        {/* DELIVERY EARNINGS */}
        <NavLink
          to="/delivery/earnings"
          className={navLinkClass}
        >
          Delivery Earnings
        </NavLink>

        {/* ADD VARIANT */}
        <NavLink
          to="/admin/variants/create"
          className={navLinkClass}
        >
          Add Variant
        </NavLink>

        {/* ADD CATEGORY */}
        <NavLink
          to="/admin/categories/create"
          className={navLinkClass}
        >
          Add Category
        </NavLink>

        {/* SUPPORT */}
        <NavLink
          to="/admin/support"
          className={navLinkClass}
        >
          Support
        </NavLink>

      </div>
    </div>
  );
}