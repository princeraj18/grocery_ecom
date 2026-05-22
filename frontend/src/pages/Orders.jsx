import React, {
  useEffect,
  useState,
} from "react";

import api from "../api/Axios";

const Orders = () => {
  const [orders, setOrders] =
    useState([]);

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
        <div className="space-y-6">

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

                  <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm">
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

              {/* Products */}
              <div className="space-y-4">

                {order.products?.map(
                  (item, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-4 border rounded-xl p-4"
                    >

                      {/* Product Image */}
                      <img
                        src={
                          item.image ||
                          "https://via.placeholder.com/100"
                        }
                        alt={item.name}
                        className="w-24 h-24 object-cover rounded-lg border"
                      />

                      {/* Product Info */}
                      <div className="flex-1">

                        <h3 className="font-semibold text-lg">
                          {item.name}
                        </h3>

                        <p className="text-gray-600 mt-1">
                          Quantity: {item.quantity}
                        </p>

                        {item.size && (
                          <p className="text-gray-600">
                            Size: {item.size}
                          </p>
                        )}

                        <p className="text-green-600 font-bold mt-2">
                          ₹{item.price}
                        </p>

                      </div>
                    </div>
                  )
                )}

              </div>

            </div>
          ))}

        </div>
      )}
    </div>
  );
};

export default Orders;