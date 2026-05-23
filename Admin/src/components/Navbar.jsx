import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {

  const navigate = useNavigate();

  const { logout } =
    useAuth();

  const handleLogout = () => {

    logout();

    navigate("/login");
  };

  return (
    <div className="bg-white shadow px-6 py-4 flex items-center justify-between">

      <h2 className="text-2xl font-semibold">
        Admin Dashboard
      </h2>

      <button
        onClick={handleLogout}
        className="bg-red-500 text-white px-4 py-2 rounded-lg"
      >
        Logout
      </button>

    </div>
  );
}