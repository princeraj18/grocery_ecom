import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import ThemeToggle from "./ThemeToggle";

export default function Navbar() {

  const navigate = useNavigate();

  const { logout } =
    useAuth();

  const handleLogout = () => {

    logout();

    navigate("/login");
  };

  return (
    <div className="bg-white dark:bg-slate-900 shadow px-6 py-4 flex items-center justify-between dark:text-white">

      <h2 className="text-2xl font-semibold">
        Admin Dashboard
      </h2>

      <div className="flex items-center gap-3">
        <ThemeToggle />

        <button
          onClick={handleLogout}
          className="bg-red-500 text-white px-4 py-2 rounded-lg"
        >
          Logout
        </button>
      </div>

    </div>
  );
}
