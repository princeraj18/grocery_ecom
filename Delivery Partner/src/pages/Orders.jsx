import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function Orders() {

  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {

    try {

      const token =
        localStorage.getItem("deliveryToken");

      const res = await axios.get(
        "http://localhost:5000/api/delivery-partners/my-orders",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (res.data.success) {
        setOrders(res.data.orders);
      }

    } catch (error) {

      console.log(error);

    } finally {

      setLoading(false);
    }
  };

  // ======================================
  // ACCEPT ORDER
  // ======================================

  const handleAcceptOrder = async (orderId) => {

    try {

      const token =
        localStorage.getItem("deliveryToken");

      await axios.put(
        "http://localhost:5000/api/delivery-partners/respond-order",
        {
          orderId,
          action: "accept",
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      fetchOrders();

    } catch (error) {

      console.log(error);
    }
  };

  // ======================================
  // REJECT ORDER
  // ======================================

  const handleRejectOrder = async (orderId) => {

    try {

      const token =
        localStorage.getItem("deliveryToken");

      await axios.put(
        "http://localhost:5000/api/delivery-partners/respond-order",
        {
          orderId,
          action: "reject",
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      fetchOrders();

    } catch (error) {

      console.log(error);
    }
  };

  if (loading) {
    return (
      <div className="text-white text-lg">
        Loading orders...
      </div>
    );
  }

  return (
    <div className="space-y-6">

      <h1 className="text-2xl font-bold text-white">
        Your Deliveries
      </h1>

      <div className="space-y-4">

        {orders.length === 0 ? (

          <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 text-center text-slate-400">
            No delivery orders assigned yet
          </div>

        ) : (

          orders.map((order) => (

            <div
              key={order._id}
              onClick={(e) => {
                if (e.target.closest("button")) return;
                navigate(`/delivery-map/${order._id}`);
              }}
              className="bg-slate-900 p-5 rounded-2xl border border-slate-800 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 cursor-pointer hover:border-slate-700 transition"
            >

              {/* Left Side */}
              <div>

                <div className="flex items-center gap-3">

                  <span className="text-lg font-bold text-white">
                    #
                    {order._id.slice(-6)}
                  </span>

                  <span
                    className={`text-xs px-2.5 py-0.5 rounded-full font-medium ${
                      order.deliveryStatus ===
                      "Delivered"
                        ? "bg-emerald-500/10 text-emerald-400"
                        : order.deliveryStatus ===
                          "Assigned"
                        ? "bg-orange-500/10 text-orange-400"
                        : "bg-blue-500/10 text-blue-400"
                    }`}
                  >
                    {order.deliveryStatus}
                  </span>
                </div>

                {/* Products */}
                <p className="text-sm text-slate-400 mt-1">

                  {order.items
                    ?.map(
                      (item) =>
                        `${item.quantity}x ${item.name}`
                    )
                    .join(", ")}
                </p>

                {/* Address */}
               <p className="text-xs text-slate-500 mt-2">
  📍
  {order.shippingAddress?.firstName}{" "}
  {order.shippingAddress?.lastName},
  {order.shippingAddress?.street},
  {order.shippingAddress?.city},
  {order.shippingAddress?.state},
  {order.shippingAddress?.zipcode},
  {order.shippingAddress?.country}
</p>

<p className="text-xs text-slate-500 mt-1">
  📞 {order.shippingAddress?.phone}
</p>

    {/* Payment */}
<div className="flex flex-wrap items-center gap-3 mt-1">

  <p className="text-xs text-slate-500">
    Payment:
    <span className="ml-1 text-white font-medium">
      {order.paymentMethod}
    </span>
  </p>

  <p
    className={`text-xs px-2 py-0.5 rounded-full font-medium ${
      order.paymentStatus === "Paid"
        ? "bg-emerald-500/10 text-emerald-400"
        : order.paymentStatus === "Pending"
        ? "bg-yellow-500/10 text-yellow-400"
        : "bg-red-500/10 text-red-400"
    }`}
  >
    {order.paymentStatus}
  </p>

</div>
              </div>

              {/* Right Side */}
              <div className="w-full sm:w-auto flex sm:flex-col items-center sm:items-end justify-between sm:justify-center border-t sm:border-t-0 pt-3 sm:pt-0 border-slate-800">

                <span className="text-xl font-bold text-emerald-400">
                  ₹
                  {order.partnerEarning || 0}
                </span>

                {/* Assigned Order */}
                {order.deliveryStatus ===
                  "Assigned" && (

                  <div className="flex gap-2 mt-2">

                    <button
                      onClick={() =>
                        handleAcceptOrder(
                          order._id
                        )
                      }
                      className="bg-orange-500 hover:bg-orange-600 text-white text-sm font-semibold px-4 py-2 rounded-xl transition-colors"
                    >
                      Accept
                    </button>

                    <button
                      onClick={() =>
                        handleRejectOrder(
                          order._id
                        )
                      }
                      className="bg-red-500 hover:bg-red-600 text-white text-sm font-semibold px-4 py-2 rounded-xl transition-colors"
                    >
                      Reject
                    </button>
                  </div>
                )}

                {/* Accepted Order */}
                {order.deliveryStatus ===
                  "Accepted" && (

                  <button
  onClick={() =>
    navigate(`/delivery-map/${order._id}`)
  }
  className="mt-2 bg-blue-500 hover:bg-blue-600 text-white text-sm font-semibold px-4 py-2 rounded-xl transition-colors"
>
  Start Delivery
</button>
                )}

                {/* Delivered */}
                {order.deliveryStatus ===
                  "Delivered" && (

                  <span className="mt-2 text-emerald-400 text-sm font-medium">
                    Completed
                  </span>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}