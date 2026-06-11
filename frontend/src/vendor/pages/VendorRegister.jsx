import React, {
  useState,
} from "react";

import axios from "axios";

import {
  useNavigate,
  Link,
} from "react-router-dom";
import ThemeToggle from "../components/ThemeToggle";
import api from "../api/api";

export default function VendorRegister() {

  const navigate =
    useNavigate();

  const [formData, setFormData] =
    useState({
      shopName: "",
      ownerName: "",
      email: "",
      password: "",
      phone: "",
      address: "",
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
  // HANDLE REGISTER
  // =========================
  const handleSubmit =
    async (e) => {

      e.preventDefault();

      try {

        setLoading(true);

        const { data } =
          await api.post(
            "/vendors/register",
            formData
          );

localStorage.setItem(
  "vendorToken",
  data.token
);

localStorage.setItem(
  "vendor",
  JSON.stringify(data.vendor)
);

alert("Registration Successful");

// navigate("/vendor/dashboard");
window.location.href =
  "/vendor/analytics";

      } catch (error) {

        console.log(error);

        alert(
          error.response?.data
            ?.message ||
            "Registration Failed"
        );

      } finally {

        setLoading(false);
      }
    };

  return (

    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-slate-950 py-10 relative">
      <div className="absolute top-6 right-6">
        <ThemeToggle />
      </div>

      <div className="bg-white dark:bg-slate-900 p-8 rounded-2xl shadow-lg w-full max-w-2xl">

        <h1 className="text-3xl font-bold text-center mb-8">
          Vendor Register
        </h1>

        <form
          onSubmit={handleSubmit}
          className="grid md:grid-cols-2 gap-5"
        >

          {/* SHOP NAME */}
          <div>

            <label className="font-semibold">
              Shop Name
            </label>

            <input
              type="text"
              name="shopName"
              value={
                formData.shopName
              }
              onChange={
                handleChange
              }
              required
              className="w-full border p-3 rounded-lg mt-2"
            />

          </div>

          {/* OWNER NAME */}
          <div>

            <label className="font-semibold">
              Owner Name
            </label>

            <input
              type="text"
              name="ownerName"
              value={
                formData.ownerName
              }
              onChange={
                handleChange
              }
              required
              className="w-full border p-3 rounded-lg mt-2"
            />

          </div>

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
          <div>

            <label className="font-semibold">
              Password
            </label>

            <input
              type="password"
              name="password"
              value={
                formData.password
              }
              onChange={
                handleChange
              }
              required
              className="w-full border p-3 rounded-lg mt-2"
            />

          </div>

          {/* PHONE */}
          <div>

            <label className="font-semibold">
              Phone
            </label>

            <input
              type="text"
              name="phone"
              value={formData.phone}
              onChange={
                handleChange
              }
              className="w-full border p-3 rounded-lg mt-2"
            />

          </div>

          {/* ADDRESS */}
          <div>

            <label className="font-semibold">
              Address
            </label>

            <input
              type="text"
              name="address"
              value={
                formData.address
              }
              onChange={
                handleChange
              }
              className="w-full border p-3 rounded-lg mt-2"
            />

          </div>

          {/* BUTTON */}
          <div className="md:col-span-2">

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-black hover:bg-gray-800 text-white py-3 rounded-lg transition"
            >

              {
                loading
                  ? "Creating Account..."
                  : "Register"
              }

            </button>

          </div>

        </form>

        <p className="text-center mt-5">

          Already have an account?{" "}

          <Link
            to="/vendor/login"
            className="text-green-600 font-semibold"
          >
            Login
          </Link>

        </p>

      </div>

    </div>
  );
}