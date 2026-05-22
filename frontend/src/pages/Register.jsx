import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import api from "../api/Axios";
const Register = () => {
  const navigate = useNavigate();
const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    
    
  });

    const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "checkbox" ? checked : value,
    }));
  };
 const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    const res = await api.post("/users/register", {
      name: formData.name,
      email: formData.email,
      password: formData.password,
    });

    // Save user
    localStorage.setItem(
      "user",
      JSON.stringify(res.data)
    );

    alert("Registration Successful");

    navigate("/");
  } catch (error) {
    console.log(error);

    alert(
      error.response?.data?.message ||
      "Registration Failed"
    );
  }
};




  return (
    <div className="min-h-screen flex">
      {/* Left Section */}
      <div className="hidden lg:flex w-1/2 bg-gradient-to-r from-indigo-600 to-purple-700 items-center justify-center p-12">
        <div className="text-white max-w-md">
          <h1 className="text-5xl font-bold leading-tight">
            Join ShopEase
          </h1>

          <p className="mt-6 text-lg text-indigo-100">
            Create an account and start shopping from thousands of premium
            products at the best prices.
          </p>

          <img
            src="https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=800"
            alt="register"
            className="mt-10 rounded-2xl shadow-2xl"
          />
        </div>
      </div>

      {/* Right Section */}
      <div className="w-full lg:w-1/2 flex items-center justify-center bg-gray-50 px-6 py-10">
        <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-lg">
          <h2 className="text-3xl font-bold text-center text-gray-800">
            Create Account
          </h2>

          <p className="text-center text-gray-500 mt-2">
            Fill in your details to get started
          </p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-4">
            {/* Full Name */}
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700">
                Full Name
              </label>

              <input
                type="text"
        name="name"
        placeholder="Full Name"
        value={formData.name}
        onChange={handleChange}
        className="w-full border p-3 rounded-lg"
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            {/* Email */}
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700">
                Email Address
              </label>

              <input
  type="email"
  name="email"
  placeholder="Enter your email"
  value={formData.email}
  onChange={handleChange}
  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
/>
            </div>

           

            {/* Password */}
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700">
                Password
              </label>

              <input
                 type="password"
        name="password"
        placeholder="Password"
        value={formData.password}
        onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            

            
            {/* Register Button */}
            <button
              type="submit"
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-lg font-semibold transition"
            >
              Create Account
            </button>
          </form>

      

         

          {/* Login Link */}
          <p className="text-center text-gray-600 mt-6">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-indigo-600 font-semibold hover:text-indigo-800"
            >
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;