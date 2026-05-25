import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";

export default function Register() {

  const navigate = useNavigate();

  const { login } = useAuth();

  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
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

      const { data } = await api.post(
        "/admin/register",
        formData
      );

      const token = data?.token;

      const adminData =
        data?.admin ?? {
          _id: data?._id ?? data?.id,
          name: data?.name,
          email: data?.email,
          role: data?.role,
        };

      // SAVE TOKEN (if present)
      if (token) {
        localStorage.setItem("adminToken", token);
      }

      // SAVE ADMIN
      if (adminData) {
        localStorage.setItem(
          "admin",
          JSON.stringify(adminData)
        );
      }

      // CONTEXT LOGIN
      login(adminData);

      alert("Admin Registered Successfully");

      // REDIRECT: only go to admin dashboard if we have a token
      if (token) {
        navigate("/admin");
      } else {
        // no token -> ask user to login
        navigate("/login");
      }

    } catch (error) {

      console.log(error);

      alert(
        error.response?.data?.message ||
        "Registration Failed"
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

        {/* NAME */}
        <input
          type="text"
          name="name"
          placeholder="Enter Name"
          value={formData.name}
          onChange={handleChange}
          className="w-full border p-3 mb-4 rounded-lg outline-none focus:ring-2 focus:ring-black"
          required
        />

        {/* EMAIL */}
        <input
          type="email"
          name="email"
          placeholder="Enter Email"
          value={formData.email}
          onChange={handleChange}
          className="w-full border p-3 mb-4 rounded-lg outline-none focus:ring-2 focus:ring-black"
          required
        />

        {/* PASSWORD */}
        <input
          type="password"
          name="password"
          placeholder="Enter Password"
          value={formData.password}
          onChange={handleChange}
          className="w-full border p-3 mb-4 rounded-lg outline-none focus:ring-2 focus:ring-black"
          required
        />

        {/* REGISTER BUTTON */}
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

        {/* LOGIN OPTION */}
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
          Login Here
        </button>

      </form>

    </div>
  );
}