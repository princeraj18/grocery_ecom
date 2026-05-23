import { useNavigate } from "react-router-dom";
import { useState } from "react";
import api from "../services/api";

export default function Login() {

  const navigate = useNavigate();

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

      // save admin token
      localStorage.setItem(
        "adminToken",
        data.token
      );

      // optional common token
      localStorage.setItem(
        "token",
        data.token
      );

      // save admin info
      localStorage.setItem(
        "admin",
        JSON.stringify({
          _id: data._id,
          name: data.name,
          email: data.email,
          role: data.role,
          permissions:
            data.permissions || [],
        })
      );

      // redirect admin dashboard
      navigate("/admin");

    } catch (error) {

      alert(
        error.response?.data?.message ||
        "Login failed"
      );

    } finally {

      setLoading(false);

    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">

      <form
        onSubmit={handleLogin}
        className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md"
      >

        <h1 className="text-3xl font-bold mb-6 text-center">
          Admin Login
        </h1>

        {/* Email */}
        <input
          className="w-full border p-3 mb-4 rounded-lg outline-none focus:ring-2 focus:ring-black"
          placeholder="Email"
          type="email"
          value={email}
          onChange={(e) =>
            setEmail(e.target.value)
          }
          required
        />

        {/* Password */}
        <input
          className="w-full border p-3 mb-4 rounded-lg outline-none focus:ring-2 focus:ring-black"
          placeholder="Password"
          type="password"
          value={password}
          onChange={(e) =>
            setPassword(e.target.value)
          }
          required
        />

        {/* Login Button */}
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

        {/* Register Redirect */}
        <p className="text-center mt-5 text-gray-600">
          Don't have an admin account?
        </p>

        <button
          type="button"
          onClick={() =>
            navigate("/register")
          }
          className="w-full mt-3 border border-black text-black p-3 rounded-lg hover:bg-black hover:text-white transition"
        >
          Register Admin
        </button>

      </form>

    </div>
  );
}