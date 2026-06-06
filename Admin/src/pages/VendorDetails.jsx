import { useEffect, useState } from "react";

import { useParams, useLocation } from "react-router-dom";

import api from "../services/api";

export default function VendorDetails() {

  const { id } = useParams();
  const location = useLocation();

  const [vendor, setVendor] =
    useState(null);

  const [products, setProducts] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState(null);

  // DETERMINE ENDPOINT
  const isDeliveryPartner =
    location.pathname.includes(
      "delivery-partners"
    );

  const endpoint = isDeliveryPartner
    ? `/admin/delivery-partners/${id}`
    : `/admin/vendors/${id}`;

  useEffect(() => {

    const fetchVendorDetails =
      async () => {

        try {

          setLoading(true);
          setError(null);

          // =========================
          // GET VENDOR/DELIVERY PARTNER DETAILS
          // =========================
          const vendorRes =
            await api.get(endpoint);

          setVendor(
            vendorRes.data.vendor ||
            vendorRes.data.deliveryPartner ||
            vendorRes.data.partner
          );

          // =========================
          // GET ALL PRODUCTS (only for vendors)
          // =========================
          if (!isDeliveryPartner) {
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
          }

        } catch (error) {

          console.log(error);
          setError(
            error.response?.data?.message ||
            "Failed to fetch details"
          );

        } finally {

          setLoading(false);
        }
      };

    fetchVendorDetails();

  }, [id, endpoint, isDeliveryPartner]);

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
  // ERROR
  // =========================
  if (error) {

    return (
      <div className="p-10">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <p className="font-bold">Error</p>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  // =========================
  // NO VENDOR
  // =========================
  if (!vendor) {

    return (
      <div className="p-10">
        <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded">
          <p className="font-bold">{isDeliveryPartner ? "Delivery Partner" : "Vendor"} Not Found</p>
          <p>The requested {isDeliveryPartner ? "delivery partner" : "vendor"} could not be found.</p>
        </div>
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
              vendor.profileImage ||
              "https://i.pravatar.cc/150"
            }
            alt="logo"
            className="w-28 h-28 object-cover rounded-xl border"
          />

          <div>

            <h2 className="text-3xl font-bold">
              {vendor.shopName || vendor.name}
            </h2>

            {vendor.ownerName && (
            <p className="text-gray-500 mt-1">
              Owner :
              {" "}
              {vendor.ownerName}
            </p>
            )}

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
      {/* VENDOR PRODUCTS - Only show for vendors */}
      {/* ================================= */}
      {!isDeliveryPartner && (
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
                        product.category?.text || product.category?.name || "Uncategorized"
                      }
                    </p>

                    <div className="flex items-center justify-between">

                     <div>

  <p className="text-gray-400 line-through">
    ₹
    {
      product.variants?.[0]?.price || 0
    }
  </p>

  <p className="text-green-600 font-bold text-xl">
    ₹
    {
      product.variants?.[0]?.offerPrice || 0
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
      )}

    </div>
  );
}