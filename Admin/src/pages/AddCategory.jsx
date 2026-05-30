import React, { useState } from "react";
import { Menu, X } from "lucide-react";

import api from "../services/api";

import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

const AddCategory = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [formData, setFormData] = useState({
    text: "",
    path: "",
    bgColor: "#FEF6DA",
  });

  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!image) {
      return alert("Please select an image");
    }

    try {
      setLoading(true);

      const categoryData = new FormData();

      categoryData.append("text", formData.text);
      categoryData.append("path", formData.path);
      categoryData.append("bgColor", formData.bgColor);
      categoryData.append("image", image);

      const { data } = await api.post(
        "/categories/create",
        categoryData
      );

      alert(data.message);

      setFormData({
        text: "",
        path: "",
        bgColor: "#FEF6DA",
      });

      setImage(null);
      setPreview("");

      e.target.reset();
    } catch (error) {
      console.log("CATEGORY ERROR:", error);

      alert(
        error?.response?.data?.message ||
          "Failed To Add Category"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100 overflow-hidden">

      {/* MOBILE OVERLAY */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* SIDEBAR */}
      <div
        className={`
          fixed lg:static z-50 h-full
          transition-transform duration-300
          ${
            sidebarOpen
              ? "translate-x-0"
              : "-translate-x-full lg:translate-x-0"
          }
        `}
      >
        <Sidebar />
      </div>

      {/* MAIN CONTENT */}
      <div className="flex-1 flex flex-col overflow-hidden">

        {/* NAVBAR */}
        <div className="sticky top-0 z-30 bg-white shadow-sm">

          <div className="flex items-center">

            <button
              onClick={() =>
                setSidebarOpen(!sidebarOpen)
              }
              className="lg:hidden p-4"
            >
              {sidebarOpen ? (
                <X size={28} />
              ) : (
                <Menu size={28} />
              )}
            </button>

            <div className="flex-1">
              <Navbar />
            </div>

          </div>

        </div>

        {/* PAGE CONTENT */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6">

          <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-lg p-5 md:p-8">

            <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-8">
              Add Category
            </h1>

            <form
              onSubmit={handleSubmit}
              className="space-y-6"
            >

              {/* CATEGORY NAME */}
              <div>

                <label className="block mb-2 font-semibold text-gray-700">
                  Category Name
                </label>

                <input
                  type="text"
                  name="text"
                  value={formData.text}
                  onChange={handleChange}
                  placeholder="Organic Veggies"
                  className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-green-500"
                  required
                />

              </div>

              {/* CATEGORY PATH */}
              <div>

                <label className="block mb-2 font-semibold text-gray-700">
                  Category Path
                </label>

                <input
                  type="text"
                  name="path"
                  value={formData.path}
                  onChange={handleChange}
                  placeholder="vegetables"
                  className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-green-500"
                  required
                />

              </div>

              {/* IMAGE */}
              <div>

                <label className="block mb-2 font-semibold text-gray-700">
                  Category Image
                </label>

                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="w-full border border-gray-300 rounded-lg p-3"
                  required
                />

                {preview && (
                  <div className="mt-4">

                    <img
                      src={preview}
                      alt="Preview"
                      className="w-full max-w-[250px] h-48 object-cover rounded-lg border shadow"
                    />

                  </div>
                )}

              </div>

              {/* BACKGROUND COLOR */}
              <div>

                <label className="block mb-2 font-semibold text-gray-700">
                  Background Color
                </label>

                <input
                  type="color"
                  name="bgColor"
                  value={formData.bgColor}
                  onChange={handleChange}
                  className="w-full h-12 border border-gray-300 rounded-lg cursor-pointer"
                />

              </div>

              {/* PREVIEW CARD */}
              <div className="border rounded-xl p-4 bg-gray-50">

                <h3 className="font-semibold mb-3 text-gray-700">
                  Category Preview
                </h3>

                <div
                  className="rounded-xl p-4 flex items-center gap-4"
                  style={{
                    backgroundColor:
                      formData.bgColor,
                  }}
                >

                  {preview && (
                    <img
                      src={preview}
                      alt="Category"
                      className="w-16 h-16 md:w-20 md:h-20 object-cover rounded-lg"
                    />
                  )}

                  <div>

                    <h4 className="font-bold text-lg">
                      {formData.text ||
                        "Category Name"}
                    </h4>

                    <p className="text-sm text-gray-600">
                      {formData.path ||
                        "category-path"}
                    </p>

                  </div>

                </div>

              </div>

              {/* SUBMIT BUTTON */}
              <button
                type="submit"
                disabled={loading}
                className="w-full md:w-auto bg-black hover:bg-gray-800 text-white px-8 py-3 rounded-lg font-semibold transition disabled:opacity-50"
              >
                {loading
                  ? "Uploading..."
                  : "Add Category"}
              </button>

            </form>

          </div>

        </div>

      </div>

    </div>
  );
};

export default AddCategory;