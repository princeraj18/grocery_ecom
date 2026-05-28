import React, {
  useState,
  useContext,
} from "react";

import {
  Link,
  useNavigate,
} from "react-router-dom";

import api from "../api/Axios";

import { ShopContext }
  from "../context/ShopContext";

const Login = () => {

  const navigate =
    useNavigate();

  const { loginUser } =
    useContext(ShopContext);

  const [formData, setFormData] =
    useState({
      email: "",
      password: "",
    });

  const [errorMessage,
    setErrorMessage] =
    useState("");

  const [successMessage,
    setSuccessMessage] =
    useState("");

  // =========================
  // HANDLE INPUT CHANGE
  // =========================
  const handleChange = (e) => {

    setFormData((prev) => ({
      ...prev,
      [e.target.name]:
        e.target.value,
    }));
  };

  // =========================
  // HANDLE LOGIN
  // =========================
  const handleSubmit =
    async (e) => {

      e.preventDefault();

      setErrorMessage("");
      setSuccessMessage("");

      try {

        const res =
          await api.post(
            "/users/login",
            {
              email:
                formData.email,
              password:
                formData.password,
            }
          );

        console.log(res.data);

        // SAVE USER IN CONTEXT
        loginUser(res.data);

        // SAVE USER IN LOCALSTORAGE
        localStorage.setItem(
          "user",
          JSON.stringify(
            res.data
          )
        );

        // SAVE TOKEN
        localStorage.setItem(
          "token",
          res.data.token
        );

        setSuccessMessage(
          "Login Successful!"
        );

        setTimeout(() => {

          navigate("/");

        }, 1000);

      } catch (error) {

        console.log(error);

        if (
          error.response
        ) {

          setErrorMessage(
            error.response
              .data.message
          );

        } else {

          setErrorMessage(
            "Something went wrong"
          );
        }
      }
    };

  return (

    <div className="min-h-screen flex">

      {/* LEFT SECTION */}
      <div className="hidden lg:flex w-1/2 bg-gradient-to-r from-indigo-600 to-purple-700 items-center justify-center p-12">

        <div className="text-white max-w-md">

          <h1 className="text-5xl font-bold leading-tight">
            Welcome Back!
          </h1>

          <p className="mt-6 text-lg text-indigo-100">
            Sign in to access your orders,
            wishlist, and exclusive deals.
          </p>

          <img
            src="https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800"
            alt="shopping"
            className="mt-10 rounded-2xl shadow-2xl"
          />

        </div>

      </div>

      {/* RIGHT SECTION */}
      <div className="w-full lg:w-1/2 flex items-center justify-center bg-gray-50 px-6">

        <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-lg relative">

        

          {/* HEADING */}
          <h2 className="text-3xl font-bold text-center text-gray-800">
            Login
          </h2>

          <p className="text-center text-gray-500 mt-2">
            Enter your credentials
            to continue
          </p>

          {/* FORM */}
          <form
            onSubmit={
              handleSubmit
            }
            className="mt-8 space-y-5"
          >

            {/* EMAIL */}
            <div>

              <label className="block mb-2 text-sm font-medium text-gray-700">
                Email Address
              </label>

              <input
                type="email"
                name="email"
                placeholder="Email Address"
                value={
                  formData.email
                }
                onChange={
                  handleChange
                }
                required
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />

            </div>

            {/* PASSWORD */}
            <div>

              <label className="block mb-2 text-sm font-medium text-gray-700">
                Password
              </label>

              <input
                type="password"
                name="password"
                placeholder="Password"
                value={
                  formData.password
                }
                onChange={
                  handleChange
                }
                required
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />

            </div>

            {/* FORGOT PASSWORD */}
            <div className="flex justify-end">
  <Link
    to="/forgot-password"
    className="text-sm text-indigo-600 hover:text-indigo-800 font-medium"
  >
    Forgot Password?
  </Link>
</div>

            {/* LOGIN BUTTON */}
            <button
              type="submit"
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-lg font-semibold transition"
            >
              Login
            </button>

          </form>

          {/* ERROR MESSAGE */}
          {errorMessage && (

            <div className="mt-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg">

              {errorMessage}

            </div>
          )}

          {/* SUCCESS MESSAGE */}
          {successMessage && (

            <div className="mt-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg">

              {successMessage}

            </div>
          )}

          {/* REGISTER LINK */}
          <p className="text-center text-gray-600 mt-6">

            Don't have an account?{" "}

            <Link
              to="/register"
              className="text-indigo-600 font-semibold hover:text-indigo-800"
            >
              Register
            </Link>

          </p>

  
        </div>
{/* VENDOR LOGIN BUTTON */}
          <Link
            to="/vendor/login"
            className="absolute  top-5 sm:right-10 bg-orange-500 hover:bg-orange-600 text-white text-sm px-4 py-2 rounded-lg transition"
          >
            Vendor Login
          </Link>
      </div>

    </div>
  );
};

export default Login;