import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

export default function Register() {

  const navigate = useNavigate();

  const [loading, setLoading] =
    useState(false);

  const [formData, setFormData] =
    useState({
      name: "",
      email: "",
      password: "",
    });

  const handleChange = (e) => {

    setFormData({
      ...formData,
      [e.target.name]:
        e.target.value,
    });

  };

  const handleSubmit = async (e) => {

    e.preventDefault();

    try {

      setLoading(true);

      await api.post(
        "/admin/register",
        formData
      );

      alert(
        "Admin registered successfully"
      );

      // redirect to login page
      navigate("/login");

    } catch (error) {

      alert(
        error.response?.data?.message ||
        "Registration failed"
      );

    } finally {

      setLoading(false);

    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">

      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md"
      >

        <h1 className="text-3xl font-bold mb-6 text-center">
          Admin Register
        </h1>

        {/* Name */}
        <input
          type="text"
          name="name"
          placeholder="Name"
          className="w-full border p-3 mb-4 rounded-lg outline-none focus:ring-2 focus:ring-black"
          onChange={handleChange}
          required
        />

        {/* Email */}
        <input
          type="email"
          name="email"
          placeholder="Email"
          className="w-full border p-3 mb-4 rounded-lg outline-none focus:ring-2 focus:ring-black"
          onChange={handleChange}
          required
        />

        {/* Password */}
        <input
          type="password"
          name="password"
          placeholder="Password"
          className="w-full border p-3 mb-4 rounded-lg outline-none focus:ring-2 focus:ring-black"
          onChange={handleChange}
          required
        />

        {/* Register Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-black text-white p-3 rounded-lg hover:bg-gray-800 transition"
        >
          {
            loading
              ? "Registering..."
              : "Register"
          }
        </button>

        {/* Login Redirect */}
        <p className="text-center mt-5 text-gray-600">
          Already have an account?
        </p>

        <button
          type="button"
          onClick={() =>
            navigate("/login")
          }
          className="w-full mt-3 border border-black text-black p-3 rounded-lg hover:bg-black hover:text-white transition"
        >
          Go to Login
        </button>

      </form>

    </div>
  );
}