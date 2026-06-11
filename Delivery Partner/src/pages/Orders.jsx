import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { 
  MapPin, 
  Phone, 
  ShoppingBag, 
  CreditCard, 
  CheckCircle2, 
  Truck,
  IndianRupee,
  Clock,
  CheckSquare,
  ChevronRight,
  TrendingUp
} from "lucide-react";

export default function Orders() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("all"); 

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem("deliveryToken");
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
      console.log("Error fetching orders:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAcceptOrder = async (e, orderId) => {
    e.stopPropagation();
    try {
      const token = localStorage.getItem("deliveryToken");
      await axios.put(
        "http://localhost:5000/api/delivery-partners/respond-order",
        { orderId, action: "accept" },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      fetchOrders();
    } catch (error) {
      console.log(error);
    }
  };

  const handleRejectOrder = async (e, orderId) => {
    e.stopPropagation();
    try {
      const token = localStorage.getItem("deliveryToken");
      await axios.put(
        "http://localhost:5000/api/delivery-partners/respond-order",
        { orderId, action: "reject" },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      fetchOrders();
    } catch (error) {
      console.log(error);
    }
  };

  // Derived dashboard metrics
  const totalEarnings = orders
    .filter(o => o.deliveryStatus === "Delivered")
    .reduce((sum, current) => sum + (Number(current.partnerEarning) || 0), 0);

  const activeCount = orders.filter(o => o.deliveryStatus !== "Delivered").length;
  const completedCount = orders.filter(o => o.deliveryStatus === "Delivered").length;

  const filteredOrders = orders.filter((order) => {
    if (activeTab === "pending") {
      return order.deliveryStatus === "Assigned" || order.deliveryStatus === "Accepted";
    }
    if (activeTab === "completed") {
      return order.deliveryStatus === "Delivered";
    }
    return true;
  });

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse p-4 sm:p-6 lg:p-8 max-w-6xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-24 bg-white dark:bg-slate-900 border border-gray-100 rounded-2xl" />
          ))}
        </div>
        <div className="h-40 bg-white dark:bg-slate-900 border border-gray-100 rounded-2xl" />
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 dark:bg-slate-900/20 lg:p-8 max-w-6xl mx-auto space-y-8 font-poppins bg-gray-50/30 min-h-screen pb-24 md:pb-8">
      
      {/* Dashboard Section Welcome Header */}
      <div>
        <h1 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white uppercase tracking-wider">
          Partner Fleet Dashboard
        </h1>
        <p className="text-[10px] text-gray-400 dark:text-slate-500 dark:text-slate-400 font-bold uppercase tracking-widest mt-1">
          Real-time delivery assignments and operational stats
        </p>
      </div>

      {/* DASHBOARD METRICS COUNTER ROW */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        
        {/* Metric 1: Total Earnings */}
        <div 
          onClick={() => setActiveTab("all")}
          className={`p-5 rounded-2xl bg-white dark:bg-slate-900 border transition-all cursor-pointer ${ activeTab === "all" ? "border-emerald-500 shadow-sm ring-1 ring-emerald-500/10" : "border-gray-200 dark:border-slate-800/60 hover:border-gray-300 dark:border-slate-700" }`}
        >
          <div className="flex justify-between items-start">
            <div>
              <p className="text-[10px] font-bold text-gray-400 dark:text-slate-500 dark:text-slate-400 uppercase tracking-wider">Total Payout Balance</p>
              <h3 className="text-2xl font-black text-gray-900 dark:text-white mt-1">
                ₹{totalEarnings.toLocaleString("en-IN")}
              </h3>
            </div>
            <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-xl">
              <IndianRupee size={18} />
            </div>
          </div>
          <div className="flex items-center gap-1 text-[10px] text-emerald-600 font-bold uppercase tracking-wider mt-3">
            <TrendingUp size={12} />
            <span>All Assignments ({orders.length})</span>
          </div>
        </div>

        {/* Metric 2: Active Duties */}
        <div 
          onClick={() => setActiveTab("pending")}
          className={`p-5 rounded-2xl bg-white dark:bg-slate-900 border transition-all cursor-pointer ${ activeTab === "pending" ? "border-amber-500 shadow-sm ring-1 ring-amber-500/10" : "border-gray-200 dark:border-slate-800/60 hover:border-gray-300 dark:border-slate-700" }`}
        >
          <div className="flex justify-between items-start">
            <div>
              <p className="text-[10px] font-bold text-gray-400 dark:text-slate-500 dark:text-slate-400 uppercase tracking-wider">Active Duties</p>
              <h3 className="text-2xl font-black text-gray-900 dark:text-white mt-1">{activeCount}</h3>
            </div>
            <div className="p-2.5 bg-amber-50 text-amber-600 rounded-xl">
              <Clock size={18} />
            </div>
          </div>
          <p className="text-[10px] text-gray-400 dark:text-slate-500 dark:text-slate-400 font-medium mt-3 uppercase tracking-wider">
            {activeCount > 0 ? "⚠️ Shipments need attention" : "Ready for next pickup"}
          </p>
        </div>

        {/* Metric 3: Closed Logs */}
        <div 
          onClick={() => setActiveTab("completed")}
          className={`p-5 rounded-2xl bg-white dark:bg-slate-900 border transition-all cursor-pointer ${ activeTab === "completed" ? "border-blue-500 shadow-sm ring-1 ring-blue-500/10" : "border-gray-200 dark:border-slate-800/60 hover:border-gray-300 dark:border-slate-700" }`}
        >
          <div className="flex justify-between items-start">
            <div>
              <p className="text-[10px] font-bold text-gray-400 dark:text-slate-500 dark:text-slate-400 uppercase tracking-wider">Completed Trips</p>
              <h3 className="text-2xl font-black text-gray-900 dark:text-white mt-1">{completedCount}</h3>
            </div>
            <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl">
              <CheckSquare size={18} />
            </div>
          </div>
          <p className="text-[10px] text-emerald-600 font-bold mt-3 uppercase tracking-wider flex items-center gap-1">
            <CheckCircle2 size={11} /> Successful deliveries
          </p>
        </div>

      </div>

      {/* Main Section Header Title label */}
      <div className="pt-2 border-t border-gray-100">
        <h2 className="text-xs font-black uppercase text-gray-400 dark:text-slate-500 dark:text-slate-400 tracking-widest">
          Showing: {activeTab === "all" ? "All Shipments" : activeTab === "pending" ? "Active Tasks" : "Completed Orders"}
        </h2>
      </div>

      {/* Dashboard Manifest Feed Block Container */}
      <div className="space-y-4">
        {filteredOrders.length === 0 ? (
          <div className="bg-white dark:bg-slate-900 py-14 px-6 rounded-2xl border border-gray-200 dark:border-slate-800/60 text-center">
            <Truck className="mx-auto text-gray-300 mb-3 stroke-1" size={40} />
            <p className="text-xs font-bold text-gray-400 dark:text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              No matching records found
            </p>
            <p className="text-[11px] text-gray-400 dark:text-slate-500 dark:text-slate-400 mt-1">
              Select alternative metric overview indicators above to swap operational indices.
            </p>
          </div>
        ) : (
          filteredOrders.map((order) => (
            <div
              key={order._id}
              onClick={(e) => {
                if (e.target.closest("button") || e.target.closest("a")) return;
                navigate(`/delivery-map/${order._id}`);
              }}
              className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-gray-200 dark:border-slate-800/60 flex flex-col lg:flex-row lg:items-center justify-between gap-5 cursor-pointer hover:border-gray-300 dark:border-slate-700 transition-all duration-200"
            >
              
              {/* Manifest Left Block: Metadata Core */}
              <div className="space-y-3 flex-1 w-full lg:max-w-xl">
                <div className="flex items-center gap-3">
                  <span className="text-sm font-bold text-gray-900 dark:text-white tracking-wide">
                    #{order._id.slice(-6).toUpperCase()}
                  </span>
                  <span
                    className={`text-[9px] px-2.5 py-0.5 rounded font-bold uppercase tracking-wider border ${
                      order.deliveryStatus === "Delivered"
                        ? "bg-emerald-50 text-emerald-700 border-emerald-200/40 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-900/40"
                        : order.deliveryStatus === "Assigned"
                          ? "bg-orange-50 text-orange-700 border-orange-200/40 dark:bg-orange-950/40 dark:text-orange-400 dark:border-orange-900/40"
                          : "bg-blue-50 text-blue-700 border-blue-200/40 dark:bg-blue-950/40 dark:text-blue-400 dark:border-blue-900/40"
                    }`}
                  >
                    {order.deliveryStatus}
                  </span>
                </div>

                {/* Cargo breakdown descriptor array */}
                <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-slate-400 font-medium">
                  <ShoppingBag size={14} className="text-gray-400 dark:text-slate-500 dark:text-slate-400 shrink-0" />
                  <p className="line-clamp-1">
                    {order.items?.map((item) => `${item.quantity}x ${item.name}`).join(", ")}
                  </p>
                </div>

                {/* Consignee Shipping Address Block */}
                <div className="flex items-start gap-2 text-[11px] text-gray-500 dark:text-slate-400 leading-relaxed">
                  <MapPin size={14} className="text-gray-400 dark:text-slate-500 dark:text-slate-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-gray-700 dark:text-slate-300 block mb-0.5">
                      {order.shippingAddress?.firstName} {order.shippingAddress?.lastName}
                    </span>
                    <span className="line-clamp-1">
                      {order.shippingAddress?.street}, {order.shippingAddress?.city},{" "}
                      {order.shippingAddress?.state} - {order.shippingAddress?.zipcode}
                    </span>
                  </div>
                </div>
              </div>

              {/* Manifest Center Divider (Visible on Desktop Screen resolutions) */}
              <div className="hidden lg:block w-px h-12 bg-gray-100 dark:bg-slate-950" />

              {/* Manifest Middle Block: Payout info & Payment methods */}
              <div className="space-y-2 lg:w-44 text-left lg:text-right">
                <p className="text-[10px] font-bold text-gray-400 dark:text-slate-500 dark:text-slate-400 uppercase tracking-widest block leading-none">Payout Earnings</p>
                <span className="text-lg font-black text-emerald-600 block leading-none">
                  ₹{Number(order.partnerEarning || 0).toLocaleString("en-IN")}
                </span>

                <div className="flex lg:justify-end items-center gap-2 mt-1">
                  <div className="flex items-center gap-1 text-[11px] text-gray-500 dark:text-slate-400">
                    <CreditCard size={12} className="text-gray-400 dark:text-slate-500 dark:text-slate-400" />
                    <span className="font-medium text-[10px] uppercase">{order.paymentMethod}</span>
                  </div>
                  <span className={`text-[8px] px-1.5 py-0.5 rounded font-bold uppercase tracking-wide ${ order.paymentStatus === "Paid" ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700" }`}>
                    {order.paymentStatus}
                  </span>
                </div>
              </div>

              {/* Manifest Right Action Block: Dynamic UI workflow buttons */}
              <div className="w-full lg:w-auto flex items-center justify-between lg:justify-end gap-4 border-t lg:border-t-0 pt-4 lg:pt-0 border-gray-100 shrink-0">
                
                {/* Hot link Telephone anchor wrapper */}
                <a 
                  href={`tel:${order.shippingAddress?.phone}`}
                  onClick={(e) => e.stopPropagation()} 
                  className="flex lg:hidden items-center gap-1.5 text-[11px] text-emerald-600 font-bold bg-emerald-50 px-3 py-2 rounded-xl border border-emerald-100/60"
                >
                  <Phone size={12} />
                  <span>Call Client</span>
                </a>

                {/* Contextual workflow triggers */}
                <div>
                  {order.deliveryStatus === "Assigned" && (
                    <div className="flex gap-2">
                      <button
                        onClick={(e) => handleAcceptOrder(e, order._id)}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white text-[10px] font-bold uppercase tracking-wider px-4 py-2.5 rounded-xl transition-colors shadow-sm"
                      >
                        Accept
                      </button>
                      <button
                        onClick={(e) => handleRejectOrder(e, order._id)}
                        className="bg-white dark:bg-slate-900 hover:bg-gray-50 text-red-600 border border-gray-200 dark:border-slate-800 text-[10px] font-bold uppercase tracking-wider px-4 py-2.5 rounded-xl transition-colors"
                      >
                        Reject
                      </button>
                    </div>
                  )}

                  {order.deliveryStatus === "Accepted" && (
                    <button
                      onClick={() => navigate(`/delivery-map/${order._id}`)}
                      className="bg-blue-600 hover:bg-blue-700 text-white text-[10px] font-bold uppercase tracking-wider px-4 py-2.5 rounded-xl transition-colors shadow-sm flex items-center gap-1"
                    >
                      <span>Start Navigation</span>
                      <ChevronRight size={12} />
                    </button>
                  )}

                  {order.deliveryStatus === "Delivered" && (
                    <div className="flex items-center gap-1.5 text-emerald-600 text-xs font-bold uppercase tracking-wider bg-emerald-50/50 border border-emerald-100/60 px-3 py-1.5 rounded-xl">
                      <CheckCircle2 size={13} />
                      <span>Closed Task</span>
                    </div>
                  )}
                </div>

              </div>

            </div>
          ))
        )}
      </div>
    </div>
  );
}