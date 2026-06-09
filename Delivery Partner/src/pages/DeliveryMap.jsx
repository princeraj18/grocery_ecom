import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { 
  MapPin, 
  Phone, 
  Navigation, 
  AlertCircle, 
  CheckCircle2, 
  XCircle, 
  ChevronLeft 
} from "lucide-react";

export default function DeliveryMap() {
  const { orderId } = useParams();
  const navigate = useNavigate();

  // Guard against missing orderId
  if (!orderId) {
    navigate("/orders");
    return null;
  }

  const [order, setOrder] = useState(null);

  // =====================================
  // FETCH ORDER
  // =====================================
  useEffect(() => {
    fetchOrder();
  }, []);

  const fetchOrder = async () => {
    try {
      const token = localStorage.getItem("deliveryToken");
      const { data } = await axios.get(
        `http://localhost:5000/api/orders/${orderId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
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
  const updateStatus = async (status) => {
    try {
      const token = localStorage.getItem("deliveryToken");
      await axios.put(
        "http://localhost:5000/api/delivery-partners/update-status",
        {
          orderId,
          deliveryStatus: status,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert(`Order marked as ${status}`);

      if (status === "Delivered") {
        navigate("/orders");
      } else {
        fetchOrder();
      }
    } catch (error) {
      console.log(error);
      alert("Failed to update status");
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
      <div className="max-w-4xl mx-auto p-4 sm:p-6 space-y-6 animate-pulse">
        <div className="h-6 bg-gray-200 rounded-md w-1/4" />
        <div className="h-[450px] bg-gray-200 rounded-2xl" />
        <div className="h-32 bg-gray-200 rounded-2xl" />
      </div>
    );
  }

  // Construct map query cleanly without formatting syntax breaks
  const mapQuery = encodeURIComponent(
    `${order.shippingAddress?.street || ""}, ${order.shippingAddress?.city || ""}`
  );

  return (
    <div className="p-4 sm:p-6 max-w-4xl mx-auto space-y-6 bg-gray-50/30 min-h-screen font-sans">
      
      {/* HEADER SECTION WITH BACK BUTTON */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
        <div className="space-y-1">
          <button
            onClick={() => navigate("/orders")}
            className="inline-flex items-center gap-1 text-[11px] font-bold text-gray-400 hover:text-gray-900 uppercase tracking-wider mb-1 transition-colors"
          >
            <ChevronLeft size={14} /> Back to active orders
          </button>
          <h1 className="text-xl font-bold text-gray-900 uppercase tracking-wider flex items-center gap-2">
            <Navigation size={18} className="text-orange-500" /> Transit Map
          </h1>
          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">
            Order Reference: #{order._id.slice(-6).toUpperCase()}
          </p>
        </div>

        {/* CURRENT LIVE LOG STATUS INSIGNIA BADGE */}
        <div className="self-start sm:self-center">
          <span className="text-[10px] font-bold uppercase tracking-wider px-3 py-1.5 rounded-lg bg-gray-100 border border-gray-200 text-gray-700">
            Status: {order.deliveryStatus}
          </span>
        </div>
      </div>

      {/* EMBEDDED MAP VIEWPORT COMPONENT */}
      <div className="bg-white rounded-2xl overflow-hidden border border-gray-200/80 shadow-sm">
        <iframe
          title="Google Map Navigation Embed"
          width="100%"
          height="400"
          loading="lazy"
          allowFullScreen
          className="w-full border-0"
          src={`https://maps.google.com/maps?q=${mapQuery}&t=&z=15&ie=UTF8&iwloc=&output=embed`}
        />
      </div>

      {/* CUSTOMER PROFILE ADDRESS DETAIL BLOCK */}
      <div className="bg-white border border-gray-200/70 shadow-sm rounded-2xl p-6 space-y-4">
        <div className="flex items-center gap-2 border-b border-gray-100 pb-3">
          <MapPin size={15} className="text-gray-400" />
          <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wider">
            Consignee Delivery Hub Address
          </h2>
        </div>

        <div className="space-y-1">
          <p className="text-xs font-bold text-gray-900">
            {order.shippingAddress?.firstName} {order.shippingAddress?.lastName}
          </p>
          <p className="text-xs font-medium text-gray-500">
            {order.shippingAddress?.street}
          </p>
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide text-[11px]">
            {order.shippingAddress?.city}
          </p>
        </div>

        {order.shippingAddress?.phone && (
          <div className="pt-4 border-t border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block">
                Comms Channel Link
              </span>
              <span className="text-xs font-bold text-gray-800 mt-0.5 block">
                +91 {order.shippingAddress.phone}
              </span>
            </div>
            
            <a
              href={`tel:${order.shippingAddress.phone}`}
              className="inline-flex items-center justify-center gap-2 bg-gray-900 hover:bg-gray-800 active:scale-[0.98] text-white text-[11px] font-bold uppercase tracking-wider px-4 py-2.5 rounded-xl transition-all shadow-sm"
            >
              <Phone size={12} /> Contact Customer
            </a>
          </div>
        )}
      </div>

      {/* WORKFLOW DISPATCH ACTION TRIGGER INTERFACE */}
      <div className="flex flex-wrap gap-3">
        {order.deliveryStatus === "Assigned" && (
          <>
            <button
              onClick={() => handleResponse("accept")}
              className="bg-orange-500 hover:bg-orange-600 active:scale-[0.99] text-white text-[11px] font-bold uppercase tracking-wider px-6 py-3 rounded-xl transition-all shadow-sm"
            >
              Accept Consignment
            </button>
            <button
              onClick={() => handleResponse("reject")}
              className="bg-red-500 hover:bg-red-600 active:scale-[0.99] text-white text-[11px] font-bold uppercase tracking-wider px-6 py-3 rounded-xl transition-all shadow-sm"
            >
              Decline Order
            </button>
          </>
        )}

        {order.deliveryStatus === "Accepted" && (
          <button
            onClick={() => updateStatus("Out for Delivery")}
            className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 active:scale-[0.99] text-white text-[11px] font-bold uppercase tracking-wider px-6 py-3 rounded-xl transition-all shadow-sm"
          >
            Dispatch Out For Delivery
          </button>
        )}

        {order.deliveryStatus === "Out for Delivery" && (
          <button
            onClick={() => updateStatus("Delivered")}
            className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-700 active:scale-[0.99] text-white text-[11px] font-bold uppercase tracking-wider px-6 py-3 rounded-xl transition-all shadow-sm"
          >
            Finalize Delivery Dropoff
          </button>
        )}

        {order.deliveryStatus === "Delivered" && (
          <div className="w-full bg-emerald-50 border border-emerald-200 p-4 rounded-xl flex items-start gap-3">
            <CheckCircle2 className="text-emerald-600 mt-0.5 shrink-0" size={16} />
            <div>
              <p className="text-emerald-800 font-bold text-xs uppercase tracking-wide">
                Consignment Securely Settled
              </p>
              <p className="text-emerald-600/90 text-[11px] font-medium mt-0.5">
                Trip closed. Payout allocation of ₹{order.partnerEarning || 0} successfully routed into your available balance wallet ledger.
              </p>
            </div>
          </div>
        )}

        {order.deliveryStatus === "Rejected" && (
          <div className="w-full bg-red-50 border border-red-200 p-4 rounded-xl flex items-start gap-3">
            <XCircle className="text-red-600 mt-0.5 shrink-0" size={16} />
            <div>
              <p className="text-red-800 font-bold text-xs uppercase tracking-wide">
                Consignment Dismissed
              </p>
              <p className="text-red-600/90 text-[11px] font-medium mt-0.5">
                This transaction ledger sequence has been rejected and unassigned from your account itinerary profile.
              </p>
            </div>
          </div>
        )}
      </div>

    </div>
  );
}