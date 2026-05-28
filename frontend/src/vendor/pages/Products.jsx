import React, {
  useEffect,
  useState,
} from "react";

import {
  useNavigate,
} from "react-router-dom";

import axios from "axios";

import {
  FaBars,
  FaTimes,
} from "react-icons/fa";

import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import { Menu, X } from "lucide-react";

export default function Products() {

  const [products, setProducts] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [sidebarOpen, setSidebarOpen] =
    useState(false);

  const navigate =
    useNavigate();

  // =========================
  // FETCH PRODUCTS
  // =========================
  const fetchProducts =
    async () => {

      try {

        setLoading(true);

        const token =
          localStorage.getItem(
            "vendorToken"
          );

        const { data } =
          await axios.get(
            "http://localhost:5000/api/products/vendor",
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

        setProducts(
          data.products || []
        );

      } catch (error) {

        console.log(
          "FETCH PRODUCT ERROR:",
          error
        );

        alert(
          error.response?.data
            ?.message ||
            "Failed to load products"
        );

      } finally {

        setLoading(false);
      }
    };

  // =========================
  // DELETE PRODUCT
  // =========================
  const deleteProduct =
    async (id) => {

      const confirmDelete =
        window.confirm(
          "Are you sure you want to delete this product?"
        );

      if (!confirmDelete)
        return;

      try {

        const token =
          localStorage.getItem(
            "vendorToken"
          );

        await axios.delete(
          `http://localhost:5000/api/products/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        alert(
          "Product deleted successfully"
        );

        fetchProducts();

      } catch (error) {

        console.log(
          "DELETE ERROR:",
          error
        );

        alert(
          error.response?.data
            ?.message ||
            "Delete failed"
        );
      }
    };

  useEffect(() => {

    fetchProducts();

  }, []);

  return (

    <div className="flex min-h-screen bg-gray-100 overflow-hidden">

      {/* ========================= */}
      {/* MOBILE SIDEBAR OVERLAY */}
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
        {/* TOPBAR */}
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
        <div className="p-4 md:p-6 overflow-x-hidden">

          {/* HEADER */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">

            <h1 className="text-2xl md:text-3xl font-bold">
              My Products
            </h1>

            <button
              onClick={() =>
                navigate(
                  "/vendor/products/create"
                )
              }
              className="bg-green-600 hover:bg-green-700 text-white px-5 py-3 rounded-lg font-semibold shadow w-full sm:w-auto"
            >
              + Add Product
            </button>

          </div>

          {/* LOADING */}
          {loading ? (

            <div className="text-center text-xl font-semibold py-20">
              Loading...
            </div>

          ) : products.length === 0 ? (

            <div className="bg-white p-10 rounded-xl shadow text-center text-gray-500">
              No products found
            </div>

          ) : (

            <>
              {/* ========================= */}
              {/* DESKTOP TABLE */}
              {/* ========================= */}
              <div className="hidden xl:block overflow-x-auto bg-white rounded-2xl shadow">

                <table className="w-full min-w-[1100px]">

                  <thead className="bg-black text-white">

                    <tr>

                      <th className="p-4 text-left">
                        Image
                      </th>

                      <th className="p-4 text-left">
                        Product
                      </th>

                      <th className="p-4 text-left">
                        Category
                      </th>

                      <th className="p-4 text-left">
                        Price
                      </th>

                      <th className="p-4 text-left">
                        Offer Price
                      </th>

                      <th className="p-4 text-left">
                        Stock
                      </th>

                      <th className="p-4 text-left">
                        Variants
                      </th>

                      <th className="p-4 text-left">
                        Actions
                      </th>

                    </tr>

                  </thead>

                  <tbody>

                    {products.map(
                      (product) => {

                        const categoryName =
                          product.category?.text ||
                          product.category?.name ||
                          product.category ||
                          "No Category";

                        const firstVariant =
                          product.variants?.[0];

                        const totalStock =
                          product.variants?.reduce(
                            (
                              total,
                              variant
                            ) => {

                              return (
                                total +
                                (
                                  parseInt(
                                    variant.stockQuantity
                                  ) || 0
                                )
                              );
                            },
                            0
                          ) || 0;

                        return (

                          <tr
                            key={product._id}
                            className="border-b hover:bg-gray-50"
                          >

                            {/* IMAGE */}
                            <td className="p-4">

                              <img
                                src={
                                  product.image?.[0]
                                }
                                alt={
                                  product.name
                                }
                                className="w-16 h-16 object-cover rounded-lg border"
                              />

                            </td>

                            {/* NAME */}
                            <td className="p-4 font-semibold">
                              {product.name}
                            </td>

                            {/* CATEGORY */}
                            <td className="p-4">
                              {categoryName}
                            </td>

                            {/* PRICE */}
                            <td className="p-4">
                              ₹
                              {firstVariant?.price || 0}
                            </td>

                            {/* OFFER PRICE */}
                            <td className="p-4 text-green-600 font-bold">
                              ₹
                              {firstVariant?.offerPrice || 0}
                            </td>

                            {/* STOCK */}
                            <td className="p-4 font-semibold">
                              {totalStock}
                            </td>

                            {/* VARIANTS */}
                            <td className="p-4">

                              <div className="flex flex-wrap gap-2">

                                {product.variants?.map(
                                  (
                                    variant,
                                    index
                                  ) => (

                                    <span
                                      key={index}
                                      className="bg-gray-200 px-3 py-1 rounded-full text-sm"
                                    >
                                      {
                                        variant.size
                                      }
                                    </span>

                                  )
                                )}

                              </div>

                            </td>

                            {/* ACTIONS */}
                            <td className="p-4">

                              <div className="flex gap-3">

                                <button
                                  onClick={() =>
                                    navigate(
                                      `/vendor/products/edit/${product._id}`
                                    )
                                  }
                                  className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg"
                                >
                                  Edit
                                </button>

                                <button
                                  onClick={() =>
                                    deleteProduct(
                                      product._id
                                    )
                                  }
                                  className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg"
                                >
                                  Delete
                                </button>

                              </div>

                            </td>

                          </tr>
                        );
                      }
                    )}

                  </tbody>

                </table>

              </div>

              {/* ========================= */}
              {/* MOBILE + TABLET CARDS */}
              {/* ========================= */}
              <div className="grid grid-cols-1 md:grid-cols-2 xl:hidden gap-5">

                {products.map(
                  (product) => {

                    const categoryName =
                      product.category?.text ||
                      product.category?.name ||
                      product.category ||
                      "No Category";

                    const firstVariant =
                      product.variants?.[0];

                    const totalStock =
                      product.variants?.reduce(
                        (
                          total,
                          variant
                        ) => {

                          return (
                            total +
                            (
                              parseInt(
                                variant.stockQuantity
                              ) || 0
                            )
                          );
                        },
                        0
                      ) || 0;

                    return (

                      <div
                        key={product._id}
                        className="bg-white rounded-2xl shadow-md p-4 hover:shadow-lg transition"
                      >

                        {/* PRODUCT TOP */}
                        <div className="flex gap-4">

                          <img
                            src={
                              product.image?.[0]
                            }
                            alt={
                              product.name
                            }
                            className="w-24 h-24 md:w-28 md:h-28 object-cover rounded-xl border"
                          />

                          <div className="flex-1 min-w-0">

                            <h2 className="font-bold text-lg truncate">
                              {product.name}
                            </h2>

                            <p className="text-gray-500 text-sm mt-1">
                              {categoryName}
                            </p>

                            <div className="mt-3 space-y-1">

                              <p className="text-sm">
                                Price:
                                <span className="font-semibold ml-1">
                                  ₹
                                  {firstVariant?.price || 0}
                                </span>
                              </p>

                              <p className="text-sm text-green-600 font-bold">
                                Offer:
                                <span className="ml-1">
                                  ₹
                                  {firstVariant?.offerPrice || 0}
                                </span>
                              </p>

                              <p className="text-sm">
                                Stock:
                                <span className="font-semibold ml-1">
                                  {totalStock}
                                </span>
                              </p>

                            </div>

                          </div>

                        </div>

                        {/* VARIANTS */}
                        <div className="flex flex-wrap gap-2 mt-4">

                          {product.variants?.map(
                            (
                              variant,
                              index
                            ) => (

                              <span
                                key={index}
                                className="bg-gray-200 px-3 py-1 rounded-full text-xs"
                              >
                                {variant.size}
                              </span>

                            )
                          )}

                        </div>

                        {/* BUTTONS */}
                        <div className="flex flex-col sm:flex-row gap-3 mt-5">

                          <button
                            onClick={() =>
                              navigate(
                                `/vendor/products/edit/${product._id}`
                              )
                            }
                            className="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-lg"
                          >
                            Edit
                          </button>

                          <button
                            onClick={() =>
                              deleteProduct(
                                product._id
                              )
                            }
                            className="flex-1 bg-red-500 hover:bg-red-600 text-white py-2 rounded-lg"
                          >
                            Delete
                          </button>

                        </div>

                      </div>
                    );
                  }
                )}

              </div>
            </>
          )}

        </div>

      </div>

    </div>
  );
}