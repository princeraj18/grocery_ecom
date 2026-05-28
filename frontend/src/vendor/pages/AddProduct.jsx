import React, {
  useState,
  useEffect,
} from "react";

import axios from "axios";

import {
  FaBars,
  FaTimes,
} from "react-icons/fa";

import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import { Menu, X } from "lucide-react";

export default function AddProduct() {

  // =========================
  // SIDEBAR STATE
  // =========================
  const [sidebarOpen, setSidebarOpen] =
    useState(false);

  // =========================
  // FORM DATA
  // =========================
  const [formData, setFormData] =
    useState({
      name: "",
      description: "",
      category: "",
    });

  // =========================
  // IMAGES
  // =========================
  const [images, setImages] =
    useState([]);

  // =========================
  // CATEGORIES
  // =========================
  const [categories, setCategories] =
    useState([]);

  const [
    loadingCategories,
    setLoadingCategories,
  ] = useState(true);

  // =========================
  // VARIANTS
  // =========================
  const [variants, setVariants] =
    useState([
      {
        size: "",
        price: "",
        offerPrice: "",
        stockQuantity: "",
      },
    ]);

  // =========================
  // FETCH CATEGORIES
  // =========================
  useEffect(() => {

    const fetchCategories =
      async () => {

        try {

          setLoadingCategories(true);

          const res =
            await axios.get(
              "http://localhost:5000/api/categories"
            );

          setCategories(
            res.data.categories || []
          );

        } catch (error) {

          console.log(
            "CATEGORY FETCH ERROR:",
            error
          );

        } finally {

          setLoadingCategories(false);
        }
      };

    fetchCategories();

  }, []);

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
  // HANDLE IMAGE CHANGE
  // =========================
  const handleImages = (e) => {

    setImages(
      Array.from(e.target.files)
    );
  };

  // =========================
  // HANDLE VARIANT CHANGE
  // =========================
  const handleVariantChange = (
    index,
    field,
    value
  ) => {

    const updated = [...variants];

    updated[index][field] =
      field === "price" ||
      field === "offerPrice" ||
      field === "stockQuantity"
        ? Number(value)
        : value;

    setVariants(updated);
  };

  // =========================
  // ADD VARIANT
  // =========================
  const addVariant = () => {

    setVariants([
      ...variants,
      {
        size: "",
        price: "",
        offerPrice: "",
        stockQuantity: "",
      },
    ]);
  };

  // =========================
  // REMOVE VARIANT
  // =========================
  const removeVariant = (
    index
  ) => {

    if (variants.length === 1)
      return;

    setVariants(
      variants.filter(
        (_, i) => i !== index
      )
    );
  };

  // =========================
  // SUBMIT PRODUCT
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

      // BASIC INFO
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

      // VARIANTS
      data.append(
        "variants",
        JSON.stringify(variants)
      );

      // IMAGES
      images.forEach((image) => {

        data.append(
          "images",
          image
        );
      });

      // API CALL
      const res =
        await axios.post(
          "http://localhost:5000/api/products",
          data,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type":
                "multipart/form-data",
            },
          }
        );

      console.log(
        "PRODUCT ADDED:",
        res.data
      );

      alert(
        "Product Added Successfully"
      );

      // RESET FORM
      setFormData({
        name: "",
        description: "",
        category: "",
      });

      setVariants([
        {
          size: "",
          price: "",
          offerPrice: "",
          stockQuantity: "",
        },
      ]);

      setImages([]);

      document.getElementById(
        "product-images"
      ).value = "";

    } catch (error) {

      console.log(
        "ADD PRODUCT ERROR:",
        error
      );

      alert(
        error.response?.data
          ?.message ||
          "Error adding product"
      );
    }
  };

  return (

    <div className="flex min-h-screen bg-gray-100 overflow-hidden">

      {/* ========================= */}
      {/* MOBILE OVERLAY */}
      {/* ========================= */}
      {sidebarOpen && (

        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() =>
            setSidebarOpen(false)
          }
        />

      )}

      {/* ========================= */}
      {/* SIDEBAR */}
      {/* ========================= */}
      <div
        className={`
          fixed lg:static top-0 left-0 z-50
          h-full transition-transform duration-300
          ${
            sidebarOpen
              ? "translate-x-0"
              : "-translate-x-full lg:translate-x-0"
          }
        `}
      >
        <Sidebar />
      </div>

      {/* ========================= */}
      {/* MAIN CONTENT */}
      {/* ========================= */}
      <div className="flex-1 flex flex-col min-w-0">

        {/* ========================= */}
        {/* MOBILE HEADER */}
        {/* ========================= */}
        <div className="sticky top-0 z-30 bg-white shadow-sm">

          <div className="flex items-center">

            {/* MOBILE MENU */}
            <button
              onClick={() =>
                setSidebarOpen(
                  !sidebarOpen
                )
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

        {/* ========================= */}
        {/* PAGE CONTENT */}
        {/* ========================= */}
        <div className="p-3 sm:p-5 md:p-6 overflow-y-auto">

          <div className="bg-white rounded-2xl shadow-lg p-4 sm:p-6 md:p-8 max-w-6xl mx-auto">

            <h1 className="text-2xl md:text-3xl font-bold mb-8 text-gray-800 hidden lg:block">
              Add Product
            </h1>

            <form
              onSubmit={handleSubmit}
              className="space-y-6"
            >

              {/* PRODUCT NAME */}
              <div>

                <label className="block mb-2 font-semibold text-sm md:text-base">
                  Product Name
                </label>

                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter Product Name"
                  className="border p-3 rounded-lg w-full text-sm md:text-base"
                  required
                />

              </div>

              {/* DESCRIPTION */}
              <div>

                <label className="block mb-2 font-semibold text-sm md:text-base">
                  Description
                </label>

                <textarea
                  name="description"
                  value={
                    formData.description
                  }
                  onChange={handleChange}
                  rows="4"
                  placeholder="Enter Product Description"
                  className="border p-3 rounded-lg w-full text-sm md:text-base"
                  required
                />

              </div>

              {/* CATEGORY */}
              <div>

                <label className="block mb-2 font-semibold text-sm md:text-base">
                  Category
                </label>

                <select
                  name="category"
                  value={
                    formData.category
                  }
                  onChange={handleChange}
                  className="border p-3 rounded-lg w-full text-sm md:text-base"
                  required
                >

                  <option value="">
                    {loadingCategories
                      ? "Loading Categories..."
                      : "Select Category"}
                  </option>

                  {categories.map(
                    (cat) => (

                      <option
                        key={cat._id}
                        value={cat._id}
                      >
                        {cat.text}
                      </option>
                    )
                  )}

                </select>

              </div>

              {/* VARIANTS */}
              <div>

                <label className="block mb-3 font-semibold text-sm md:text-base">
                  Product Variants
                </label>

                {variants.map(
                  (
                    variant,
                    index
                  ) => (

                    <div
                      key={index}
                      className="border rounded-xl p-4 mb-4 bg-gray-50"
                    >

                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">

                        {/* SIZE */}
                        <select
                          value={variant.size}
                          onChange={(e) =>
                            handleVariantChange(
                              index,
                              "size",
                              e.target.value
                            )
                          }
                          className="border p-3 rounded text-sm md:text-base"
                          required
                        >

                          <option value="">
                            Select Size
                          </option>

                          <option value="1pc">
                            1 pc
                          </option>

                          <option value="2pc">
                            2 pcs
                          </option>

                          <option value="3pc">
                            3 pcs
                          </option>

                          <option value="100ml">
                            100 ml
                          </option>

                          <option value="250ml">
                            250 ml
                          </option>

                          <option value="500ml">
                            500 ml
                          </option>

                          <option value="1L">
                            1 L
                          </option>

                          <option value="2L">
                            2 L
                          </option>

                          <option value="250g">
                            250 g
                          </option>

                          <option value="500g">
                            500 g
                          </option>

                          <option value="1kg">
                            1 Kg
                          </option>

                          <option value="2kg">
                            2 Kg
                          </option>

                          <option value="5kg">
                            5 Kg
                          </option>

                        </select>

                        {/* PRICE */}
                        <input
                          type="number"
                          placeholder="Price"
                          value={variant.price}
                          onChange={(e) =>
                            handleVariantChange(
                              index,
                              "price",
                              e.target.value
                            )
                          }
                          className="border p-3 rounded text-sm md:text-base"
                          required
                        />

                        {/* OFFER PRICE */}
                        <input
                          type="number"
                          placeholder="Offer Price"
                          value={
                            variant.offerPrice
                          }
                          onChange={(e) =>
                            handleVariantChange(
                              index,
                              "offerPrice",
                              e.target.value
                            )
                          }
                          className="border p-3 rounded text-sm md:text-base"
                          required
                        />

                        {/* STOCK */}
                        <input
                          type="number"
                          placeholder="Stock"
                          value={
                            variant.stockQuantity
                          }
                          onChange={(e) =>
                            handleVariantChange(
                              index,
                              "stockQuantity",
                              e.target.value
                            )
                          }
                          className="border p-3 rounded text-sm md:text-base"
                          required
                        />

                        {/* REMOVE */}
                        <button
                          type="button"
                          onClick={() =>
                            removeVariant(index)
                          }
                          className="bg-red-500 hover:bg-red-600 text-white rounded px-4 py-3 text-sm md:text-base"
                        >
                          Remove
                        </button>

                      </div>

                    </div>
                  )
                )}

                {/* ADD VARIANT */}
                <button
                  type="button"
                  onClick={addVariant}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm md:text-base"
                >
                  + Add Variant
                </button>

              </div>

              {/* IMAGES */}
              <div>

                <label className="block mb-2 font-semibold text-sm md:text-base">
                  Upload Images
                </label>

                <input
                  id="product-images"
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImages}
                  className="border p-3 rounded-lg w-full text-sm"
                  required
                />

              </div>

              {/* IMAGE PREVIEW */}
              {images.length > 0 && (

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">

                  {images.map(
                    (
                      img,
                      index
                    ) => (

                      <img
                        key={index}
                        src={URL.createObjectURL(img)}
                        alt="preview"
                        className="h-24 sm:h-28 md:h-32 w-full object-cover rounded-lg border"
                      />
                    )
                  )}

                </div>
              )}

              {/* SUBMIT */}
              <button
                type="submit"
                className="w-full sm:w-auto bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-lg font-semibold text-sm md:text-base"
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