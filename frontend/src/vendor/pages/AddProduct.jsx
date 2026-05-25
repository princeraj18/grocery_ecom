import React, {
  useState,
} from "react";

import axios from "axios";

import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

export default function AddProduct() {

  const [formData, setFormData] =
    useState({
      name: "",
      description: "",
      category: "",
      price: "",
      offerPrice: "",
      stockQuantity: "",
    });

  const [images, setImages] =
    useState([]);

  // =========================
  // HANDLE INPUT CHANGE
  // =========================
  const handleChange = (e) => {

    setFormData({
      ...formData,
      [e.target.name]:
        e.target.value,
    });
  };

  // =========================
  // HANDLE IMAGE CHANGE
  // =========================
  const handleImages = (e) => {

    setImages(e.target.files);
  };

  // =========================
  // SUBMIT FORM
  // =========================
  const handleSubmit = async (
    e
  ) => {

    e.preventDefault();

    try {

      const token =
        localStorage.getItem(
          "vendorToken"
        );

      const data =
        new FormData();

      data.append(
        "name",
        formData.name
      );

      data.append(
        "description",
        formData.description
      );

      data.append(
        "category",
        formData.category
      );

      data.append(
        "price",
        formData.price
      );

      data.append(
        "offerPrice",
        formData.offerPrice
      );

      data.append(
        "stockQuantity",
        formData.stockQuantity
      );

      // APPEND IMAGES
      for (
        let i = 0;
        i < images.length;
        i++
      ) {

        data.append(
          "images",
          images[i]
        );
      }

      const res =
        await axios.post(
          "http://localhost:5000/api/products",
          data,
          {
            headers: {
              Authorization:
                `Bearer ${token}`,
              "Content-Type":
                "multipart/form-data",
            },
          }
        );

      alert(
        "Product Added Successfully"
      );

      console.log(res.data);

      // RESET FORM
      setFormData({
        name: "",
        description: "",
        category: "",
        price: "",
        offerPrice: "",
        stockQuantity: "",
      });

      setImages([]);

    } catch (error) {

      console.log(error);

      alert(
        error.response?.data
          ?.message ||
          "Error adding product"
      );
    }
  };

  return (

    <div className="flex min-h-screen bg-gray-100">

      {/* SIDEBAR */}
      <Sidebar />

      {/* MAIN CONTENT */}
      <div className="flex-1">

        {/* NAVBAR */}
        <Navbar />

        {/* PAGE CONTENT */}
        <div className="p-6">

          <div className="bg-white rounded-2xl shadow-lg p-8 max-w-4xl mx-auto">

            {/* TITLE */}
            <h1 className="text-3xl font-bold mb-8 text-gray-800">
              Add Product
            </h1>

            {/* FORM */}
            <form
              onSubmit={handleSubmit}
              className="space-y-6"
            >

              {/* PRODUCT NAME */}
              <div>

                <label className="block mb-2 font-semibold text-gray-700">
                  Product Name
                </label>

                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  placeholder="Enter product name"
                  onChange={handleChange}
                  className="border border-gray-300 p-3 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  required
                />

              </div>

              {/* DESCRIPTION */}
              <div>

                <label className="block mb-2 font-semibold text-gray-700">
                  Description
                </label>

                <textarea
                  name="description"
                  value={
                    formData.description
                  }
                  placeholder="Enter product description"
                  onChange={handleChange}
                  rows="4"
                  className="border border-gray-300 p-3 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  required
                />

              </div>

              {/* CATEGORY */}
              <div>

                <label className="block mb-2 font-semibold text-gray-700">
                  Category
                </label>

                <select
                  name="category"
                  value={
                    formData.category
                  }
                  onChange={handleChange}
                  className="border border-gray-300 p-3 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  required
                >

                  <option value="">
                    Select Category
                  </option>

                  <option value="Vegetables">
                    Vegetables
                  </option>

                  <option value="Fruits">
                    Fruits
                  </option>

                  <option value="Drinks">
                    Drinks
                  </option>

                  <option value="Instant">
                    Instant
                  </option>

                  <option value="Dairy">
                    Dairy
                  </option>

                  <option value="Bakery">
                    Bakery
                  </option>

                  <option value="Grains">
                    Grains
                  </option>

                </select>

              </div>

              {/* PRICE SECTION */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

                {/* PRICE */}
                <div>

                  <label className="block mb-2 font-semibold text-gray-700">
                    Price
                  </label>

                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    placeholder="Price"
                    onChange={handleChange}
                    className="border border-gray-300 p-3 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    required
                  />

                </div>

                {/* OFFER PRICE */}
                <div>

                  <label className="block mb-2 font-semibold text-gray-700">
                    Offer Price
                  </label>

                  <input
                    type="number"
                    name="offerPrice"
                    value={
                      formData.offerPrice
                    }
                    placeholder="Offer Price"
                    onChange={handleChange}
                    className="border border-gray-300 p-3 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    required
                  />

                </div>

                {/* STOCK */}
                <div>

                  <label className="block mb-2 font-semibold text-gray-700">
                    Stock Quantity
                  </label>

                  <input
                    type="number"
                    name="stockQuantity"
                    value={
                      formData.stockQuantity
                    }
                    placeholder="Stock Quantity"
                    onChange={handleChange}
                    className="border border-gray-300 p-3 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    required
                  />

                </div>

              </div>

              {/* IMAGES */}
              <div>

                <label className="block mb-2 font-semibold text-gray-700">
                  Upload Images
                </label>

                <input
                  type="file"
                  multiple
                  onChange={handleImages}
                  className="border border-gray-300 p-3 w-full rounded-lg"
                  required
                />

              </div>

              {/* BUTTON */}
              <button
                type="submit"
                className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-lg font-semibold transition duration-300"
              >
                Add Product
              </button>

            </form>

          </div>

        </div>

      </div>

    </div>
  );
}