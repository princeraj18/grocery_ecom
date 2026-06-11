import React, { useState } from "react";

import axios from "axios";

import { useNavigate, Link } from "react-router-dom";
import ThemeToggle from "../components/ThemeToggle";

export default function VendorLogin() {

  const navigate =
    useNavigate();

  const [formData, setFormData] =
    useState({
      email: "",
      password: "",
    });

  const [loading, setLoading] =
    useState(false);

  // =========================
  // HANDLE CHANGE
  // =========================
  const handleChange = (e) => {

    setFormData({
      ...formData,
      [e.target.name]:
        e.target.value,
    });
  };

  // =========================
  // HANDLE LOGIN
  // =========================
 const handleSubmit = async (e) => {

  e.preventDefault();

  try {

    setLoading(true);

    const { data } =
      await axios.post(
        "http://localhost:5000/api/vendors/login",
        formData
      );

    // SAVE TOKEN
    localStorage.setItem(
      "vendorToken",
      data.token
    );

    localStorage.setItem(
      "vendor",
      JSON.stringify(data.vendor)
    );

    alert("Login Successful");

    // REDIRECT TO DASHBOARD
    // navigate("/vendor/dashboard");
    window.location.href =
  "/vendor/analytics";

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

      <div className="absolute top-6 right-6 flex items-center gap-3">
        <ThemeToggle />
        <Link
          to="/login"
          className="bg-gray-200 dark:bg-slate-800 dark:text-white px-3 py-2 rounded hover:bg-gray-300 dark:hover:bg-slate-700 text-sm font-medium"
        >
          Back to user login
        </Link>
      </div>

      <div className="bg-white dark:bg-slate-900 p-8 rounded-2xl shadow-lg w-full max-w-md">

        <h1 className="text-3xl font-bold text-center mb-8">
          Vendor Login
        </h1>

        <form
          onSubmit={handleSubmit}
          className="space-y-5"
        >

          {/* EMAIL */}
          <div>

            <label className="font-semibold">
              Email
            </label>

            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={
                handleChange
              }
              required
              className="w-full border p-3 rounded-lg mt-2"
            />

          </div>

          {/* PASSWORD */}
        {/* PASSWORD */}
<div>
  <label className="font-semibold">Password</label>
  <input
    type="password"
    name="password"
    value={formData.password}
    onChange={handleChange}
    required
    className="w-full border p-3 rounded-lg mt-2"
  />
</div>

{/* FORGOT PASSWORD */}
<div className="flex justify-end text-sm">
  <Link to="/vendor/forgot-password" className="text-green-600 hover:underline">
    Forgot Password?
  </Link>
</div>

          {/* BUTTON */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg transition"
          >

            {
              loading
                ? "Logging In..."
                : "Login"
            }

          </button>

        </form>

        <p className="text-center mt-5">

          Don't have an account?{" "}

          <Link
            to="/vendor/register"
            className="text-green-600 font-semibold"
          >
            Register
          </Link>

        </p>

      </div>

    </div>
  );
}