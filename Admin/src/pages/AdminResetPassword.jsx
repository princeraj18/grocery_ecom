import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../services/api";

export default function AdminResetPassword() {
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
      setError("Credentials verification failed. Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      const res = await api.post("/admin/reset-password", {
        token,
        password,
      });

      if (res.data.success) {
        alert("Administrative password updated successfully!");
        navigate("/login");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Session key has expired. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-6">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md">
        <h1 className="text-3xl font-bold text-center mb-6">Modify Admin Password</h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="password"
            placeholder="New Admin Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full border p-3 rounded-lg outline-none focus:ring-2 focus:ring-black"
          />

          <input
            type="password"
            placeholder="Confirm Admin Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            className="w-full border p-3 rounded-lg outline-none focus:ring-2 focus:ring-black"
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-black text-white p-3 rounded-lg hover:bg-gray-800 transition"
          >
            {loading ? "Re-saving System Keys..." : "Update Security Matrix"}
          </button>
        </form>

        {error && <div className="mt-4 p-3 bg-red-100 text-red-700 rounded-lg text-sm border border-red-300">{error}</div>}
      </div>
    </div>
  );
}