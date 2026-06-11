import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import ThemeToggle from "../components/ThemeToggle";
import api from "../api/api";

export default function VendorResetPassword() {
  const { token } = useParams();
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      const res = await api.post("/vendors/reset-password", {
        token,
        password,
      });

      if (res.data.success) {
        alert("Password updated successfully!");
        navigate("/vendor/login");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Link has expired. Please try again.");
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
        <h1 className="text-3xl font-bold text-center mb-6 text-gray-800 dark:text-slate-100">Set Vendor Password</h1>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="font-semibold text-sm text-gray-700 dark:text-slate-300 block mb-2">New Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          <div>
            <label className="font-semibold text-sm text-gray-700 dark:text-slate-300 block mb-2">Confirm New Password</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className="w-full border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg transition font-medium"
          >
            {loading ? "Saving Credentials..." : "Update Password"}
          </button>
        </form>

        {error && <div className="mt-4 p-3 bg-red-100 border border-red-300 text-red-700 rounded-lg text-sm">{error}</div>}
      </div>
    </div>
  );
}