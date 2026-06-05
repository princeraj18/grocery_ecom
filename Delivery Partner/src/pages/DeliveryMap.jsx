import React, {
  useEffect,
  useState,
} from "react";

import {
  useParams,
  useNavigate,
} from "react-router-dom";

import axios from "axios";

export default function DeliveryMap() {

  const { orderId } =
    useParams();

  const navigate =
    useNavigate();

  const [order, setOrder] =
    useState(null);

  // =====================================
  // FETCH ORDER
  // =====================================

  useEffect(() => {

    fetchOrder();

  }, []);

  const fetchOrder =
    async () => {

      try {

        const token =
          localStorage.getItem(
            "deliveryToken"
          );

        const { data } =
          await axios.get(
            `http://localhost:5000/api/orders/${orderId}`,
            {
              headers: {
                Authorization:
                  `Bearer ${token}`,
              },
            }
          );

        setOrder(data.order);

      } catch (error) {

        console.log(error);
      }
    };

  // =====================================
  // UPDATE STATUS
  // =====================================

  const updateStatus =
    async (status) => {

      try {

        const token =
          localStorage.getItem(
            "deliveryToken"
          );

        await axios.put(
          "http://localhost:5000/api/delivery-partners/update-status",
          {
            orderId,
            status,
          },
          {
            headers: {
              Authorization:
                `Bearer ${token}`,
            },
          }
        );

        alert(
          `Order marked as ${status}`
        );

        if (status === "Delivered") {

          navigate(
            "/delivery/active-orders"
          );
        }

      } catch (error) {

        console.log(error);

        alert(
          "Failed to update status"
        );
      }
    };

  if (!order) {

    return (
      <div className="text-white p-10">
        Loading...
      </div>
    );
  }

  return (

    <div className="min-h-screen bg-slate-950 text-white p-5">

      {/* HEADER */}
      <div className="mb-6">

        <h1 className="text-3xl font-bold">
          Delivery Navigation
        </h1>

        <p className="text-slate-400 mt-2">
          Order #
          {order._id.slice(-6)}
        </p>

      </div>

      {/* MAP */}
      <div className="rounded-2xl overflow-hidden border border-slate-800">

        <iframe
          title="Google Map"
          width="100%"
          height="450"
          loading="lazy"
          allowFullScreen
          className="w-full"
          src={`https://www.google.com/maps?q=${order.shippingAddress?.street},${order.shippingAddress?.city}&output=embed`}
        />

      </div>

      {/* ADDRESS */}
      <div className="mt-6 bg-slate-900 border border-slate-800 rounded-2xl p-5">

        <h2 className="text-xl font-bold mb-3">
          Delivery Address
        </h2>

        <p>
          {order.shippingAddress?.firstName}{" "}
          {order.shippingAddress?.lastName}
        </p>

        <p className="text-slate-400 mt-1">
          {order.shippingAddress?.street}
        </p>

        <p className="text-slate-400">
          {order.shippingAddress?.city}
        </p>

        <p className="text-slate-400">
          {order.shippingAddress?.phone}
        </p>

      </div>

      {/* ACTION BUTTONS */}
      <div className="mt-6 flex flex-wrap gap-4">

        <button
          onClick={() =>
            updateStatus(
              "Out for Delivery"
            )
          }
          className="bg-blue-500 hover:bg-blue-600 px-5 py-3 rounded-xl font-semibold"
        >
          Mark Out For Delivery
        </button>

        <button
          onClick={() =>
            updateStatus(
              "Delivered"
            )
          }
          className="bg-emerald-500 hover:bg-emerald-600 px-5 py-3 rounded-xl font-semibold"
        >
          Mark Delivered
        </button>

      </div>

    </div>
  );
}