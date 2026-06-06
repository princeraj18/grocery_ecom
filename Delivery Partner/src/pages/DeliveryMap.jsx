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

  const { orderId } = useParams();
  const navigate = useNavigate();

  // Guard against missing orderId
  if (!orderId) {
    // If no orderId, redirect to orders list
    navigate('/orders');
    return null;
  }


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
            deliveryStatus: status,
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
            "/orders"
          );
        } else {
          fetchOrder();
        }

      } catch (error) {

        console.log(error);

        alert(
          "Failed to update status"
        );
      }
    };

  const handleResponse = async (action) => {
    try {
      const token = localStorage.getItem("deliveryToken");
      await axios.put(
        "http://localhost:5000/api/delivery-partners/respond-order",
        {
          orderId,
          action,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert(`Order ${action}ed successfully`);
      if (action === "reject") {
        navigate("/orders");
      } else {
        fetchOrder();
      }
    } catch (error) {
      console.log(error);
      alert("Failed to respond to order");
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

        {order.shippingAddress?.phone && (
          <div className="mt-4 pt-4 border-t border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <p className="text-xs text-slate-500 uppercase tracking-wider">Customer Phone</p>
              <p className="text-slate-200 font-semibold mt-0.5">{order.shippingAddress.phone}</p>
            </div>
            <a
              href={`tel:${order.shippingAddress.phone}`}
              className="inline-flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold px-4 py-2.5 rounded-xl transition-colors shadow-md"
            >
              📞 Call Customer
            </a>
          </div>
        )}

      </div>

      {/* ACTION BUTTONS */}
      <div className="mt-6 flex flex-wrap gap-4">
        {order.deliveryStatus === "Assigned" && (
          <>
            <button
              onClick={() => handleResponse("accept")}
              className="bg-orange-500 hover:bg-orange-600 px-6 py-3 rounded-xl font-bold transition-colors"
            >
              Accept Order
            </button>
            <button
              onClick={() => handleResponse("reject")}
              className="bg-red-500 hover:bg-red-600 px-6 py-3 rounded-xl font-bold transition-colors"
            >
              Reject Order
            </button>
          </>
        )}

        {order.deliveryStatus === "Accepted" && (
          <button
            onClick={() => updateStatus("Out for Delivery")}
            className="bg-blue-500 hover:bg-blue-600 px-6 py-3 rounded-xl font-bold transition-colors"
          >
            Mark Out For Delivery
          </button>
        )}

        {order.deliveryStatus === "Out for Delivery" && (
          <button
            onClick={() => updateStatus("Delivered")}
            className="bg-emerald-500 hover:bg-emerald-600 px-6 py-3 rounded-xl font-bold transition-colors"
          >
            Mark Delivered
          </button>
        )}

        {order.deliveryStatus === "Delivered" && (
          <div className="w-full bg-emerald-500/10 border border-emerald-500/20 p-4 rounded-xl text-center">
            <p className="text-emerald-400 font-bold text-lg">✓ Completed & Delivered</p>
            <p className="text-slate-400 text-sm mt-1">Earnings of ₹{order.partnerEarning} credited to your wallet balance.</p>
          </div>
        )}

        {order.deliveryStatus === "Rejected" && (
          <div className="w-full bg-red-500/10 border border-red-500/20 p-4 rounded-xl text-center">
            <p className="text-red-400 font-bold text-lg">Order Rejected</p>
          </div>
        )}
      </div>

    </div>
  );
}