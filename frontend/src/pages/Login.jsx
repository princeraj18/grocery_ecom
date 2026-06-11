import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/Axios";
import { ShopContext } from "../context/ShopContext";
import ThemeToggle from "../components/ThemeToggle";

const Login = () => {
  const navigate = useNavigate();
  const { loginUser } = useContext(ShopContext);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  // =========================
  // HANDLE INPUT CHANGE
  // =========================
  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  // =========================
  // HANDLE LOGIN
  // =========================
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    try {
      const res = await api.post("/users/login", {
        email: formData.email,
        password: formData.password,
      });

      console.log(res.data);

      // SAVE USER IN CONTEXT
      loginUser(res.data);

      // SAVE USER IN LOCALSTORAGE
      localStorage.setItem("user", JSON.stringify(res.data));

      // SAVE TOKEN
      localStorage.setItem("token", res.data.token);

      setSuccessMessage("Login Successful!");

      setTimeout(() => {
        navigate("/");
      }, 1000);
    } catch (error) {
      console.log(error);
      if (error.response) {
        setErrorMessage(error.response.data.message);
      } else {
        setErrorMessage("Something went wrong");
      }
    }
  };

  return (
    <div className="min-h-screen flex relative bg-gray-50 dark:bg-slate-950">
      
      {/* RESPONSIVE TOP ACTIONS HEADER */}
      <div className="absolute top-4 right-4 sm:right-6 flex items-center gap-3 z-20">
        <Link
          to="/vendor/login"
          className="bg-orange-500 hover:bg-orange-600 text-white text-xs sm:text-sm font-semibold px-3.5 py-2 rounded-xl shadow-sm transition-all active:scale-[0.98]"
        >
          Vendor Login
        </Link>
        <div className="bg-white dark:bg-slate-900 p-1.5 rounded-xl shadow-sm border border-gray-200/60 dark:border-slate-800/80 flex items-center justify-center">
          <ThemeToggle />
        </div>
      </div>

      {/* LEFT BRAND SECTION */}
      <div className="hidden lg:flex w-1/2 bg-gradient-to-r from-indigo-600 to-purple-700 items-center justify-center p-12">
        <div className="text-white max-w-md">
          <h1 className="text-5xl font-bold leading-tight">Welcome Back!</h1>
          <p className="mt-6 text-lg text-indigo-100">
            Sign in to access your orders, wishlist, and exclusive deals.
          </p>
          <img
            src="https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800"
            alt="shopping"
            className="mt-10 rounded-2xl shadow-2xl"
          />
        </div>
      </div>

      {/* RIGHT AUTH SECTION */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-4 sm:px-6 py-16 lg:py-0">
        <div className="w-full max-w-md bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-2xl shadow-xl border border-gray-100 dark:border-slate-800/40">
          
          {/* HEADING */}
          <h2 className="text-2xl sm:text-3xl font-black text-center text-gray-800 dark:text-slate-100 tracking-tight">
            Login
          </h2>
          <p className="text-center text-xs sm:text-sm text-gray-500 dark:text-slate-400 mt-1.5 font-medium">
            Enter your credentials to continue
          </p>

          {/* FORM */}
          <form onSubmit={handleSubmit} className="mt-8 space-y-5">
            {/* EMAIL */}
            <div>
              <label className="block mb-1.5 text-xs font-bold uppercase tracking-wider text-gray-600 dark:text-slate-400">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                placeholder="name@example.com"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full bg-white dark:bg-slate-950 border border-gray-200 dark:border-slate-800 rounded-xl px-4 py-3 text-sm text-gray-800 dark:text-slate-100 focus:outline-none focus:border-indigo-500 dark:focus:border-indigo-500 transition-colors placeholder:text-gray-300 dark:placeholder:text-slate-700"
              />
            </div>

            {/* PASSWORD */}
            <div>
              <label className="block mb-1.5 text-xs font-bold uppercase tracking-wider text-gray-600 dark:text-slate-400">
                Password
              </label>
              <input
                type="password"
                name="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                required
                className="w-full bg-white dark:bg-slate-950 border border-gray-200 dark:border-slate-800 rounded-xl px-4 py-3 text-sm text-gray-800 dark:text-slate-100 focus:outline-none focus:border-indigo-500 dark:focus:border-indigo-500 transition-colors placeholder:text-gray-300 dark:placeholder:text-slate-700"
              />
            </div>

            {/* FORGOT PASSWORD */}
            <div className="flex justify-end">
              <Link
                to="/forgot-password"
                className="text-xs sm:text-sm text-indigo-600 dark:text-indigo-400 hover:underline font-semibold"
              >
                Forgot Password?
              </Link>
            </div>

            {/* LOGIN BUTTON */}
            <button
              type="submit"
              className="w-full bg-indigo-600 hover:bg-indigo-700 active:scale-[0.99] text-white py-3 rounded-xl font-bold text-sm tracking-wide shadow-md shadow-indigo-600/10 transition-all"
            >
              Login
            </button>
          </form>

          {/* ERROR MESSAGE */}
          {errorMessage && (
            <div className="mt-4 bg-red-50 dark:bg-red-950/20 border border-red-100 dark:border-red-900/40 text-red-600 dark:text-red-400 px-4 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-1.5">
              <span>{errorMessage}</span>
            </div>
          )}

          {/* SUCCESS MESSAGE */}
          {successMessage && (
            <div className="mt-4 bg-green-50 dark:bg-green-950/20 border border-green-100 dark:border-green-900/40 text-green-600 dark:text-green-400 px-4 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-1.5">
              <span>{successMessage}</span>
            </div>
          )}

          {/* REGISTER LINK */}
          <p className="text-center text-xs sm:text-sm text-gray-500 dark:text-slate-400 mt-6 font-medium">
            Don't have an account?{" "}
            <Link
              to="/register"
              className="text-indigo-600 dark:text-indigo-400 font-bold hover:underline"
            >
              Register
            </Link>
          </p>

        </div>
      </div>

    </div>
  );
};

export default Login;