// PaymentSuccess.jsx

import React, {
  useEffect,
  useState,
} from "react";

import { Link } from "react-router-dom";

import api from "../api/Axios";

const PaymentSuccess = () => {
  const [order, setOrder] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const orderId =
          localStorage.getItem(
            "lastOrderId"
          );

        if (!orderId) {
          setLoading(false);
          return;
        }

        const res = await api.get(
          `/orders/${orderId}`
        );

        setOrder(res.data.order);
      } catch (error) {
        console.log(
          "Fetch Order Error:",
          error.response?.data || error
        );
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center text-2xl font-semibold">
        Loading...
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center">
        <h1 className="text-3xl font-bold text-red-500">
          Order Not Found
        </h1>

        <Link
          to="/"
          className="mt-5 bg-green-600 text-white px-6 py-3 rounded-lg"
        >
          Go Home
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4 py-10">
      <div className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-4xl">
        {/* SUCCESS */}
        <div className="text-center">
          <div className="text-7xl mb-4">
            ✅
          </div>

          <h1 className="text-4xl font-bold text-green-600">
            Order Placed Successfully!
          </h1>

          <p className="text-gray-600 mt-3">
            Thank you for shopping with
            GreenCart
          </p>
        </div>

        {/* ORDER INFO */}
        <div className="mt-8 grid md:grid-cols-2 gap-6">
          <div className="bg-green-50 p-5 rounded-xl">
            <h2 className="font-bold text-lg mb-3">
              Payment Details
            </h2>

            <p>
              <strong>Method:</strong>{" "}
              {order.paymentMethod}
            </p>

            <p>
              <strong>Status:</strong>{" "}
              {order.paymentStatus}
            </p>

            <p>
              <strong>Order ID:</strong>{" "}
              {order._id}
            </p>
          </div>

          <div className="bg-gray-50 p-5 rounded-xl">
            <h2 className="font-bold text-lg mb-3">
              Delivery Address
            </h2>

            <p>
              {
                order.shippingAddress
                  ?.fullName
              }
            </p>

            <p>
              {
                order.shippingAddress
                  ?.phone
              }
            </p>

            <p>
              {
                order.shippingAddress
                  ?.email
              }
            </p>

            <p>
              {
                order.shippingAddress
                  ?.address
              }
            </p>

            <p>
              {
                order.shippingAddress
                  ?.city
              }
              ,{" "}
              {
                order.shippingAddress
                  ?.state
              }{" "}
              -{" "}
              {
                order.shippingAddress
                  ?.pincode
              }
            </p>
          </div>
        </div>

        {/* PRODUCTS */}
        <div className="mt-8">
          <h2 className="text-2xl font-bold mb-5">
            Ordered Products
          </h2>

          <div className="space-y-4">
            {order.products?.map(
              (product, index) => (
                <div
                  key={index}
                  className="flex justify-between items-center border rounded-xl p-4"
                >
                  <div className="flex items-center gap-4">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-20 h-20 object-cover rounded-lg"
                    />

                    <div>
                      <h3 className="font-semibold">
                        {product.name}
                      </h3>

                      <p className="text-sm text-gray-500">
                        Qty:{" "}
                        {
                          product.quantity
                        }
                      </p>

                      {product.size && (
                        <p className="text-sm text-gray-500">
                          Size:{" "}
                          {product.size}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="font-bold text-lg">
                    ₹
                    {product.price *
                      product.quantity}
                  </div>
                </div>
              )
            )}
          </div>
        </div>

        {/* TOTAL */}
        <div className="mt-8 border-t pt-5">
          <div className="flex justify-between text-2xl font-bold">
            <span>Total Amount</span>

            <span>
              ₹{order.totalAmount}
            </span>
          </div>
        </div>

        {/* BUTTON */}
        <Link
          to="/"
          className="block text-center mt-8 bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg"
        >
          Continue Shopping
        </Link>
      </div>
    </div>
  );
};

export default PaymentSuccess;