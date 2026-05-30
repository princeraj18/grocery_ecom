import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/Axios";
const Orders = () => {
  const [orders, setOrders] =
    useState([]);
const navigate = useNavigate();
  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  // Fetch Orders
  const fetchOrders = async () => {
    try {
      const user = JSON.parse(
        localStorage.getItem("user")
      );

      if (!user) return;

      const res = await api.get(
        `/orders/my-orders/${user._id}`
      );

      setOrders(res.data.orders || []);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  // Loading
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <h1 className="text-2xl font-semibold">
          Loading Orders...
        </h1>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6 min-h-screen">

      {/* Heading */}
      <h1 className="text-4xl font-bold mb-8">
        My Orders
      </h1>

      {/* No Orders */}
      {orders.length === 0 ? (
        <div className="bg-white p-10 rounded-2xl shadow text-center">
          <h2 className="text-2xl font-semibold">
            No Orders Found
          </h2>

          <p className="text-gray-500 mt-2">
            Your grocery orders will appear here.
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-3xl shadow-lg p-6 border border-gray-100">

          {orders.map((order) => (
            <div
              key={order._id}
              className="bg-white rounded-2xl shadow-md p-6 border"
            >

              {/* Order Header */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">

                {/* Order ID */}
                <div>
                  <p className="text-sm text-gray-500">
                    Order ID
                  </p>

                  <h2 className="font-semibold break-all">
                    {order._id}
                  </h2>
                </div>

                {/* Status */}
                <div>
                  <p className="text-sm text-gray-500">
                    Order Status
                  </p>

                  <span
  className={`px-3 py-1 rounded-full text-sm font-medium ${
    order.orderStatus === "Delivered"
      ? "bg-green-100 text-green-700"
      : order.orderStatus === "Cancelled"
      ? "bg-red-100 text-red-700"
      : "bg-yellow-100 text-yellow-700"
  }`}
>
  {order.orderStatus || "Processing"}
</span>
                </div>

                {/* Payment */}
                <div>
                  <p className="text-sm text-gray-500">
                    Payment Method
                  </p>

                  <h2 className="font-medium">
                    {order.paymentMethod}
                  </h2>
                </div>

                {/* Total */}
                <div>
                  <p className="text-sm text-gray-500">
                    Total Amount
                  </p>

                  <h2 className="font-bold text-green-600 text-lg">
                    ₹{order.totalAmount}
                  </h2>
                </div>
              </div>

              
{/* PRODUCTS */}
<div className="border-t pt-5">

  <h3 className="text-xl font-bold mb-4">
    Ordered Products
  </h3>

  <div className="space-y-4">

    {order.items?.map((item, index) => (

      <div
        key={index}
        onClick={() =>
          navigate(`/products/${item.product}`)
        }
        className="flex flex-col md:flex-row items-center gap-5 p-4 border rounded-2xl bg-gray-50 hover:bg-white hover:shadow-lg hover:border-green-500 transition-all duration-300 cursor-pointer"
      >

        {/* PRODUCT IMAGE */}
        <div className="flex-shrink-0">

          <img
            src={
              item.image ||
              "https://via.placeholder.com/120"
            }
            alt={item.name}
            className="w-28 h-28 md:w-32 md:h-32 object-cover rounded-xl border"
          />

        </div>

        {/* PRODUCT INFO */}
        <div className="flex-1 text-center md:text-left">

          <h4 className="text-lg md:text-xl font-semibold">
            {item.name}
          </h4>

          {item.variantSize && (
            <p className="text-gray-500 mt-1">
              Size: {item.variantSize}
            </p>
          )}

          <div className="flex flex-wrap justify-center md:justify-start gap-3 mt-3">

            <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-medium">
              Qty: {item.quantity}
            </span>

            <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-medium">
              ₹{item.price}
            </span>

          </div>

        </div>

        {/* PRICE & ACTION */}
        <div className="text-center md:text-right">

          <p className="text-sm text-gray-500">
            Subtotal
          </p>

          <p className="text-xl font-bold text-green-600">
            ₹{item.price * item.quantity}
          </p>

          <button
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/products/${item.product}`);
            }}
            className="mt-3 text-sm font-medium text-green-600 hover:text-green-700"
          >
            View Product →
          </button>

        </div>

      </div>

    ))}

  </div>

</div>
            </div>
          ))}

        </div>
      )}
    </div>
  );
};

export default Orders;