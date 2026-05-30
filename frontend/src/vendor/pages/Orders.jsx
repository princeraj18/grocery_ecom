import React, {
  useEffect,
  useState,
} from "react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import axios from "axios";

import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

import {
  Menu,
  X,
} from "lucide-react";

export default function Orders() {

  const [orders, setOrders] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [sidebarOpen, setSidebarOpen] =
    useState(false);
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
      ]);
    });
  });

  autoTable(doc, {
    startY: 30,
    head: [
      [
        "Order ID",
        "Product",
        "Qty",
        "Price",
        "Subtotal",
        "Status",
        "Payment",
        "Customer",
      ],
    ],
    body: tableData,
    styles: {
      fontSize: 8,
    },
    headStyles: {
      fillColor: [0, 0, 0],
    },
  });

  doc.save("VendorOrders.pdf");
};
  // ====================================
  // FETCH ORDERS
  // ====================================
  const fetchOrders =
    async () => {

      try {

        const token =
          localStorage.getItem(
            "vendorToken"
          );

        const { data } =
          await axios.get(
            "http://localhost:5000/api/orders/vendor",
            {
              headers: {
                Authorization:
                  `Bearer ${token}`,
              },
            }
          );

        setOrders(
          data.orders || []
        );

      } catch (error) {

        console.log(error);

      } finally {

        setLoading(false);
      }
    };

  // ====================================
  // UPDATE ORDER STATUS
  // ====================================
  const updateStatus =
    async (
      orderId,
      status
    ) => {

      try {

        const token =
          localStorage.getItem(
            "vendorToken"
          );

        await axios.put(
          `http://localhost:5000/api/orders/${orderId}`,
          {
            orderStatus: status,
          },
          {
            headers: {
              Authorization:
                `Bearer ${token}`,
            },
          }
        );

        fetchOrders();

      } catch (error) {

        console.log(error);

        alert(
          "Failed to update status"
        );
      }
    };

  useEffect(() => {

    fetchOrders();

  }, []);

  return (

    <div className="flex min-h-screen bg-gray-100 overflow-hidden">

      {/* ====================================
          MOBILE SIDEBAR OVERLAY
      ==================================== */}
      {
        sidebarOpen && (
          <div
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            onClick={() =>
              setSidebarOpen(false)
            }
          />
        )
      }

      {/* ====================================
          SIDEBAR
      ==================================== */}
      <div
        className={`
          fixed lg:static z-50
          h-full
          transition-transform duration-300
          ${sidebarOpen
            ? "translate-x-0"
            : "-translate-x-full lg:translate-x-0"
          }
        `}
      >
        <Sidebar />
      </div>

      {/* ====================================
          MAIN CONTENT
      ==================================== */}
      <div className="flex-1 flex flex-col w-full overflow-hidden">

        {/* TOP NAV */}
        <div className="sticky top-0 z-30 bg-white shadow-sm">

          <div className="flex items-center">

            {/* MOBILE MENU BUTTON */}
            <button
              onClick={() =>
                setSidebarOpen(
                  !sidebarOpen
                )
              }
              className="lg:hidden p-4"
            >
              {sidebarOpen ? (
                <X size={28} />
              ) : (
                <Menu size={28} />
              )}
            </button>

            <div className="flex-1">
              <Navbar />
            </div>

          </div>

        </div>

        {/* PAGE CONTENT */}
        <div className="flex-1 overflow-y-auto p-3 sm:p-5 md:p-6">

          {/* HEADING */}
          <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">

  <div>
    <h1 className="text-2xl md:text-3xl font-bold">
      Orders
    </h1>

    <p className="text-gray-500 mt-1 text-sm md:text-base">
      Manage and track all customer orders
    </p>
  </div>

  <button
    onClick={downloadOrdersPDF}
    className="bg-black text-white px-5 py-3 rounded-xl hover:bg-gray-800 transition font-medium"
  >
    Download Orders PDF
  </button>

</div>

          {/* LOADING */}
          {loading ? (

            <div className="flex justify-center items-center h-[50vh]">

              <div className="text-xl md:text-2xl font-semibold animate-pulse">
                Loading Orders...
              </div>

            </div>

          ) : orders.length === 0 ? (

            <div className="bg-white rounded-2xl shadow p-10 text-center">

              <h2 className="text-2xl font-bold mb-3">
                No Orders Found
              </h2>

              <p className="text-gray-500">
                No customer orders available yet.
              </p>

            </div>

          ) : (

            <div className="space-y-5">

              {orders.map(
                (order) => (

                  <div
                    key={order._id}
                    className="bg-white rounded-2xl shadow-md p-4 md:p-6"
                  >

                    {/* ====================================
                        TOP SECTION
                    ==================================== */}
                    <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-5">

                      {/* LEFT */}
                      <div className="space-y-2">

                        <div>

                          <h2 className="text-lg md:text-xl font-bold">
                            Order ID
                          </h2>

                          <p className="text-gray-500 break-all text-sm">
                            {order._id}
                          </p>

                        </div>

                        <div className="space-y-1">

                          <p className="text-sm md:text-base">
                            <span className="font-semibold">
                              Customer:
                            </span>{" "}
                            {
                              order.user?.name
                            }
                          </p>

                          <p className="text-sm md:text-base">
                            <span className="font-semibold">
                              Email:
                            </span>{" "}
                            {
                              order.user?.email
                            }
                          </p>

                        </div>

                      </div>

                      {/* RIGHT */}
                      <div className="space-y-2">

                        <p className="text-2xl font-bold text-green-600">
                          ₹
                          {
                            order.totalAmount
                          }
                        </p>

                        <p className="text-gray-500 text-sm">
                          Payment Method:
                          {" "}
                          {
                            order.paymentMethod
                          }
                        </p>

                        <p
                          className={`font-semibold text-sm ${
                            order.paymentStatus ===
                            "Paid"
                              ? "text-green-600"
                              : "text-red-500"
                          }`}
                        >
                          {
                            order.paymentStatus
                          }
                        </p>

                      </div>

                    </div>

                    {/* ====================================
                        PRODUCTS
                    ==================================== */}
                    <div className="mt-6">

                      <h3 className="font-bold text-lg mb-4">
                        Ordered Products
                      </h3>

                      <div className="space-y-4">

                        {order.items.map(
                          (
                            item,
                            index
                          ) => (

                            <div
                              key={index}
                              className="flex flex-col sm:flex-row gap-4 border rounded-xl p-4"
                            >

                              {/* IMAGE */}
                              <img
                                src={
                                  item.image
                                }
                                alt={
                                  item.name
                                }
                                className="w-full sm:w-24 h-48 sm:h-24 object-cover rounded-xl border"
                              />

                              {/* DETAILS */}
                              <div className="flex-1 space-y-1">

                                <h4 className="font-bold text-lg">
                                  {
                                    item.name
                                  }
                                </h4>

                                <p className="text-gray-500 text-sm">
                                  Quantity:
                                  {" "}
                                  {
                                    item.quantity
                                  }
                                </p>

                                <p className="text-gray-500 text-sm">
                                  Price:
                                  {" "}
                                  ₹
                                  {
                                    item.price
                                  }
                                </p>

                              </div>

                            </div>
                          )
                        )}

                      </div>

                    </div>

                    {/* ====================================
                        SHIPPING
                    ==================================== */}
                    <div className="mt-6">

                      <h3 className="font-bold text-lg mb-3">
                        Shipping Address
                      </h3>

                      <div className="bg-gray-50 rounded-xl p-4 text-sm md:text-base space-y-1">

                        <p>
                          {
                            order
                              .shippingAddress
                              ?.firstName
                          }{" "}
                          {
                            order
                              .shippingAddress
                              ?.lastName
                          }
                        </p>

                        <p>
                          {
                            order
                              .shippingAddress
                              ?.street
                          }
                          ,{" "}
                          {
                            order
                              .shippingAddress
                              ?.city
                          }
                          ,{" "}
                          {
                            order
                              .shippingAddress
                              ?.state
                          }
                        </p>

                        <p>
                          {
                            order
                              .shippingAddress
                              ?.country
                          }
                          {" "}
                          -
                          {" "}
                          {
                            order
                              .shippingAddress
                              ?.zipcode
                          }
                        </p>

                        <p>
                          Phone:
                          {" "}
                          {
                            order
                              .shippingAddress
                              ?.phone
                          }
                        </p>

                      </div>

                    </div>

                    {/* ====================================
                        STATUS
                    ==================================== */}
                    <div className="mt-6 flex flex-col lg:flex-row lg:items-center gap-4">

                      {/* CURRENT STATUS */}
                      <div>

                        <p className="font-semibold text-sm md:text-base">
                          Current Status
                        </p>

                        <p
                          className={`font-bold mt-1 ${
                            order.orderStatus ===
                            "Delivered"
                              ? "text-green-600"

                              : order.orderStatus ===
                                "Cancelled"
                              ? "text-red-500"

                              : "text-blue-600"
                          }`}
                        >
                          {
                            order.orderStatus
                          }
                        </p>

                      </div>

                      {/* UPDATE STATUS */}
                      <select
                        value={
                          order.orderStatus
                        }
                        onChange={(e) =>
                          updateStatus(
                            order._id,
                            e.target.value
                          )
                        }
                        className="border p-3 rounded-xl w-full lg:w-72 focus:outline-none focus:ring-2 focus:ring-black"
                      >

                        <option value="Order Placed">
                          Order Placed
                        </option>

                        <option value="Processing">
                          Processing
                        </option>

                        <option value="Shipped">
                          Shipped
                        </option>

                        <option value="Out For Delivery">
                          Out For Delivery
                        </option>

                        <option value="Delivered">
                          Delivered
                        </option>

                        <option value="Cancelled">
                          Cancelled
                        </option>

                      </select>

                    </div>

                  </div>
                )
              )}

            </div>
          )}

        </div>

      </div>

    </div>
  );
}