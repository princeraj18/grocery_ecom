import React, { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import ThemeToggle from "../components/ThemeToggle";

export default function VendorForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    setLoading(true);

    try {
      const res = await axios.post("http://localhost:5000/api/vendors/forgot-password", { email });
      if (res.data.success) {
        setMessage("A password reset link has been sent to your vendor email inbox.");
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
      <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md">
        <h1 className="text-3xl font-bold text-center mb-4 text-gray-800">Vendor Forgot Password</h1>
        <p className="text-sm text-gray-500 text-center mb-6">Enter your store email registration.</p>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="font-semibold text-sm text-gray-700 block mb-2">Store Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="vendor@shop.com"
              className="w-full border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg transition font-medium disabled:bg-gray-400"
          >
            {loading ? "Verifying Profile..." : "Send Reset Link"}
          </button>
        </form>

        {message && <div className="mt-4 p-3 bg-green-100 border border-green-300 text-green-700 rounded-lg text-sm">{message}</div>}
        {error && <div className="mt-4 p-3 bg-red-100 border border-red-300 text-red-700 rounded-lg text-sm">{error}</div>}

        <p className="text-center mt-6 text-sm">
          Return to <Link to="/vendor/login" className="text-green-600 font-semibold hover:underline">Vendor Login</Link>
        </p>
      </div>
    </div>
  );
}