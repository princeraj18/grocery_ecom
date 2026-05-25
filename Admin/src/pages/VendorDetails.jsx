import { useEffect, useState } from "react";

import { useParams } from "react-router-dom";

import api from "../services/api";

export default function VendorDetails() {

  const { id } = useParams();

  const [vendor, setVendor] =
    useState(null);

  const [products, setProducts] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {

    const fetchVendorDetails =
      async () => {

        try {

          // =========================
          // GET VENDOR DETAILS
          // =========================
          const vendorRes =
            await api.get(
              `/admin/vendors/${id}`
            );

          setVendor(
            vendorRes.data.vendor
          );

          // =========================
          // GET ALL PRODUCTS
          // =========================
          const productRes =
            await api.get(
              "/products"
            );

          // FILTER PRODUCTS OF THIS VENDOR
          const vendorProducts =
            productRes.data.products.filter(
              (product) =>
                product.vendor?._id === id
            );

          setProducts(
            vendorProducts
          );

        } catch (error) {

          console.log(error);

        } finally {

          setLoading(false);
        }
      };

    fetchVendorDetails();

  }, [id]);

  // =========================
  // LOADING
  // =========================
  if (loading) {

    return (
      <div className="p-10 text-xl font-semibold">
        Loading...
      </div>
    );
  }

  // =========================
  // NO VENDOR
  // =========================
  if (!vendor) {

    return (
      <div className="p-10 text-red-500">
        Vendor not found
      </div>
    );
  }

  return (

    <div className="p-10 bg-gray-100 min-h-screen">

      {/* ================================= */}
      {/* VENDOR DETAILS */}
      {/* ================================= */}
      <h1 className="text-3xl font-bold mb-6">
        Vendor Details
      </h1>

      <div className="bg-white p-6 rounded-xl shadow max-w-4xl">

        <div className="flex items-center gap-6">

          <img
            src={
              vendor.logo ||
              "https://i.pravatar.cc/150"
            }
            alt="logo"
            className="w-28 h-28 object-cover rounded-xl border"
          />

          <div>

            <h2 className="text-3xl font-bold">
              {vendor.shopName}
            </h2>

            <p className="text-gray-500 mt-1">
              Owner :
              {" "}
              {vendor.ownerName}
            </p>

            <p className="text-gray-500">
              Email :
              {" "}
              {vendor.email}
            </p>

            <p className="text-gray-500">
              Phone :
              {" "}
              {vendor.phone}
            </p>

            <p className="text-gray-500">
              Address :
              {" "}
              {vendor.address}
            </p>

            <p className="text-gray-500 mt-2">
              Joined :
              {" "}
              {
                new Date(
                  vendor.createdAt
                ).toLocaleDateString()
              }
            </p>

          </div>

        </div>

      </div>

      {/* ================================= */}
      {/* VENDOR PRODUCTS */}
      {/* ================================= */}
      <div className="mt-10">

        <h2 className="text-2xl font-bold mb-6">
          Vendor Products
        </h2>

        {products.length === 0 ? (

          <div className="bg-white p-8 rounded-xl shadow text-gray-500">
            No products found
          </div>

        ) : (

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

            {products.map(
              (product) => (

                <div
                  key={product._id}
                  className="bg-white rounded-xl shadow overflow-hidden hover:shadow-lg transition"
                >

                  {/* IMAGE */}
                  <img
                    src={
                      product.image?.[0]
                    }
                    alt={
                      product.name
                    }
                    className="w-full h-52 object-cover"
                  />

                  {/* DETAILS */}
                  <div className="p-4">

                    <h3 className="text-xl font-bold mb-2">
                      {product.name}
                    </h3>

                    <p className="text-gray-500 text-sm mb-3">
                      {
                        product.category
                      }
                    </p>

                    <div className="flex items-center justify-between">

                      <div>

                        <p className="text-gray-400 line-through">
                          ₹
                          {
                            product.price
                          }
                        </p>

                        <p className="text-green-600 font-bold text-xl">
                          ₹
                          {
                            product.offerPrice
                          }
                        </p>

                      </div>

                      <div className="text-sm text-gray-500">
                        Stock :
                        {" "}
                        {
                          product.stockQuantity
                        }
                      </div>

                    </div>

                  </div>

                </div>
              )
            )}

          </div>
        )}

      </div>

    </div>
  );
}