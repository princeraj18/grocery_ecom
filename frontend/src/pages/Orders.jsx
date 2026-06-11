import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/Axios";
import { FaBoxOpen, FaShoppingBag, FaReceipt, FaCalendarAlt, FaCreditCard, FaChevronRight, FaClock } from "react-icons/fa";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      if (!user) return;

      const res = await api.get(`/orders/my-orders/${user._id}`);
      setOrders(res.data.orders || []);
    } catch (error) {
      console.error("Error fetching order records:", error);
    } finally {
      setLoading(false);
    }
  };

  // ======================================
  // UTILITY HELPER: EXTRACT OR PARSE DATE
  // ======================================
  const formatOrderTimestamp = (order) => {
    let dateObj;

    if (order.createdAt) {
      dateObj = new Date(order.createdAt);
    } else if (order._id) {
      // Fallback: Extract timestamp directly from MongoDB ObjectId Hex
      const timestamp = parseInt(order._id.substring(0, 8), 16) * 1000;
      dateObj = new Date(timestamp);
    } else {
      return { date: "N/A", time: "N/A" };
    }

    // Format options matching clean readable presentation preferences
    const dateOptions = { day: '2-digit', month: 'short', year: 'numeric' };
    const timeOptions = { hour: '2-digit', minute: '2-digit', hour12: true };

    return {
      date: dateObj.toLocaleDateString('en-IN', dateOptions),
      time: dateObj.toLocaleTimeString('en-IN', timeOptions)
    };
  };

  // ======================================
  // LOADING STATE
  // ======================================
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-950 gap-4">
        <div className="w-10 h-10 border-4 border-[#0c831f]/20 border-t-[#0c831f] dark:border-emerald-500/20 dark:border-t-emerald-500 rounded-full animate-spin"></div>
        <p className="text-sm font-bold tracking-wide text-slate-500 dark:text-slate-400">
          Retrieving your order records...
        </p>
      </div>
    );
  }

  return (
    <div className="bg-slate-50 dark:bg-slate-950 min-h-screen text-slate-800 dark:text-slate-100 transition-colors duration-200">
      <div className="max-w-5xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        
        {/* DASHBOARD PAGE TITLE */}
        <h1 className="text-2xl sm:text-3xl font-black mb-8 tracking-tight flex items-center gap-3">
          <FaShoppingBag className="text-[#0c831f] dark:text-emerald-500 text-xl sm:text-2xl" />
          My Orders
        </h1>

        {/* EMPTY ORDERS LAYOUT FALLBACK */}
        {orders.length === 0 ? (
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800/80 p-8 sm:p-16 rounded-2xl shadow-sm text-center max-w-lg mx-auto">
            <div className="w-16 h-16 bg-slate-100 dark:bg-slate-950 text-slate-400 dark:text-slate-600 rounded-2xl flex items-center justify-center mx-auto mb-5">
              <FaBoxOpen className="text-2xl" />
            </div>
            <h2 className="text-xl font-black text-slate-800 dark:text-white tracking-tight">
              No orders found
            </h2>
            <p className="text-slate-500 dark:text-slate-400 mt-2 text-sm max-w-sm mx-auto leading-relaxed">
              You haven't placed any grocery or household orders yet. Fill your basket to get started!
            </p>
            <button
              onClick={() => navigate("/products")}
              className="mt-6 w-full sm:w-auto bg-[#0c831f] hover:bg-[#096b19] dark:bg-emerald-600 dark:hover:bg-emerald-500 text-white font-black text-sm px-6 py-3 rounded-xl shadow-sm transition-all active:scale-95"
            >
              Start Shopping
            </button>
          </div>
        ) : (
          /* MASTER ORDERS FEED LIST */
          <div className="space-y-8">
            {orders.map((order) => {
              const stamp = formatOrderTimestamp(order);
              return (
                <div
                  key={order._id}
                  className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800/80 rounded-2xl shadow-sm overflow-hidden transition-all"
                >
                  
                  {/* SECTION 1: COMPACT ACTION BAR SUMMARY METRICS */}
                  <div className="bg-slate-50 dark:bg-slate-950 px-6 py-5 border-b border-slate-200 dark:border-slate-800/80 grid grid-cols-2 md:grid-cols-5 gap-4 text-xs">
                    
                    {/* METRIC CARD: INVOICE ID */}
                    <div>
                      <span className="font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider flex items-center gap-1.5 mb-1">
                        <FaReceipt /> Order ID
                      </span>
                      <span className="font-mono text-sm font-black text-slate-700 dark:text-slate-300 block select-all break-all pr-2">
                        #{order._id.slice(-8).toUpperCase()}
                      </span>
                    </div>

                    {/* NEW METRIC CARD: PLACED TIME/DATE EMBED */}
                    <div>
                      <span className="font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider flex items-center gap-1.5 mb-1">
                        <FaCalendarAlt /> Placed On
                      </span>
                      <span className="text-sm font-black text-slate-700 dark:text-slate-300 block">
                        {stamp.date}
                      </span>
                      <span className="text-[11px] font-semibold text-slate-400 dark:text-slate-500 flex items-center gap-1 mt-0.5">
                        <FaClock className="text-[10px]" /> {stamp.time}
                      </span>
                    </div>

                    {/* METRIC CARD: SYSTEM FULFILLMENT CONDITIONS */}
                    <div>
                      <span className="font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider flex items-center gap-1.5 mb-1.5">
                        Fulfillment
                      </span>
                      <span
                        className={`inline-flex items-center font-bold px-2.5 py-0.5 rounded-md text-[11px] uppercase tracking-wide shadow-sm ${
                          order.orderStatus === "Delivered"
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-950/30 dark:text-emerald-400 dark:border-emerald-900/50"
                            : order.orderStatus === "Cancelled"
                            ? "bg-rose-50 text-rose-700 border border-rose-200 dark:bg-rose-950/30 dark:text-rose-400 dark:border-rose-900/50"
                            : "bg-amber-50 text-amber-700 border border-amber-200 dark:bg-amber-950/30 dark:text-amber-400 dark:border-amber-900/50"
                        }`}
                      >
                        {order.orderStatus || "Processing"}
                      </span>
                    </div>

                    {/* METRIC CARD: BILLING TYPE METHODOLOGY */}
                    <div>
                      <span className="font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider flex items-center gap-1.5 mb-1">
                        <FaCreditCard /> Payment
                      </span>
                      <span className="text-sm font-bold text-slate-700 dark:text-slate-300 block mt-0.5">
                        {order.paymentMethod || "Online Payment"}
                      </span>
                    </div>

                    {/* METRIC CARD: TOTAL GROSS PAYOUT VALUE */}
                    <div className="text-right col-span-1">
                      <span className="font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block mb-1">
                        Total Amount
                      </span>
                      <span className="text-base font-black text-[#0c831f] dark:text-emerald-400 block">
                        ₹{order.totalAmount}
                      </span>
                    </div>
                  </div>

                  {/* SECTION 2: NESTED REPEAT LINE ITEMS CARD LAYOUT */}
                  <div className="p-6 divide-y divide-slate-100 dark:divide-slate-800/60">
                    <h3 className="text-xs font-black uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-4 block">
                      Items Profile
                    </h3>
                    
                    <div className="space-y-4">
                      {order.items?.map((item, index) => (
                        <div
                          key={index}
                          onClick={() => navigate(`/products/${item.product}`)}
                          className="flex items-center gap-4 pt-4 first:pt-0 group cursor-pointer"
                        >
                          
                          {/* PRODUCT MINI AVATAR CONTAINER */}
                          <div className="w-16 h-16 sm:w-20 sm:h-20 bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 rounded-xl p-1.5 flex items-center justify-center shrink-0 group-hover:border-[#0c831f] dark:group-hover:border-emerald-500 transition-all">
                            <img
                              src={item.image || "https://via.placeholder.com/120"}
                              alt={item.name}
                              className="max-w-full max-h-full object-contain"
                            />
                          </div>

                          {/* EXPANDABLE PRODUCT TEXT DESCRIPTION FIELDS */}
                          <div className="flex-1 min-w-0 flex flex-col md:flex-row md:items-center justify-between gap-2">
                            <div className="min-w-0">
                              <h4 className="font-bold text-sm text-slate-900 dark:text-white truncate group-hover:text-[#0c831f] dark:group-hover:text-emerald-400 transition-colors">
                                {item.name}
                              </h4>
                              
                              <div className="flex flex-wrap items-center gap-2 mt-1 text-[11px]">
                                {item.variantSize && (
                                  <span className="font-bold text-slate-500 dark:text-slate-400">
                                    Size: <span className="text-slate-700 dark:text-slate-300 font-black">{item.variantSize}</span>
                                  </span>
                                )}
                                <span className="text-slate-300 dark:text-slate-700">•</span>
                                <span className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 px-2 py-0.5 rounded font-bold">
                                  Qty: {item.quantity}
                                </span>
                                <span className="text-slate-300 dark:text-slate-700">•</span>
                                <span className="font-semibold text-slate-500">
                                  Unit: ₹{item.price}
                                </span>
                              </div>
                            </div>

                            {/* SUB-TOTAL VALUE INDICATOR LABELS */}
                            <div className="flex items-center justify-between md:justify-end gap-6 border-t md:border-t-0 border-slate-50 dark:border-slate-800/40 pt-1.5 md:pt-0">
                              <div className="text-left md:text-right">
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider hidden md:block">Subtotal</p>
                                <p className="font-extrabold text-sm text-slate-900 dark:text-slate-100 md:mt-0.5">
                                  ₹{item.price * item.quantity}
                                </p>
                              </div>

                              {/* INLINE LINK DISPATCHER ACTIONS BUTTON */}
                              <div className="text-slate-400 group-hover:text-[#0c831f] dark:group-hover:text-emerald-400 transition-transform group-hover:translate-x-1 p-1">
                                <FaChevronRight className="text-xs" />
                              </div>
                            </div>

                          </div>
                        </div>
                      ))}
                    </div>

                  </div>

                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Orders;