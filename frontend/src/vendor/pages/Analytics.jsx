import {
  useEffect,
  useState,
} from "react";

import api from "../api/api";

import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

import {
  Menu,
  X,
} from "lucide-react";

export default function Analytics() {

  const [analytics, setAnalytics] =
    useState({
      totalRevenue: 0,
      totalOrders: 0,
      totalProducts: 0,
      totalCustomers: 0,

      orders: [],
      products: [],
      users: [],
    });

  const [loading, setLoading] =
    useState(true);

  // MOBILE SIDEBAR
  const [sidebarOpen, setSidebarOpen] =
    useState(false);

  // ======================================
  // FETCH ANALYTICS
  // ======================================
  useEffect(() => {

    const fetchAnalytics =
      async () => {

        try {

          const token =
            localStorage.getItem(
              "vendorToken"
            );

          const { data } =
            await api.get(
              "/vendor/analytics",
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }
            );

          setAnalytics({
            totalRevenue:
              data.analytics
                ?.totalRevenue || 0,

            totalOrders:
              data.analytics
                ?.totalOrders || 0,

            totalProducts:
              data.analytics
                ?.totalProducts || 0,

            totalCustomers:
              data.analytics
                ?.totalCustomers || 0,

            orders:
              data.orders || [],

            products:
              data.products || [],

            users:
              data.users || [],
          });

        } catch (error) {

          console.log(
            "ANALYTICS ERROR:",
            error
          );

        } finally {

          setLoading(false);
        }
      };

    fetchAnalytics();

  }, []);

  // ======================================
  // STATS
  // ======================================
  const stats = [
    {
      title: "Total Revenue",
      value: `₹${analytics.totalRevenue}`,
      color:
        "from-black to-gray-800",
    },

    {
      title: "Total Orders",
      value:
        analytics.totalOrders,
      color:
        "from-blue-600 to-blue-800",
    },

    {
      title: "Total Products",
      value:
        analytics.totalProducts,
      color:
        "from-green-600 to-green-800",
    },

    {
      title: "Total Customers",
      value:
        analytics.totalCustomers,
      color:
        "from-red-600 to-red-800",
    },
  ];

  return (

    <div className="flex min-h-screen bg-gray-100 overflow-hidden">

      {/* ======================================
          MOBILE OVERLAY
      ====================================== */}
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

      {/* ======================================
          SIDEBAR
      ====================================== */}
      <div
        className={`
          fixed lg:static top-0 left-0 z-50
          h-screen transition-transform duration-300
          ${sidebarOpen
            ? "translate-x-0"
            : "-translate-x-full lg:translate-x-0"
          }
        `}
      >
        <Sidebar />
      </div>

      {/* ======================================
          MAIN CONTENT
      ====================================== */}
      <div className="flex-1 flex flex-col min-w-0">

        {/* MOBILE TOPBAR */}
     <div className="sticky top-0 z-30 bg-white shadow-sm">
     
               <div className="flex items-center">
     
                 {/* MOBILE MENU */}
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

        {/* CONTENT */}
        <div className="p-4 sm:p-6 overflow-x-hidden">

          {/* HEADER */}
          <div className="mb-8">

            <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
              Vendor Analytics
            </h1>

            <p className="text-gray-500 mt-2 text-sm sm:text-base">
              Revenue, products,
              customers & orders overview
            </p>

          </div>

          {/* LOADING */}
          {
            loading ? (

              <div className="flex justify-center items-center h-[60vh]">

                <div className="text-xl sm:text-2xl font-bold text-gray-700 animate-pulse text-center">
                  Loading Analytics...
                </div>

              </div>

            ) : (

              <>

                {/* ======================================
                    STATS
                ====================================== */}
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 mb-10">

                  {
                    stats.map(
                      (
                        item,
                        index
                      ) => (

                        <div
                          key={index}
                          className={`bg-gradient-to-r ${item.color} text-white rounded-3xl p-5 sm:p-6 shadow-lg hover:scale-[1.02] transition`}
                        >

                          <p className="text-base sm:text-lg opacity-90">
                            {
                              item.title
                            }
                          </p>

                          <h2 className="text-3xl sm:text-4xl font-bold mt-4 break-words">
                            {
                              item.value
                            }
                          </h2>

                        </div>
                      )
                    )
                  }

                </div>

                {/* ======================================
                    RECENT ORDERS
                ====================================== */}
                <div className="bg-white rounded-3xl shadow-md p-4 sm:p-6 mb-8 overflow-hidden">

                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">

                    <h2 className="text-xl sm:text-2xl font-bold text-gray-800">
                      Recent Orders
                    </h2>

                    <span className="bg-gray-100 px-4 py-2 rounded-full text-sm text-gray-600 w-fit">
                      {
                        analytics.orders.length
                      } Orders
                    </span>

                  </div>

                  {/* MOBILE CARDS */}
                  <div className="block lg:hidden space-y-4">

                    {
                      analytics.orders
                        ?.slice(0, 6)
                        ?.map((order) => (

                          <div
                            key={order._id}
                            className="border rounded-2xl p-4"
                          >

                            <div className="flex items-center justify-between mb-3">

                              <h3 className="font-bold">
                                #
                                {
                                  order._id?.slice(
                                    -6
                                  )
                                }
                              </h3>

                              <span
                                className={`px-3 py-1 rounded-full text-xs font-semibold
                                  ${
                                    order.orderStatus ===
                                    "Delivered"
                                      ? "bg-green-100 text-green-700"

                                      : order.orderStatus ===
                                        "Cancelled"
                                      ? "bg-red-100 text-red-700"

                                      : "bg-yellow-100 text-yellow-700"
                                  }`}
                              >
                                {
                                  order.orderStatus
                                }
                              </span>

                            </div>

                            <p className="text-sm text-gray-600">
                              Customer:
                              <span className="font-semibold ml-1">
                                {
                                  order
                                    ?.shippingAddress
                                    ?.firstName
                                }{" "}

                                {
                                  order
                                    ?.shippingAddress
                                    ?.lastName
                                }
                              </span>
                            </p>

                            <p className="text-sm text-gray-600 mt-1">
                              Payment:
                              <span className="font-semibold ml-1">
                                {
                                  order.paymentMethod
                                }
                              </span>
                            </p>

                            <p className="text-green-600 font-bold mt-2">
                              ₹
                              {
                                order.totalAmount
                              }
                            </p>

                          </div>
                        ))
                    }

                  </div>

                  {/* DESKTOP TABLE */}
                  <div className="hidden lg:block overflow-x-auto">

                    <table className="w-full min-w-[800px]">

                      <thead>

                        <tr className="bg-gray-100 text-gray-700">

                          <th className="p-4 text-left rounded-l-xl">
                            Order ID
                          </th>

                          <th className="p-4 text-left">
                            Customer
                          </th>

                          <th className="p-4 text-left">
                            Payment
                          </th>

                          <th className="p-4 text-left">
                            Amount
                          </th>

                          <th className="p-4 text-left rounded-r-xl">
                            Status
                          </th>

                        </tr>

                      </thead>

                      <tbody>

                        {
                          analytics.orders
                            ?.slice(0, 6)
                            ?.map((order) => (

                              <tr
                                key={order._id}
                                className="border-b hover:bg-gray-50 transition"
                              >

                                <td className="p-4 font-semibold text-gray-700">
                                  #
                                  {
                                    order._id?.slice(
                                      -6
                                    )
                                  }
                                </td>

                                <td className="p-4">

                                  {
                                    order
                                      ?.shippingAddress
                                      ?.firstName
                                  }{" "}

                                  {
                                    order
                                      ?.shippingAddress
                                      ?.lastName
                                  }

                                </td>

                                <td className="p-4">
                                  {
                                    order.paymentMethod
                                  }
                                </td>

                                <td className="p-4 font-bold text-green-600">
                                  ₹
                                  {
                                    order.totalAmount
                                  }
                                </td>

                                <td className="p-4">

                                  <span
                                    className={`px-4 py-1 rounded-full text-sm font-semibold
                                      ${
                                        order.orderStatus ===
                                        "Delivered"
                                          ? "bg-green-100 text-green-700"

                                          : order.orderStatus ===
                                            "Cancelled"
                                          ? "bg-red-100 text-red-700"

                                          : "bg-yellow-100 text-yellow-700"
                                      }`}
                                  >
                                    {
                                      order.orderStatus
                                    }
                                  </span>

                                </td>

                              </tr>
                            ))
                        }

                      </tbody>

                    </table>

                  </div>

                </div>

                {/* ======================================
                    PRODUCTS + CUSTOMERS
                ====================================== */}
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">

                  {/* PRODUCTS */}
                  <div className="bg-white rounded-3xl shadow-md p-4 sm:p-6">

                    <div className="flex items-center justify-between mb-6">

                      <h2 className="text-xl sm:text-2xl font-bold text-gray-800">
                        Products
                      </h2>

                      <span className="bg-green-100 text-green-700 px-4 py-2 rounded-full text-sm">
                        {
                          analytics.products.length
                        } Products
                      </span>

                    </div>

                    <div className="space-y-4">

                      {
                        analytics.products
                          ?.slice(0, 5)
                          ?.map((product) => (

                            <div
                              key={product._id}
                              className="flex flex-col sm:flex-row gap-4 border border-gray-200 p-4 rounded-2xl hover:shadow-md transition"
                            >

                              <img
                                src={
                                  Array.isArray(
                                    product.image
                                  )
                                    ? product
                                        .image[0]
                                    : product.image
                                }
                                alt={
                                  product.name
                                }
                                className="w-full sm:w-20 h-48 sm:h-20 rounded-2xl object-cover border"
                              />

                              <div className="flex-1">

                                <h3 className="font-bold text-lg text-gray-800">
                                  {
                                    product.name
                                  }
                                </h3>

                                <p className="text-gray-500 text-sm">
                                  {
                                    product.category
                                  }
                                </p>

                                <div className="flex items-center gap-3 mt-2 flex-wrap">

                                  <span className="text-green-600 font-bold">
                                    ₹
                                    {
                                      product.offerPrice
                                    }
                                  </span>

                                  <span className="line-through text-gray-400 text-sm">
                                    ₹
                                    {
                                      product.price
                                    }
                                  </span>

                                </div>

                              </div>

                            </div>
                          ))
                      }

                    </div>

                  </div>

                  {/* CUSTOMERS */}
                  <div className="bg-white rounded-3xl shadow-md p-4 sm:p-6">

                    <div className="flex items-center justify-between mb-6">

                      <h2 className="text-xl sm:text-2xl font-bold text-gray-800">
                        Customers
                      </h2>

                      <span className="bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm">
                        {
                          analytics.totalCustomers
                        } Customers
                      </span>

                    </div>

                    <div className="space-y-4">

                      {
                        analytics.orders
                          ?.slice(0, 6)
                          ?.map((order) => (

                            <div
                              key={order._id}
                              className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border border-gray-200 rounded-2xl p-4 hover:shadow-md transition"
                            >

                              <div className="flex items-center gap-4">

                                <div className="w-12 h-12 rounded-full bg-black text-white flex items-center justify-center font-bold text-lg uppercase">

                                  {
                                    order
                                      ?.shippingAddress
                                      ?.firstName?.charAt(
                                        0
                                      )
                                  }

                                </div>

                                <div>

                                  <h3 className="font-semibold text-gray-800">

                                    {
                                      order
                                        ?.shippingAddress
                                        ?.firstName
                                    }{" "}

                                    {
                                      order
                                        ?.shippingAddress
                                        ?.lastName
                                    }

                                  </h3>

                                  <p className="text-gray-500 text-sm break-all">

                                    {
                                      order
                                        ?.shippingAddress
                                        ?.email
                                    }

                                  </p>

                                </div>

                              </div>

                              <span className="text-sm bg-gray-100 px-3 py-1 rounded-full text-gray-600 w-fit">
                                Customer
                              </span>

                            </div>
                          ))
                      }

                    </div>

                  </div>

                </div>

              </>
            )
          }

        </div>

      </div>

    </div>
  );
}