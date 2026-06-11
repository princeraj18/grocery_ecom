import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/Axios";
import { ShopContext } from "../context/ShopContext";
import { 
  FaCheckCircle, 
  FaBoxOpen, 
  FaReceipt, 
  FaUser, 
  FaPhone, 
  FaEnvelope, 
  FaMapMarkerAlt, 
  FaShoppingBasket, 
  FaArrowRight 
} from "react-icons/fa";

const PaymentSuccess = () => {
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const { clearCart } = useContext(ShopContext);

  useEffect(() => {
    const verifyAndFetchOrder = async () => {
      try {
        const params = new URLSearchParams(window.location.search);
        const sessionId = params.get("session_id");
        const orderId = localStorage.getItem("lastOrderId");

        const paymentVerifiedKey = sessionId
          ? `paymentVerified:${sessionId}`
          : "paymentVerified";

        console.log("Session ID:", sessionId);
        console.log("Order ID:", orderId);

        // ====================================
        // VERIFY STRIPE PAYMENT ONLY ONCE
        // ====================================
        if (sessionId && !localStorage.getItem(paymentVerifiedKey)) {
          const verifyRes = await api.post("/payment/verify-payment", {
            sessionId,
          });

          if (verifyRes.data.success) {
            const user = JSON.parse(localStorage.getItem("user"));

            // Clear Database Cart
            await api.delete("/cart/clear", {
              data: { userId: user._id },
            });

            // Clear Local Storage Cart
            localStorage.removeItem("cart");

            // Clear Context Cart
            await clearCart();

            // Prevent Re-run
            localStorage.setItem(paymentVerifiedKey, "true");
          }
        }

        // ====================================
        // FOR COD ORDERS: CLEAR CART ONLY ONCE
        // ====================================
        if (!sessionId && !localStorage.getItem("codCartCleared")) {
          const user = JSON.parse(localStorage.getItem("user"));

          if (user?._id) {
            await api.delete("/cart/clear", {
              data: { userId: user._id },
            });

            localStorage.removeItem("cart");
            await clearCart();
            localStorage.setItem("codCartCleared", "true");
          }
        }

        // ====================================
        // FETCH ORDER
        // ====================================
        if (orderId) {
          const res = await api.get(`/orders/${orderId}`);
          console.log("ORDER RESPONSE:", res.data);

          if (res.data.success) {
            setOrder(res.data.order);
          }
        }
      } catch (error) {
        console.error(
          "Payment Success Error:",
          error.response?.data || error
        );
      } finally {
        setLoading(false);
      }
    };

    verifyAndFetchOrder();
  }, [clearCart]);

  // ====================================
  // LOADING STATE
  // ====================================
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-950 gap-4">
        <div className="w-10 h-10 border-4 border-[#0c831f]/20 border-t-[#0c831f] dark:border-emerald-500/20 dark:border-t-emerald-500 rounded-full animate-spin"></div>
        <p className="text-sm font-bold tracking-wide text-slate-500 dark:text-slate-400">
          Confirming payment and processing order...
        </p>
      </div>
    );
  }

  // ====================================
  // ORDER NOT FOUND STATE
  // ====================================
  if (!order) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center bg-slate-50 dark:bg-slate-950 px-4">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-8 rounded-2xl shadow-sm text-center max-w-md w-full">
          <div className="w-16 h-16 bg-rose-50 dark:bg-rose-950/30 text-rose-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <FaBoxOpen className="text-2xl" />
          </div>
          <h1 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">
            Order Not Found
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-2 leading-relaxed">
            We couldn't verify or locate the details for this transaction. Please contact support if this persists.
          </p>
          <Link
            to="/"
            className="mt-6 block w-full bg-[#0c831f] hover:bg-[#096b19] dark:bg-emerald-600 dark:hover:bg-emerald-500 text-white font-bold text-sm py-3 rounded-xl shadow-sm transition-all text-center"
          >
            Return to Homepage
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 py-12 px-4 sm:px-6 transition-colors duration-200">
      <div className="max-w-4xl mx-auto bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800/80 shadow-sm rounded-2xl overflow-hidden">
        
        {/* SUCCESS ANNOUNCEMENT HEADER */}
        <div className="text-center p-8 border-b border-slate-100 dark:border-slate-800/60 bg-gradient-to-b from-emerald-50/30 to-transparent dark:from-emerald-950/10">
          <div className="inline-flex items-center justify-center text-emerald-500 dark:text-emerald-400 mb-4 animate-bounce">
            <FaCheckCircle className="text-6xl sm:text-7xl" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
            Order Placed Successfully!
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-2 text-sm max-w-md mx-auto leading-relaxed">
            Thank you for shopping with us! Your request is being prepared for fulfillment.
          </p>
        </div>

        {/* DETAILS GRID ROW */}
        <div className="grid md:grid-cols-2 gap-6 p-6 sm:p-8">
          
          {/* CARD MODULE: ORDER SUMMARY */}
          <div className="bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800/60 p-5 rounded-xl">
            <h2 className="font-bold text-sm uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-4 flex items-center gap-2">
              <FaReceipt className="text-xs" /> Payout Summary
            </h2>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between items-baseline border-b border-slate-200/60 dark:border-slate-800/40 pb-2">
                <span className="text-slate-500 dark:text-slate-400 font-medium">Order ID</span>
                <span className="font-mono text-xs font-black text-slate-800 dark:text-slate-200 select-all">
                  #{order._id}
                </span>
              </div>
              <div className="flex justify-between border-b border-slate-200/60 dark:border-slate-800/40 pb-2">
                <span className="text-slate-500 dark:text-slate-400 font-medium">Method</span>
                <span className="font-bold text-slate-800 dark:text-slate-200">{order.paymentMethod}</span>
              </div>
              <div className="flex justify-between border-b border-slate-200/60 dark:border-slate-800/40 pb-2">
                <span className="text-slate-500 dark:text-slate-400 font-medium">Payment Status</span>
                <span className="font-bold px-2 py-0.5 rounded text-[11px] uppercase bg-emerald-100 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-400">
                  {order.paymentStatus}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 dark:text-slate-400 font-medium">Delivery Status</span>
                <span className="font-bold px-2 py-0.5 rounded text-[11px] uppercase bg-amber-100 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400">
                  {order.orderStatus}
                </span>
              </div>
            </div>
          </div>

          {/* CARD MODULE: SHIPPING DESTINATION */}
          <div className="bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800/60 p-5 rounded-xl">
            <h2 className="font-bold text-sm uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-4 flex items-center gap-2">
              <FaMapMarkerAlt className="text-xs" /> Delivery Destination
            </h2>
            <div className="space-y-2 text-sm text-slate-700 dark:text-slate-300">
              <p className="font-black text-slate-900 dark:text-white flex items-center gap-2">
                <FaUser className="text-xs text-slate-400" /> {order.shippingAddress?.fullName || "Customer"}
              </p>
              <p className="flex items-center gap-2 text-xs">
                <FaPhone className="text-slate-400" /> {order.shippingAddress?.phone || "N/A"}
              </p>
              {order.shippingAddress?.email && (
                <p className="flex items-center gap-2 text-xs truncate">
                  <FaEnvelope className="text-slate-400" /> {order.shippingAddress.email}
                </p>
              )}
              <div className="pt-1 text-xs border-t border-slate-200/60 dark:border-slate-800/40 mt-2 text-slate-500 dark:text-slate-400 leading-relaxed">
                {order.shippingAddress?.address && <p>{order.shippingAddress.address}</p>}
                <p className="font-semibold text-slate-700 dark:text-slate-300 mt-0.5">
                  {order.shippingAddress?.city}
                  {order.shippingAddress?.state && `, ${order.shippingAddress.state}`}
                  {order.shippingAddress?.pincode && ` - ${order.shippingAddress.pincode}`}
                </p>
              </div>
            </div>
          </div>

        </div>

        {/* FEED SEPARATOR LINE */}
        <div className="px-6 sm:px-8">
          <div className="border-t border-slate-100 dark:border-slate-800/60"></div>
        </div>

        {/* ORDERED ITEMS FEED */}
        <div className="p-6 sm:p-8">
          <h2 className="text-base font-black text-slate-900 dark:text-white mb-4 flex items-center gap-2">
            <FaShoppingBasket className="text-[#0c831f] dark:text-emerald-500" /> Ordered Items
          </h2>
          
          <div className="divide-y divide-slate-100 dark:divide-slate-800/60 border border-slate-100 dark:border-slate-800/60 rounded-xl overflow-hidden">
            {order.items?.map((item, index) => (
              <div
                key={index}
                className="flex items-center gap-4 p-4 bg-slate-50/50 dark:bg-slate-900/40 text-sm"
              >
                {/* ITEM IMAGE */}
                <div className="w-14 h-14 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg p-1 flex items-center justify-center shrink-0">
                  <img
                    src={item.image || "https://via.placeholder.com/120"}
                    alt={item.name}
                    className="max-w-full max-h-full object-contain"
                  />
                </div>

                {/* ITEM SPECS */}
                <div className="flex-1 min-w-0 flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                  <div className="min-w-0">
                    <h3 className="font-bold text-slate-900 dark:text-white truncate">
                      {item.name}
                    </h3>
                    <div className="flex flex-wrap items-center gap-2 text-xs text-slate-400 mt-0.5 font-medium">
                      {item.variantSize && (
                        <span>Size: <span className="text-slate-600 dark:text-slate-300 font-bold">{item.variantSize}</span></span>
                      )}
                      {item.variantSize && <span>•</span>}
                      <span>Qty: <span className="text-slate-600 dark:text-slate-300 font-bold">{item.quantity}</span></span>
                      <span>•</span>
                      <span>₹{item.price} each</span>
                    </div>
                  </div>

                  {/* ITEM TOTAL PRICE */}
                  <div className="text-left sm:text-right pt-1 sm:pt-0 border-t sm:border-t-0 border-slate-200/40 dark:border-slate-800/20">
                    <span className="font-extrabold text-slate-900 dark:text-slate-100">
                      ₹{item.price * item.quantity}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* GRAND TOTAL INVOICE PANEL */}
        <div className="bg-slate-50 dark:bg-slate-950 px-6 py-6 sm:px-8 border-t border-slate-100 dark:border-slate-800/60 flex items-center justify-between">
          <span className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
            Total Amount Paid
          </span>
          <span className="text-2xl font-black text-[#0c831f] dark:text-emerald-400">
            ₹{order.totalAmount}
          </span>
        </div>

        {/* PRIMARY LINK DISPATCHER SUBMIT */}
        <div className="p-6 sm:p-8 bg-white dark:bg-slate-900">
          <Link
            to="/"
            onClick={() => {
              localStorage.removeItem("paymentVerified");
              localStorage.removeItem("codCartCleared");
              localStorage.removeItem("lastOrderId");
            }}
            className="group flex items-center justify-center gap-2 w-full bg-[#0c831f] hover:bg-[#096b19] dark:bg-emerald-600 dark:hover:bg-emerald-500 text-white font-black text-sm py-4 rounded-xl shadow-md transition-all active:scale-[0.99]"
          >
            Continue Shopping
            <FaArrowRight className="text-xs group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

      </div>
    </div>
  );
};

export default PaymentSuccess;