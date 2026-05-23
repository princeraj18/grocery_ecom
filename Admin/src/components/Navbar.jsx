import { useNavigate } from "react-router-dom";

export default function Navbar() {

  const navigate = useNavigate();

  const handleLogout = () => {

    // remove auth data
    localStorage.removeItem("adminToken");
    localStorage.removeItem("admin");
    localStorage.removeItem("token");

    // redirect to login
    navigate("/login");
  };

  return (
    <div className="bg-white shadow px-6 py-4 flex items-center justify-between">

      {/* Title */}
      <h2 className="text-2xl font-semibold">
        Admin Dashboard
      </h2>

      {/* Right Side */}
      <div className="flex items-center gap-4">

        <span className="text-gray-600">
          Welcome Admin
        </span>

        <button
          onClick={handleLogout}
          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition"
        >
          Logout
        </button>

      </div>

    </div>
  );
}