/* eslint-disable react-hooks/set-state-in-effect */
import { useEffect, useState } from "react";
import { 
  ShoppingBag, 
  User, 
  Mail, 
  Phone, 
  CreditCard, 
  Calendar, 
  Package, 
  CheckCircle, 
  XCircle, 
  Truck, 
  Clock,
  Inbox
} from "lucide-react";
import api from "../services/api";

export default function Order() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await api.get("/orders");
      setOrders(Array.isArray(res.data?.orders) ? res.data.orders : []);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // Helper function to return beautiful, accessible semantic badges for order tracking status
  const getStatusBadge = (status) => {
    switch (status) {
      case "Delivered":
        return "bg-emerald-50 text-emerald-700 border border-emerald-200";
      case "Cancelled":
        return "bg-rose-50 text-rose-700 border border-rose-200";
      case "Shipped":
        return "bg-sky-50 text-sky-700 border border-sky-200";
      default:
        return "bg-amber-50 text-amber-700 border border-amber-200";
    }
  };

  return (
    <div className="p-4 md:p-8 bg-slate-50 dark:bg-slate-900 min-h-screen text-slate-800 dark:text-slate-100 font-poppins space-y-6">
      
      {/* ========================================================
          HEADER HERO SECTION
         ======================================================== */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2.5">
            <ShoppingBag className="text-indigo-600" size={26} />
            <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-white tracking-wide uppercase">
              Order Ledger
            </h1>
          </div>
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mt-1">
            Analyze and monitor incoming customer fulfillments
          </p>
        </div>

        {/* Dynamic Metric Display Badge Counter */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 px-5 py-3 rounded-2xl shadow-sm flex items-center gap-4 self-start sm:self-auto">
          <div className="h-10 w-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600 shrink-0">
            <Package size={20} />
          </div>
          <div>
            <span className="block text-[10px] font-black tracking-widest uppercase text-slate-400">Total Pipeline</span>
            <span className="text-2xl font-black text-slate-900 dark:text-white leading-none">{orders.length}</span>
          </div>
        </div>
      </div>

      {/* ========================================================
          DESKTOP MANAGEMENT MATRIX TABLE VIEW
         ======================================================== */}
      {loading ? (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-12 rounded-2xl text-center shadow-sm flex flex-col items-center justify-center gap-3">
          <div className="animate-spin text-indigo-600 rounded-full h-8 w-8 border-2 border-indigo-600 border-t-transparent" />
          <span className="text-xs font-extrabold uppercase tracking-widest text-slate-400">Fetching System Invoices...</span>
        </div>
      ) : (
        <div className="hidden lg:block bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm rounded-2xl overflow-hidden">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-900/70 border-b border-slate-200 dark:border-slate-800 text-slate-400 text-[11px] font-black uppercase tracking-widest">
                <th className="p-4 pl-6">Order Identity</th>
                <th className="p-4">Customer Credentials</th>
                <th className="p-4 w-1/3">Products Catalog Summary</th>
                <th className="p-4">Total Value</th>
                <th className="p-4">Settlement</th>
                <th className="p-4 pr-6 text-center">Fulfillment Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm font-semibold text-slate-700 dark:text-slate-300">
              {orders.length === 0 ? (
                <tr>
                  <td colSpan="6" className="p-12 text-center text-slate-400 uppercase tracking-widest font-bold text-xs bg-white dark:bg-slate-900">
                    <Inbox className="mx-auto text-slate-300 mb-2" size={32} />
                    No orders documented inside the ecosystem.
                  </td>
                </tr>
              ) : (
                orders.map((order) => (
                  <tr key={order._id} className="hover:bg-slate-700 dark:bg-slate-900/50 transition-colors group">
                    
                    {/* Order ID & Meta Timestamp Data */}
                    <td className="p-4 pl-6">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-indigo-600 group-hover:underline cursor-pointer bg-indigo-50/50 px-2 py-1 rounded-md">
                          #{order._id.slice(-6).toUpperCase()}
                        </span>
                      </div>
                      <div className="flex items-center gap-1 text-xs text-slate-400 mt-1.5 font-medium">
                        <Calendar size={12} />
                        <span>{new Date(order.createdAt).toLocaleDateString("en-IN", { day: '2-digit', month: 'short', year: 'numeric' })}</span>
                      </div>
                    </td>

                    {/* Customer Account Target */}
                    <td className="p-4 space-y-0.5">
                      <div className="flex items-center gap-1.5 text-slate-900 dark:text-white font-bold text-sm">
                        <User size={14} className="text-slate-400" />
                        <span>{order.shippingAddress?.firstName} {order.shippingAddress?.lastName}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-xs text-slate-400 font-medium">
                        <Mail size={12} />
                        <span className="truncate max-w-[160px]">{order.shippingAddress?.email}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-xs text-slate-400 font-medium">
                        <Phone size={12} />
                        <span>{order.shippingAddress?.phone}</span>
                      </div>
                    </td>

                    {/* Products Line Items */}
                    <td className="p-4">
                      <div className="space-y-2">
                        {order.items?.slice(0, 2).map((item, index) => (
                          <div key={index} className="flex items-center gap-3 bg-slate-50 dark:bg-slate-900/80 p-1.5 rounded-xl border border-slate-100 dark:border-slate-800">
                            <img
                              src={item.image || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c"}
                              alt={item.name}
                              className="w-10 h-10 rounded-lg object-cover border bg-white dark:bg-slate-900"
                            />
                            <div className="min-w-0 flex-1">
                              <p className="font-bold text-xs text-slate-900 dark:text-white truncate">{item.name}</p>
                              <p className="text-[10px] text-slate-400 uppercase tracking-wider font-extrabold mt-0.5">
                                Unit Count: <span className="text-slate-700 dark:text-slate-300">{item.quantity}</span>
                              </p>
                            </div>
                          </div>
                        ))}

                        {order.items?.length > 2 && (
                          <p className="text-[10px] font-extrabold text-indigo-600 uppercase tracking-widest pl-2">
                            + {order.items.length - 2} Additional line item{order.items.length - 2 > 1 ? 's' : ''}
                          </p>
                        )}
                      </div>
                    </td>

                    {/* Financial Summary */}
                    <td className="p-4 font-extrabold text-base text-slate-900 dark:text-white">
                      ₹{order.totalAmount?.toLocaleString("en-IN")}
                    </td>

                    {/* Payment Operations State */}
                    <td className="p-4 space-y-1">
                      <div className="flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400 font-medium">
                        <CreditCard size={12} className="text-slate-400" />
                        <span>{order.paymentMethod}</span>
                      </div>
                      <span className={`inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-wider ${ order.paymentStatus === "Paid" ? "text-emerald-600" : "text-rose-600" }`}>
                        <span className={`h-1.5 w-1.5 rounded-full ${order.paymentStatus === "Paid" ? "bg-emerald-500" : "bg-rose-500"}`} />
                        {order.paymentStatus}
                      </span>
                    </td>

                    {/* Fulfillment Progress Status badge */}
                    <td className="p-4 pr-6 text-center">
                      <span className={`inline-block px-3 py-1 rounded-full text-xs font-extrabold tracking-wide uppercase ${getStatusBadge(order.orderStatus)}`}>
                        {order.orderStatus}
                      </span>
                    </td>

                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* ========================================================
          RESPONSIVE MOBILE VIEW STACK INTERFACE
         ======================================================== */}
      {!loading && (
        <div className="lg:hidden space-y-4">
          {orders.length === 0 ? (
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-8 text-center text-slate-400 font-bold uppercase tracking-widest text-xs">
              No orders documented inside the ecosystem.
            </div>
          ) : (
            orders.map((order) => (
              <div key={order._id} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm space-y-4">
                
                {/* Header Metadata Section */}
                <div className="flex justify-between items-start border-b border-slate-100 dark:border-slate-800 pb-3">
                  <div>
                    <span className="font-mono text-xs font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">
                      #{order._id.slice(-6).toUpperCase()}
                    </span>
                    <p className="text-slate-900 dark:text-white font-extrabold text-base mt-1.5">
                      {order.shippingAddress?.firstName} {order.shippingAddress?.lastName}
                    </p>
                  </div>
                  <span className={`px-2.5 py-1 rounded-full text-[10px] font-black tracking-wider uppercase ${getStatusBadge(order.orderStatus)}`}>
                    {order.orderStatus}
                  </span>
                </div>

                {/* Segment Items Mapping List */}
                <div className="space-y-2.5">
                  {order.items?.map((item, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <img
                        src={item.image || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c"}
                        alt={item.name}
                        className="w-12 h-12 rounded-xl object-cover border shrink-0 bg-slate-50 dark:bg-slate-900"
                      />
                      <div className="min-w-0 flex-1">
                        <p className="font-semibold text-slate-900 dark:text-white text-sm truncate">{item.name}</p>
                        <p className="text-xs text-slate-400 font-medium mt-0.5">Quantity Order: {item.quantity}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Footer Dynamic Matrix Metrics Block */}
                <div className="border-t border-slate-100 dark:border-slate-800 pt-3 flex items-center justify-between bg-slate-50 dark:bg-slate-900/70 -mx-5 -mb-5 p-4 rounded-b-2xl">
                  <div>
                    <span className="block text-[9px] font-black tracking-widest uppercase text-slate-400">Total Remittance</span>
                    <span className="text-lg font-black text-slate-900 dark:text-white">₹{order.totalAmount?.toLocaleString("en-IN")}</span>
                  </div>
                  <div className="text-right">
                    <span className="block text-[9px] font-black tracking-widest uppercase text-slate-400">Method & Settlement</span>
                    <p className="text-xs font-bold text-slate-700 dark:text-slate-300 mt-0.5">
                      {order.paymentMethod} • <span className={order.paymentStatus === "Paid" ? "text-emerald-600" : "text-rose-500"}>{order.paymentStatus}</span>
                    </p>
                  </div>
                </div>

              </div>
            ))
          )}
        </div>
      )}

    </div>
  );
}