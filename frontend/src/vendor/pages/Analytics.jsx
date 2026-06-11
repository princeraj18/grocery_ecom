import { useEffect, useState, useMemo } from "react";
import api from "../api/api";
import Sidebar from "../components/Sidebar"; 
import { Menu, X, Package, TrendingUp, BarChart3, LineChart } from "lucide-react";
import { ResponsiveContainer, LineChart as ReLineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, BarChart as ReBarChart, Bar } from "recharts";

export default function Analytics() {
  const [analytics, setAnalytics] = useState({
    totalRevenue: 0,
    totalOrders: 0,
    totalProducts: 0,
    totalCustomers: 0,
    orders: [],
    products: [],
    users: [],
  });

  const [loading, setLoading] = useState(true);

  // MOBILE SIDEBAR NAVIGATION CONTROL ENGINE STATE
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // ======================================
  // FETCH ANALYTICS
  // ======================================
  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const token = localStorage.getItem("vendorToken");
        const { data } = await api.get("/vendor/analytics", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setAnalytics({
          totalRevenue: data.analytics?.totalRevenue || 0,
          totalOrders: data.analytics?.totalOrders || 0,
          totalProducts: data.analytics?.totalProducts || 0,
          totalCustomers: data.analytics?.totalCustomers || 0,
          orders: data.orders || [],
          products: data.products || [],
          users: data.users || [],
        });
      } catch (error) {
        console.log("ANALYTICS ERROR:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  // ======================================
  // DATA TRANSFORMATIONS FOR GRAPHS
  // ======================================
  
  // 1. Line Chart: Mapping recent orders into timeline metrics
  const orderTrendsData = useMemo(() => {
    if (!analytics.orders || analytics.orders.length === 0) return [];
    
    // Grouping last 6 orders chronologically for readable trend progression
    return [...analytics.orders]
      .slice(0, 6)
      .reverse()
      .map((order) => ({
        id: `#${order._id?.slice(-4).toUpperCase()}`,
        "Amount (₹)": order.totalAmount || 0,
        "Status Code": order.orderStatus === "Delivered" ? 100 : 50,
      }));
  }, [analytics.orders]);

  // 2. Bar Chart: Product inventory inventory health (Price vs Stock Volume)
  const productPerformanceData = useMemo(() => {
    if (!analytics.products || analytics.products.length === 0) return [];
    
    return analytics.products.slice(0, 5).map((product) => ({
      name: product.name.length > 12 ? `${product.name.slice(0, 12)}...` : product.name,
      "Price (₹)": product.price || 0,
      "Stock Count": product.stock || 0,
    }));
  }, [analytics.products]);

  const stats = [
    {
      title: "Total Revenue",
      value: `₹${analytics.totalRevenue.toLocaleString("en-IN")}`,
      color: "from-slate-900 to-slate-800 border border-slate-700/30",
    },
    {
      title: "Total Orders",
      value: analytics.totalOrders,
      color: "from-blue-600 to-blue-700 shadow-blue-500/10",
    },
    {
      title: "Total Products",
      value: analytics.totalProducts,
      color: "from-emerald-600 to-emerald-700 shadow-emerald-500/10",
    },
    {
      title: "Total Customers",
      value: analytics.totalCustomers,
      color: "from-violet-600 to-violet-700 shadow-violet-500/10",
    },
  ];

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-slate-50 dark:bg-slate-900 font-poppins text-slate-800 dark:text-slate-100">
      
      {/* 1. DESKTOP PERMANENT FIXED SIDEBAR */}
      <div className="hidden lg:block w-64 h-full flex-shrink-0 border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
        <Sidebar />
      </div>

      {/* 2. MOBILE OVERLAY BACKDROP */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs z-50 lg:hidden transition-opacity duration-300"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* 3. MOBILE SLIDE-OUT DRAWER */}
      <div
        className={`fixed top-0 left-0 z-50 h-screen w-64 transform transition-transform duration-300 ease-in-out lg:hidden bg-white dark:bg-slate-900 ${ sidebarOpen ? "translate-x-0" : "-translate-x-full" }`}
      >
        <Sidebar />
      </div>

      {/* ======================================
          MAIN SCROLLABLE CONTENT VIEWPORT
      ====================================== */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        
        {/* MOBILE TOP CONTROLLER STRIP */}
        <div className="sticky top-0 z-30 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800/80 px-4 py-3 flex items-center lg:hidden flex-shrink-0">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 text-slate-600 dark:text-slate-400 hover:bg-slate-100 rounded-xl transition"
          >
            {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
          <span className="ml-3 font-bold text-slate-800 dark:text-slate-100 tracking-wide text-sm uppercase">
            Workspace Hub
          </span>
        </div>

        {/* INDEPENDENT INNER SCROLL FIELD */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-8 max-w-7xl w-full mx-auto">
          
          {/* DASHBOARD PROFILE HEADER BLOCK */}
          <div className="mb-8">
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
              Vendor Analytics
            </h1>
            <p className="text-slate-500 dark:text-slate-400 mt-1.5 text-xs sm:text-sm font-medium">
              Real-time synchronization context for metrics, item velocities, and client distribution.
            </p>
          </div>

          {loading ? (
            <div className="flex flex-col justify-center items-center h-[50vh] gap-3">
              <div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
              <div className="text-sm font-bold text-slate-400 tracking-widest uppercase animate-pulse">
                Parsing System Manifest...
              </div>
            </div>
          ) : (
            <>
              {/* METRIC INDEX COUNTERS */}
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 mb-8">
                {stats.map((item, index) => (
                  <div
                    key={index}
                    className={`bg-gradient-to-br ${item.color} text-white rounded-2xl p-6 shadow-md hover:translate-y-[-2px] transition-all duration-200`}
                  >
                    <p className="text-xs font-bold uppercase tracking-widest text-white/75">
                      {item.title}
                    </p>
                    <h2 className="text-2xl sm:text-3xl font-black mt-4 tracking-tight break-words">
                      {item.value}
                    </h2>
                  </div>
                ))}
              </div>

              {/* ======================================
                  VISUAL ANALYTICS GRAPH GRID
              ====================================== */}
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-8">
                
                {/* LINE GRAPH: TRANSACTION VELOCITY */}
                <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800/80 shadow-xs p-4 sm:p-6">
                  <div className="mb-4">
                    <h2 className="text-base font-bold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
                      <LineChart size={18} className="text-blue-500" /> Revenue Stream Inbound Trend
                    </h2>
                    <p className="text-xs text-slate-400 font-medium">Chronological volume timeline of recent receipts.</p>
                  </div>
                  <div className="h-64 w-full text-xs">
                    {orderTrendsData.length > 0 ? (
                      <ResponsiveContainer width="100%" h="100%">
                        <ReLineChart data={orderTrendsData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                          <XAxis dataKey="id" stroke="#94a3b8" />
                          <YAxis stroke="#94a3b8" />
                          <Tooltip contentStyle={{ background: "#0f172a", borderRadius: "12px", color: "#fff", fontSize: "11px" }} />
                          <Legend />
                          <Line type="monotone" dataKey="Amount (₹)" stroke="#2563eb" strokeWidth={3} activeDot={{ r: 6 }} />
                        </ReLineChart>
                      </ResponsiveContainer>
                    ) : (
                      <div className="h-full flex items-center justify-center text-slate-400">Insufficient transaction data to build mapping metrics.</div>
                    )}
                  </div>
                </div>

                {/* BAR GRAPH: STOCK VALUE BALANCE MATRIX */}
                <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800/80 shadow-xs p-4 sm:p-6">
                  <div className="mb-4">
                    <h2 className="text-base font-bold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
                      <BarChart3 size={18} className="text-emerald-500" /> Stock Volume vs Value Breakdown
                    </h2>
                    <p className="text-xs text-slate-400 font-medium">Correlation matrix displaying top inventory pricing structures.</p>
                  </div>
                  <div className="h-64 w-full text-xs">
                    {productPerformanceData.length > 0 ? (
                      <ResponsiveContainer width="100%" h="100%">
                        <ReBarChart data={productPerformanceData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                          <XAxis dataKey="name" stroke="#94a3b8" />
                          <YAxis stroke="#94a3b8" />
                          <Tooltip contentStyle={{ background: "#0f172a", borderRadius: "12px", color: "#fff", fontSize: "11px" }} />
                          <Legend />
                          <Bar dataKey="Price (₹)" fill="#10b981" radius={[4, 4, 0, 0]} />
                          <Bar dataKey="Stock Count" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
                        </ReBarChart>
                      </ResponsiveContainer>
                    ) : (
                      <div className="h-full flex items-center justify-center text-slate-400">Insufficient stock registry context found.</div>
                    )}
                  </div>
                </div>

              </div>

              {/* RECENT INBOUND TRANSACTION ORDERS TABLE */}
              <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800/80 shadow-xs p-4 sm:p-6 mb-8">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                  <div>
                    <h2 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight">
                      Recent Ledger Activities
                    </h2>
                    <p className="text-xs text-slate-400 font-medium mt-0.5">
                      Last 6 processing order tickets captured downstream.
                    </p>
                  </div>
                  <span className="bg-slate-100 border border-slate-200 dark:border-slate-800/60 px-4 py-1.5 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-400 w-fit uppercase tracking-wider">
                    {analytics.orders.length} Total Receipts
                  </span>
                </div>

                {/* MOBILE COMPACT ORDER MATRIX */}
                <div className="block lg:hidden space-y-4">
                  {analytics.orders?.slice(0, 6).map((order) => (
                    <div key={order._id} className="border border-slate-200 dark:border-slate-800 rounded-xl p-4 bg-slate-50 dark:bg-slate-900/50">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="font-bold text-slate-700 dark:text-slate-300 text-sm">
                          #{order._id?.slice(-6).toUpperCase()}
                        </h3>
                        <span
                          className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider ${
                            order.orderStatus === "Delivered"
                              ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400"
                              : order.orderStatus === "Cancelled"
                                ? "bg-rose-100 text-rose-700 dark:bg-rose-950/40 dark:text-rose-400"
                                : "bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400"
                          }`}
                        >
                          {order.orderStatus}
                        </span>
                      </div>
                      <div className="space-y-1 text-xs text-slate-500 dark:text-slate-400 font-medium">
                        <p>Client: <span className="text-slate-800 dark:text-slate-100 font-semibold">{order?.shippingAddress?.firstName} {order?.shippingAddress?.lastName}</span></p>
                        <p>Gateway: <span className="text-slate-700 dark:text-slate-300 uppercase font-semibold">{order.paymentMethod}</span></p>
                      </div>
                      <p className="text-emerald-600 font-black text-sm mt-3">
                        ₹{order.totalAmount.toLocaleString("en-IN")}
                      </p>
                    </div>
                  ))}
                </div>

                {/* DESKTOP MATRIX SYSTEM LAYER */}
                <div className="hidden lg:block overflow-x-auto">
                  <table className="w-full min-w-[800px]">
                    <thead>
                      <tr className="bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 text-[11px] font-bold uppercase tracking-wider">
                        <th className="p-4 text-left rounded-l-xl">Receipt Key</th>
                        <th className="p-4 text-left">Purchaser Client</th>
                        <th className="p-4 text-left">Processing Method</th>
                        <th className="p-4 text-left">Net Remittance</th>
                        <th className="p-4 text-left rounded-r-xl">Execution Context</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-xs font-medium text-slate-600 dark:text-slate-400">
                      {analytics.orders?.slice(0, 6).map((order) => (
                        <tr key={order._id} className="hover:bg-slate-50 dark:bg-slate-900/80 transition duration-150">
                          <td className="p-4 font-bold text-slate-900 dark:text-white">
                            #{order._id?.slice(-6).toUpperCase()}
                          </td>
                          <td className="p-4 font-semibold text-slate-700 dark:text-slate-300">
                            {order?.shippingAddress?.firstName} {order?.shippingAddress?.lastName}
                          </td>
                          <td className="p-4 uppercase tracking-wide text-[10px] font-bold text-slate-500 dark:text-slate-400">
                            {order.paymentMethod}
                          </td>
                          <td className="p-4 font-bold text-slate-900 dark:text-white text-sm">
                            ₹{order.totalAmount.toLocaleString("en-IN")}
                          </td>
                          <td className="p-4">
                            <span
                              className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider ${
                                order.orderStatus === "Delivered"
                                  ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400"
                                  : order.orderStatus === "Cancelled"
                                    ? "bg-rose-100 text-rose-700 dark:bg-rose-950/40 dark:text-rose-400"
                                    : "bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400"
                              }`}
                            >
                              {order.orderStatus}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* BOTTOM DUAL MODULE GRID SPLIT */}
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                
                {/* VELOCITY METRIC CARD (TOP PRODUCTS) */}
                <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800/80 shadow-xs p-4 sm:p-6">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h2 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
                        <Package size={18} className="text-emerald-500" /> High-Velocity Inventory
                      </h2>
                      <p className="text-xs text-slate-400 font-medium mt-0.5">Top stock items moving out of storage.</p>
                    </div>
                  </div>
                  <div className="space-y-3">
                    {analytics.products?.slice(0, 4).map((product, idx) => (
                      <div key={idx} className="flex items-center justify-between p-3 border border-slate-100 dark:border-slate-800 rounded-xl bg-slate-50 dark:bg-slate-900/50 hover:bg-slate-50 dark:bg-slate-900 transition">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center font-bold text-xs">
                            0{idx + 1}
                          </div>
                          <div>
                            <h4 className="text-xs font-bold text-slate-800 dark:text-slate-100 line-clamp-1">{product.name}</h4>
                            <p className="text-[10px] text-slate-400 font-medium mt-0.5">Stock Remaining: {product.stock}</p>
                          </div>
                        </div>
                        <span className="text-xs font-black text-slate-900 dark:text-white">₹{product.price}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* USER VELOCITY AND IDENTITY ROSTER */}
                <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800/80 shadow-xs p-4 sm:p-6">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h2 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
                        <TrendingUp size={18} className="text-violet-500" /> Active Consumer Pipeline
                      </h2>
                      <p className="text-xs text-slate-400 font-medium mt-0.5">Client profiles dispatching purchases.</p>
                    </div>
                    <span className="bg-violet-100 text-violet-700 border border-violet-200/20 px-3 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider">
                      {analytics.totalCustomers} Accounts
                    </span>
                  </div>

                  <div className="space-y-4">
                    {analytics.orders?.slice(0, 4).map((order, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between border border-slate-100 dark:border-slate-800 rounded-xl p-3 bg-slate-50 dark:bg-slate-900/50 hover:shadow-xs transition"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl bg-slate-900 text-white flex items-center justify-center font-bold text-xs tracking-wide uppercase shadow-xs">
                            {order?.shippingAddress?.firstName?.charAt(0) || "C"}
                          </div>
                          <div>
                            <h3 className="text-xs font-bold text-slate-800 dark:text-slate-100">
                              {order?.shippingAddress?.firstName} {order?.shippingAddress?.lastName}
                            </h3>
                            <p className="text-[10px] text-slate-400 font-medium truncate max-w-[180px] sm:max-w-xs mt-0.5">
                              {order?.shippingAddress?.email || "no-email@shopease.com"}
                            </p>
                          </div>
                        </div>
                        <span className="text-[10px] bg-slate-100 border border-slate-200 dark:border-slate-800/60 px-2.5 py-1 rounded-lg font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                          Purchaser
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
