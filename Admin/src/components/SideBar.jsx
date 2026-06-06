import { NavLink } from "react-router-dom";

export default function Sidebar() {
  const navLinkClass = ({ isActive }) =>
    `p-2.5 rounded-lg transition-all duration-200 text-sm font-medium ${
      isActive
        ? "bg-white text-black"
        : "text-gray-300 hover:bg-gray-800 hover:text-white"
    }`;

  return (
    <div className="w-72 bg-black text-white min-h-screen p-5 border-r border-gray-800">
      {/* LOGO */}
      <h1 className="text-2xl font-extrabold mb-6 tracking-wide">
        Admin Panel
      </h1>

      {/* MENU */}
      <div className="flex flex-col gap-1">
        {/* DASHBOARD */}
        <NavLink to="/admin" className={navLinkClass}>
          Dashboard
        </NavLink>

        {/* USERS */}
        <NavLink to="/admin/users" className={navLinkClass}>
          Users
        </NavLink>

        {/* VENDORS */}
        <NavLink to="/admin/vendors" className={navLinkClass}>
          Vendors
        </NavLink>

        {/* ORDERS */}
        <NavLink to="/admin/orders" className={navLinkClass}>
          Orders
        </NavLink>

        {/* DELIVERY PARTNERS */}
        <NavLink
          to="/admin/delivery-partners"
          className={navLinkClass}
        >
          Delivery Partners
        </NavLink>

        {/* WITHDRAWAL REQUESTS */}
        <NavLink
          to="/admin/withdrawal-requests"
          className={navLinkClass}
        >
          Withdrawal Requests
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