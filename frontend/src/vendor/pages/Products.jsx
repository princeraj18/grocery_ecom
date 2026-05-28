import React, {
  useEffect,
  useState,
} from "react";

import { useNavigate } from "react-router-dom";

import axios from "axios";

import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

export default function Products() {

  const [products, setProducts] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const navigate = useNavigate();

  // =========================
  // FETCH VENDOR PRODUCTS
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

        console.log(
          "VENDOR PRODUCTS:",
          data.products
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

    <div className="flex min-h-screen bg-gray-100">

      {/* SIDEBAR */}
      <Sidebar />

      {/* MAIN */}
      <div className="flex-1">

        <Navbar />

        <div className="p-6">

          {/* HEADER */}
          <div className="flex items-center justify-between mb-6">

            <h1 className="text-3xl font-bold">
              My Products
            </h1>

            {/* ADD PRODUCT */}
            <button
              onClick={() =>
                navigate(
                  "/vendor/products/create"
                )
              }
              className="bg-green-600 hover:bg-green-700 text-white px-5 py-3 rounded-lg font-semibold shadow"
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

            <div className="overflow-x-auto bg-white rounded-xl shadow">

              <table className="w-full">

                {/* TABLE HEADER */}
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

                {/* TABLE BODY */}
                <tbody>

                  {products.map(
                    (product) => {

                      // =========================
                      // CATEGORY FIX
                      // =========================
                      const categoryName =
                        typeof product.category ===
                        "object"
                          ? product.category?.text
                          : product.category;

                      // =========================
                      // PRICE FIX
                      // =========================
                      const firstVariant =
                        product.variants?.[0];

                      // =========================
                      // STOCK FIX
                      // =========================
                    const totalStock =
  product.variants?.reduce(
    (total, variant) => {

      return (
        total +
        (parseInt(
          variant.stockQuantity
        ) || 0)
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

                            {categoryName ||
                              "No Category"}

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
                                    {variant.size}
                                  </span>

                                )
                              )}

                            </div>

                          </td>

                          {/* ACTIONS */}
                          <td className="p-4">

                            <div className="flex gap-3">

                              {/* EDIT */}
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

                              {/* DELETE */}
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
          )}

        </div>

      </div>

    </div>
  );
}