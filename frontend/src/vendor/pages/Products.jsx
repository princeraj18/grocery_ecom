import React, {
  useEffect,
  useState,
} from "react";

import axios from "axios";

import Sidebar from "../components/Sidebar";

import Navbar from "../components/Navbar";

export default function Products() {

  const [products, setProducts] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  // =========================
  // FETCH VENDOR PRODUCTS
  // =========================
  const fetchProducts =
    async () => {

      try {

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
          data.products
        );

      } catch (error) {

        console.log(error);

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

        console.log(error);

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

          </div>

          {/* LOADING */}
          {loading ? (

            <div className="text-center text-xl font-semibold">
              Loading...
            </div>

          ) : products.length === 0 ? (

            <div className="bg-white p-10 rounded-xl shadow text-center text-gray-500">
              No products found
            </div>

          ) : (

            <div className="overflow-x-auto bg-white rounded-xl shadow">

              <table className="w-full">

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
                      Actions
                    </th>

                  </tr>

                </thead>

                <tbody>

                  {products.map(
                    (product) => (

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
                            className="w-16 h-16 object-cover rounded-lg"
                          />

                        </td>

                        {/* NAME */}
                        <td className="p-4 font-semibold">
                          {product.name}
                        </td>

                        {/* CATEGORY */}
                        <td className="p-4">
                          {
                            product.category
                          }
                        </td>

                        {/* PRICE */}
                        <td className="p-4">
                          ₹
                          {
                            product.price
                          }
                        </td>

                        {/* OFFER PRICE */}
                        <td className="p-4 text-green-600 font-bold">
                          ₹
                          {
                            product.offerPrice
                          }
                        </td>

                        {/* STOCK */}
                        <td className="p-4">

                          {
                            product.stockQuantity
                          }

                        </td>

                        {/* ACTIONS */}
                        <td className="p-4">

                          <div className="flex gap-3">

                            {/* EDIT */}
                            <button
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
                    )
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