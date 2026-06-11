import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import ThemeToggle from "../components/ThemeToggle";

export default function AdminForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    setLoading(true);

    try {
      const res = await api.post("/admin/forgot-password", { email });
      if (res.data.success) {
        setMessage("An administrative recovery link has been dispatched to your email inbox.");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-slate-950 px-6 relative">
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>
      <div className="bg-white dark:bg-slate-900 p-8 rounded-2xl shadow-lg w-full max-w-md">
        <h1 className="text-3xl font-bold text-center mb-2">Admin Recovery</h1>
        <p className="text-sm text-gray-500 dark:text-slate-400 text-center mb-6">Enter verified administrative credentials.</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="admin@enterprise.com"
            className="w-full border p-3 rounded-lg outline-none focus:ring-2 focus:ring-black"
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-black text-white p-3 rounded-lg hover:bg-gray-800 transition disabled:bg-gray-400"
          >
            {loading ? "Verifying Authority..." : "Send Reset Link"}
          </button>
        </form>

        {message && <div className="mt-4 p-3 bg-green-100 text-green-700 rounded-lg text-sm border border-green-300">{message}</div>}
        {error && <div className="mt-4 p-3 bg-red-100 text-red-700 rounded-lg text-sm border border-red-300">{error}</div>}

        <button
          type="button"
          onClick={() => navigate("/login")}
          className="w-full mt-4 text-center text-sm font-semibold hover:underline text-gray-600 dark:text-slate-400"
        >
          Return to Admin Login
        </button>
      </div>
    </div>
  );
}