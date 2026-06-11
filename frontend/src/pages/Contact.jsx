// pages/Contact.jsx

import React, {
  useState,
} from "react";

import api from "../api/Axios";

const Contact = () => {
  const [formData, setFormData] =
    useState({
      name: "",
      email: "",
      subject: "",
      message: "",
    });

  const [loading, setLoading] =
    useState(false);

  const [success, setSuccess] =
    useState("");

  const [error, setError] =
    useState("");

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
  // HANDLE SUBMIT
  // =========================
 const handleSubmit = async (
  e
) => {

  e.preventDefault();

  try {

    setLoading(true);

    setSuccess("");

    setError("");

    const token =
      localStorage.getItem("token");

    const res = await api.post(
      "/contact",
      formData,
      {
        headers: {
          Authorization:
            `Bearer ${token}`,
        },
      }
    );

    setSuccess(
      res.data.message
    );

    setFormData({
      name: "",
      email: "",
      subject: "",
      message: "",
    });

  } catch (error) {

    console.log(error);

    setError(
      error.response?.data
        ?.message ||
        "Something went wrong"
    );

  } finally {

    setLoading(false);
  }
};

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900 py-16 px-6">

      <div className="max-w-6xl mx-auto">

        {/* Heading */}
        <div className="text-center mb-12">

          <h1 className="text-5xl font-bold text-gray-800 dark:text-slate-100">
            Contact Us
          </h1>

          <p className="mt-4 text-gray-600 dark:text-slate-400">
            We'd love to hear from you
          </p>

        </div>

        <div className="grid md:grid-cols-2 gap-10">

          {/* LEFT */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-lg p-10">

            <h2 className="text-3xl font-semibold mb-8">
              Get In Touch
            </h2>

            <div className="space-y-6">

              <div>
                <h3 className="font-semibold text-green-600">
                  Address
                </h3>

                <p className="text-gray-600 dark:text-slate-400">
                  Mumbai, India
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-green-600">
                  Email
                </h3>

                <p className="text-gray-600 dark:text-slate-400">
                  support@grocify.com
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-green-600">
                  Phone
                </h3>

                <p className="text-gray-600 dark:text-slate-400">
                  +91 9876543210
                </p>
              </div>

            </div>

          </div>

          {/* RIGHT */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-lg p-10">

            {/* Success */}
            {success && (
              <div className="mb-5 bg-green-100 text-green-700 p-4 rounded-lg">
                {success}
              </div>
            )}

            {/* Error */}
            {error && (
              <div className="mb-5 bg-red-100 text-red-700 p-4 rounded-lg">
                {error}
              </div>
            )}

            <form
              onSubmit={
                handleSubmit
              }
              className="space-y-5"
            >

              <input
                type="text"
                name="name"
                placeholder="Full Name"
                value={
                  formData.name
                }
                onChange={
                  handleChange
                }
                className="w-full border rounded-xl px-4 py-3"
                required
              />

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
                className="w-full border rounded-xl px-4 py-3"
                required
              />

              <input
                type="text"
                name="subject"
                placeholder="Subject"
                value={
                  formData.subject
                }
                onChange={
                  handleChange
                }
                className="w-full border rounded-xl px-4 py-3"
                required
              />

              <textarea
                rows="5"
                name="message"
                placeholder="Write your message..."
                value={
                  formData.message
                }
                onChange={
                  handleChange
                }
                className="w-full border rounded-xl px-4 py-3"
                required
              />

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-xl"
              >
                {loading
                  ? "Sending..."
                  : "Send Message"}
              </button>

            </form>

          </div>

        </div>

      </div>

    </div>
  );
};

export default Contact;