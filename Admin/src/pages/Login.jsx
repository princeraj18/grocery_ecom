import { useNavigate } from "react-router-dom";
import { useState } from "react";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";
import ThemeToggle from "../components/ThemeToggle";

export default function Login() {

  const navigate = useNavigate();

  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {

    e.preventDefault();

    try {

      setLoading(true);

      const { data } = await api.post(
        "/admin/login",
        {
          email,
          password,
        }
      );

      // Normalize response: backend may return admin fields at top-level
      const token = data?.token;
      const refreshToken = data?.refreshToken;

      const adminData =
        data?.admin ?? {
          _id: data?._id ?? data?.id,
          name: data?.name,
          email: data?.email,
          role: data?.role,
        };

      // SAVE TOKENS (if present)
      if (token) {
        localStorage.setItem("adminToken", token);
      }
      if (refreshToken) {
        localStorage.setItem("adminRefreshToken", refreshToken);
      }

      // SAVE ADMIN
      if (adminData) {
        localStorage.setItem(
          "admin",
          JSON.stringify(adminData)
        );
      }

      // CONTEXT LOGIN
      login(adminData);

      alert("Login Successful");

      // REDIRECT TO ADMIN DASHBOARD
      navigate("/admin");

    } catch (error) {

      console.log(error);

      alert(
        error.response?.data?.message ||
        "Login Failed"
      );

    } finally {

      setLoading(false);

    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-slate-950 relative">
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>

      <form
        onSubmit={handleLogin}
        className="bg-white dark:bg-slate-900 p-8 rounded-2xl shadow-lg w-full max-w-md"
      >

        <h1 className="text-3xl font-bold mb-6 text-center">
          Admin Login
        </h1>

        {/* EMAIL */}
        <input
          type="email"
          placeholder="Enter Email"
          value={email}
          onChange={(e) =>
            setEmail(e.target.value)
          }
          className="w-full border p-3 mb-4 rounded-lg outline-none focus:ring-2 focus:ring-black"
          required
        />

        {/* PASSWORD */}
        <input
          type="password"
          placeholder="Enter Password"
          value={password}
          onChange={(e) =>
            setPassword(e.target.value)
          }
          className="w-full border p-3 mb-4 rounded-lg outline-none focus:ring-2 focus:ring-black"
          required
        />

        <div className="flex justify-end mb-4">
  <button
    type="button"
    onClick={() => navigate("/admin/forgot-password")}
    className="text-sm text-gray-600 dark:text-slate-400 hover:text-black hover:underline font-medium"
  >
    Forgot Password?
  </button>
</div>

        {/* LOGIN BUTTON */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-black text-white p-3 rounded-lg hover:bg-gray-800 transition"
        >
          {
            loading
              ? "Logging in..."
              : "Login"
          }
        </button>

        {/* REGISTER OPTION */}
        <p className="text-center mt-5 text-gray-600 dark:text-slate-400">
          Don't have an account?
        </p>

        <button
          type="button"
          onClick={() =>
            navigate("/register")
          }
          className="w-full mt-3 border border-black text-black p-3 rounded-lg hover:bg-black hover:text-white transition"
        >
          Register Now
        </button>

      </form>

    </div>
  );
}