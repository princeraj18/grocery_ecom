import {
  useEffect,
  useState,
} from "react";

import api from "../api/api";

import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

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

  // ======================================
  // FETCH ANALYTICS
  // ======================================
  useEffect(() => {

  const fetchAnalytics =
    async () => {

      try {

        // GET TOKEN
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

    <div className="flex bg-gray-100 min-h-screen">

      {/* SIDEBAR */}
      <Sidebar />

      {/* MAIN */}
      <div className="flex-1">

        <Navbar />

        <div className="p-6">

          {/* HEADER */}
          <div className="mb-8">

            <h1 className="text-3xl font-bold text-gray-800">
              Vendor Analytics
            </h1>

            <p className="text-gray-500 mt-2">
              Revenue, products,
              customers & orders overview
            </p>

          </div>

          {/* LOADING */}
          {
            loading ? (

              <div className="flex justify-center items-center h-[60vh]">

                <div className="text-2xl font-bold text-gray-700 animate-pulse">
                  Loading Analytics...
                </div>

              </div>

            ) : (

              <>

                {/* STATS */}
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-10">

                  {
                    stats.map(
                      (
                        item,
                        index
                      ) => (

                        <div
                          key={index}
                          className={`bg-gradient-to-r ${item.color} text-white rounded-3xl p-6 shadow-lg hover:scale-105 transition duration-300`}
                        >

                          <p className="text-lg opacity-90">
                            {
                              item.title
                            }
                          </p>

                          <h2 className="text-4xl font-bold mt-4">
                            {
                              item.value
                            }
                          </h2>

                        </div>
                      )
                    )
                  }

                </div>

                {/* RECENT ORDERS */}
                <div className="bg-white rounded-3xl shadow-md p-6 mb-8">

                  <div className="flex items-center justify-between mb-6">

                    <h2 className="text-2xl font-bold text-gray-800">
                      Recent Orders
                    </h2>

                    <span className="bg-gray-100 px-4 py-2 rounded-full text-sm text-gray-600">
                      {
                        analytics.orders.length
                      } Orders
                    </span>

                  </div>

                  <div className="overflow-x-auto">

                    <table className="w-full">

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

                {/* PRODUCTS + CUSTOMERS */}
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">

                  {/* PRODUCTS */}
                  <div className="bg-white rounded-3xl shadow-md p-6">

                    <div className="flex items-center justify-between mb-6">

                      <h2 className="text-2xl font-bold text-gray-800">
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
                              className="flex items-center gap-4 border border-gray-200 p-4 rounded-2xl hover:shadow-md transition"
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
                                className="w-20 h-20 rounded-2xl object-cover border"
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

                                <div className="flex items-center gap-3 mt-2">

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
                  <div className="bg-white rounded-3xl shadow-md p-6">

                    <div className="flex items-center justify-between mb-6">

                      <h2 className="text-2xl font-bold text-gray-800">
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
                              className="flex items-center justify-between border border-gray-200 rounded-2xl p-4 hover:shadow-md transition"
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

                                  <p className="text-gray-500 text-sm">

                                    {
                                      order
                                        ?.shippingAddress
                                        ?.email
                                    }

                                  </p>

                                </div>

                              </div>

                              <span className="text-sm bg-gray-100 px-3 py-1 rounded-full text-gray-600">
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