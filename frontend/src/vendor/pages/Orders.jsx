import React, { useEffect, useState } from "react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import axios from "axios";
import { 
  Menu, 
  X, 
  User, 
  Mail, 
  MapPin, 
  Phone, 
  Package, 
  CreditCard, 
  Truck, 
  FileDown 
} from "lucide-react";

import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

export default function Orders() {
  // =========================================
  // STATES
  // =========================================
  const [orders, setOrders] = useState([]);
  const [partners, setPartners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // =========================================
  // FETCH ORDERS
  // =========================================
  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem("vendorToken");
      const { data } = await axios.get("http://localhost:5000/api/orders/vendor", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setOrders(data.orders || []);
    } catch (error) {
      console.error("FETCH ORDERS ERROR:", error);
    } finally {
      setLoading(false);
    }
  };

  // =========================================
  // FETCH DELIVERY PARTNERS
  // =========================================
  const fetchPartners = async () => {
    try {
      const token = localStorage.getItem("vendorToken");
      const { data } = await axios.get("http://localhost:5000/api/delivery-partners/all", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPartners(data.partners || []);
    } catch (error) {
      console.error("FETCH PARTNERS ERROR:", error);
    }
  };

  // =========================================
  // UPDATE ORDER STATUS
  // =========================================
  const updateStatus = async (orderId, status) => {
    try {
      const token = localStorage.getItem("vendorToken");
      await axios.put(
        `http://localhost:5000/api/orders/${orderId}`,
        { orderStatus: status },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchOrders();
    } catch (error) {
      console.error(error);
      alert("Failed to update order status");
    }
  };

  // =========================================
  // ASSIGN DELIVERY PARTNER
  // =========================================
  const assignPartner = async (orderId, partnerId) => {
    if (!partnerId) return;
    try {
      const token = localStorage.getItem("vendorToken");
      const { data } = await axios.put(
        "http://localhost:5000/api/orders/assign-delivery-partner",
        { orderId, deliveryPartnerId: partnerId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert(data.message || "Delivery Partner Assigned");
      fetchOrders();
    } catch (error) {
      console.error("ASSIGN PARTNER ERROR:", error);
      alert(error?.response?.data?.message || "Failed to assign partner");
    }
  };

  // =========================================
  // DOWNLOAD PDF
  // =========================================
  const downloadOrdersPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text("Vendor Orders Report", 14, 20);

    const tableData = [];
    orders.forEach((order) => {
      order.items.forEach((item) => {
        tableData.push([
          order._id.slice(-8),
          item.name,
          item.quantity,
          `₹${item.price}`,
          `₹${item.price * item.quantity}`,
          order.orderStatus,
          order.paymentStatus,
          order.user?.name || "N/A",
          order?.deliveryPartner?.name || "Not Assigned",
        ]);
      });
    });

    autoTable(doc, {
      startY: 30,
      head: [[
        "Order ID", "Product", "Qty", "Price", "Subtotal", 
        "Status", "Payment", "Customer", "Delivery Partner"
      ]],
      body: tableData,
      styles: { fontSize: 8 },
      headStyles: { fillColor: [0, 0, 0] },
    });

    doc.save("VendorOrders.pdf");
  };

  // =========================================
  // INITIAL LOAD
  // =========================================
  useEffect(() => {
    fetchOrders();
    fetchPartners();
  }, []);

  // Helper styles for status badges
  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "delivered": return "bg-green-100 text-green-700 dark:bg-green-950/40 dark:text-green-400";
      case "processing": return "bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400";
      case "shipped": return "bg-blue-100 text-blue-700 dark:bg-blue-950/40 dark:text-blue-400";
      case "out for delivery": return "bg-purple-100 text-purple-700 dark:bg-purple-950/40 dark:text-purple-400";
      case "cancelled": return "bg-red-100 text-red-700 dark:bg-red-950/40 dark:text-red-400";
      default: return "bg-gray-100 text-gray-700 dark:bg-slate-800 dark:text-slate-300";
    }
  };

  return (
    <div className="flex h-screen w-screen bg-gray-50 dark:bg-slate-950 overflow-hidden relative">
      
      {/* MOBILE SIDEBAR OVERLAY */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 lg:hidden transition-opacity"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* SIDEBAR WRAPPER */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 lg:z-0 lg:static w-64 h-full bg-white dark:bg-slate-900 border-r border-gray-200 dark:border-slate-800 transition-transform duration-300 ease-in-out ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}
      >
        <Sidebar />
      </aside>

      {/* MAIN CONTENT AREA */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
        
        {/* NAVBAR */}
        <header className="sticky top-0 z-30 bg-white dark:bg-slate-900 border-b border-gray-200 dark:border-slate-800 h-16 flex items-center px-4 justify-between">
          <div className="flex items-center gap-3 w-full">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden p-2 text-gray-600 dark:text-slate-400 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-lg transition"
              aria-label="Toggle Menu"
            >
              {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
            <div className="flex-1">
              <Navbar />
            </div>
          </div>
        </header>

        {/* INNER PAGE BODY */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
          
          {/* PAGE HEADER */}
          <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white tracking-tight">Orders</h1>
              <p className="text-gray-500 dark:text-slate-400 mt-1 text-sm">
                Manage vendor fulfillment streams and map tactical distribution routes.
              </p>
            </div>
            <button
              onClick={downloadOrdersPDF}
              className="inline-flex items-center justify-center gap-2 bg-gray-900 text-white dark:bg-white dark:text-slate-900 px-4 py-2.5 rounded-xl hover:bg-gray-800 dark:hover:bg-gray-100 active:scale-[0.98] transition font-medium text-sm shadow-sm"
            >
              <FileDown size={18} />
              Download Orders PDF
            </button>
          </div>

          {/* DYNAMIC VIEW CONTEXT */}
          {loading ? (
            <div className="flex flex-col gap-3 justify-center items-center h-[50vh]">
              <div className="w-10 h-10 border-4 border-gray-900 dark:border-white border-t-transparent rounded-full animate-spin" />
              <div className="text-lg font-medium text-gray-600 dark:text-slate-400 animate-pulse">Loading Orders...</div>
            </div>
          ) : orders.length === 0 ? (
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-200 dark:border-slate-800 p-12 text-center max-w-md mx-auto mt-12 shadow-sm">
              <div className="w-12 h-12 bg-gray-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400 dark:text-slate-500">
                <Package size={24} />
              </div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">No Orders Found</h2>
              <p className="text-gray-500 dark:text-slate-400 text-sm mt-1">There are currently no assigned vendor orders in your system.</p>
            </div>
          ) : (
            <div className="space-y-6 max-w-6xl">
              {orders.map((order) => (
                <div
                  key={order._id}
                  className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-200 dark:border-slate-800 shadow-sm hover:shadow-md transition duration-200 overflow-hidden"
                >
                  {/* CARD HEADER */}
                  <div className="bg-gray-50/70 dark:bg-slate-800/40 border-b border-gray-100 dark:border-slate-800 p-4 md:p-5 flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                    <div className="space-y-2">
                      <div>
                        <span className="text-xs font-semibold uppercase tracking-wider text-gray-400 dark:text-slate-500 block">Order ID</span>
                        <code className="text-sm font-mono text-gray-700 dark:text-slate-300 bg-gray-100 dark:bg-slate-950 px-2 py-0.5 rounded break-all">{order._id}</code>
                      </div>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1 text-sm text-gray-600 dark:text-slate-400 pt-1">
                        <span className="flex items-center gap-2"><User size={15} className="text-gray-400 dark:text-slate-500" /> {order.user?.name || "N/A"}</span>
                        <span className="flex items-center gap-2"><Mail size={15} className="text-gray-400 dark:text-slate-500" /> {order.user?.email || "N/A"}</span>
                      </div>
                    </div>

                    <div className="sm:text-right flex flex-row sm:flex-col justify-between sm:justify-start items-center sm:items-end gap-2 border-t sm:border-t-0 pt-3 sm:pt-0 border-gray-200 dark:border-slate-800">
                      <div>
                        <span className="text-xs text-gray-400 dark:text-slate-500 block sm:hidden">Total Amount</span>
                        <p className="text-xl md:text-2xl font-black text-gray-900 dark:text-white">₹{order.totalAmount}</p>
                      </div>
                      <div className="flex flex-col items-end gap-1">
                        <span className="text-xs text-gray-500 dark:text-slate-400 font-medium flex items-center gap-1">
                          <CreditCard size={13} /> {order.paymentMethod}
                        </span>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold ${order.paymentStatus === "Paid" ? "bg-green-100 text-green-800 dark:bg-green-950/40 dark:text-green-400" : "bg-red-100 text-red-800 dark:bg-red-950/40 dark:text-red-400"}`}>
                          {order.paymentStatus}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* PRODUCTS & DETAILS BODY */}
                  <div className="p-4 md:p-6 space-y-6">
                    {/* ITEMS LIST */}
                    <div>
                      <h3 className="font-bold text-gray-900 dark:text-white text-base mb-3 flex items-center gap-2">
                        <Package size={18} className="text-gray-500 dark:text-slate-400" /> Ordered Products
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {order.items.map((item, index) => (
                          <div key={index} className="flex gap-4 border border-gray-100 dark:border-slate-800 rounded-xl p-3 bg-white dark:bg-slate-900 hover:bg-gray-50 dark:hover:bg-slate-800/50 transition">
                            <img
                              src={item.image}
                              alt={item.name}
                              className="w-16 h-16 object-cover rounded-lg border border-gray-200 dark:border-slate-800 flex-shrink-0"
                            />
                            <div className="min-w-0 flex-1 flex flex-col justify-center">
                              <h4 className="font-semibold text-gray-900 dark:text-white text-sm truncate">{item.name}</h4>
                              <p className="text-xs text-gray-500 dark:text-slate-400 mt-0.5">Quantity: <span className="font-medium text-gray-700 dark:text-slate-300">{item.quantity}</span></p>
                              <p className="text-xs font-semibold text-gray-900 dark:text-white mt-1">₹{item.price}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* SHIPPING & DISPATCH CONTROLS GRID */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-gray-100 dark:border-slate-800">
                      
                      {/* ADDRESS BOX */}
                      <div className="bg-gray-50/50 dark:bg-slate-800/20 border border-gray-100 dark:border-slate-800 rounded-xl p-4">
                        <h3 className="font-bold text-gray-900 dark:text-white text-sm mb-2.5 flex items-center gap-2">
                          <MapPin size={16} className="text-gray-500 dark:text-slate-400" /> Shipping Address
                        </h3>
                        <div className="text-sm text-gray-600 dark:text-slate-400 space-y-1 font-medium">
                          <p className="text-gray-900 dark:text-white font-semibold">{order.shippingAddress?.firstName} {order.shippingAddress?.lastName}</p>
                          <p className="text-gray-500 dark:text-slate-400 text-xs">{order.shippingAddress?.street}, {order.shippingAddress?.city}</p>
                          <p className="text-xs flex items-center gap-1.5 text-gray-500 dark:text-slate-400 pt-1">
                            <Phone size={13} /> {order.shippingAddress?.phone}
                          </p>
                        </div>
                      </div>

                      {/* WORKFLOW STATUS & LOGISTICS MANAGEMENT */}
                      <div className="space-y-4 flex flex-col justify-between">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-xs font-bold text-gray-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">Order Status</label>
                            <select
                              value={order.orderStatus}
                              onChange={(e) => updateStatus(order._id, e.target.value)}
                              className="border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-gray-900 dark:text-white p-2.5 text-sm rounded-xl w-full focus:outline-none focus:ring-2 focus:ring-gray-900 transition"
                            >
                              <option value="Order Placed">Order Placed</option>
                              <option value="Processing">Processing</option>
                              <option value="Shipped">Shipped</option>
                              <option value="Out For Delivery">Out For Delivery</option>
                              <option value="Delivered">Delivered</option>
                              <option value="Cancelled">Cancelled</option>
                            </select>
                          </div>

                          <div>
                            <span className="block text-xs font-bold text-gray-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">Delivery Status</span>
                            <span className={`inline-block px-3 py-2 rounded-xl text-xs font-semibold ${getStatusColor(order.deliveryStatus || "Pending")}`}>
                              {order.deliveryStatus || "Pending"}
                            </span>
                          </div>
                        </div>

                        {/* PARTNER ROSTER PIPELINE */}
                        <div className="border-t border-gray-100 dark:border-slate-800 pt-3">
                          <span className="block text-xs font-bold text-gray-500 dark:text-slate-400 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                            <Truck size={14} /> Assigned Partner
                          </span>
                          <p className="text-sm font-semibold text-gray-800 dark:text-slate-100 bg-gray-100 dark:bg-slate-950 inline-block px-3 py-1.5 rounded-lg">
                            {order?.deliveryPartner?.name || "No Partner Assigned"}
                          </p>
                        </div>
                      </div>

                    </div>

                    {/* ASSIGN DRIVER BAR CHANNELS */}
                    {!(order.orderStatus === "Delivered" && order.deliveryStatus === "Delivered") && (
                      <div className="bg-gray-50 dark:bg-slate-800/30 border border-dashed border-gray-200 dark:border-slate-800 rounded-xl p-4 mt-4">
                        <label className="block text-xs font-bold text-gray-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                          Dispatch & Delegate Logistics Agent
                        </label>
                        <select
                          onChange={(e) => assignPartner(order._id, e.target.value)}
                          className="border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-gray-900 dark:text-white p-2.5 text-sm rounded-xl w-full sm:w-72 focus:outline-none focus:ring-2 focus:ring-gray-900 transition"
                          value=""
                        >
                          <option value="" disabled>Select Partner</option>
                          {partners.length > 0 ? (
                            partners.map((partner) => (
                              <option key={partner._id} value={partner._id}>
                                {partner.name} - {partner.phone}
                              </option>
                            ))
                          ) : (
                            <option disabled>No Delivery Partners Found</option>
                          )}
                        </select>
                      </div>
                    )}

                  </div>
                </div>
              ))}
            </div>
          )}

        </main>
      </div>
    </div>
  );
}