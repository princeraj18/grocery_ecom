/* eslint-disable react-hooks/set-state-in-effect */

import { useEffect, useState } from "react";
import api from "../services/api";

export default function Order() {
  const [orders, setOrders] = useState([]);

  const fetchOrders = async () => {
    try {
      const res = await api.get("/orders");

      setOrders(
        Array.isArray(res.data?.orders)
          ? res.data.orders
          : []
      );
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  return (
    <div className="p-4 md:p-6">

      {/* HEADER */}
      <div className="mb-6">

        <h1 className="text-2xl md:text-3xl font-bold">
          Orders
        </h1>

        <p className="text-gray-500 mt-1">
          Manage all customer orders
        </p>

      </div>

      {/* ORDER COUNT */}
      <div className="bg-white rounded-xl shadow p-4 mb-6">
        <h2 className="text-lg font-semibold">
          Total Orders
        </h2>

        <p className="text-3xl font-bold text-blue-600 mt-2">
          {orders.length}
        </p>
      </div>

      {/* ========================= */}
      {/* DESKTOP TABLE */}
      {/* ========================= */}

      <div className="hidden lg:block bg-white shadow rounded-xl overflow-x-auto">

        <table className="w-full">

          <thead className="bg-black text-white">

            <tr>

              <th className="p-4 text-left">
                Order ID
              </th>

              <th className="p-4 text-left">
                Customer
              </th>

              <th className="p-4 text-left">
                Products
              </th>

              <th className="p-4 text-left">
                Total
              </th>

              <th className="p-4 text-left">
                Payment
              </th>

              <th className="p-4 text-left">
                Status
              </th>

            </tr>

          </thead>

          <tbody>

            {orders.length === 0 ? (
              <tr>
                <td
                  colSpan="6"
                  className="p-6 text-center"
                >
                  No Orders Found
                </td>
              </tr>
            ) : (
              orders.map((order) => (

                <tr
                  key={order._id}
                  className="border-b hover:bg-gray-50"
                >

                  {/* ORDER ID */}
                  <td className="p-4">

                    <p className="font-semibold">
                      #{order._id.slice(-6)}
                    </p>

                    <p className="text-xs text-gray-500">
                      {new Date(
                        order.createdAt
                      ).toLocaleDateString()}
                    </p>

                  </td>

                  {/* CUSTOMER */}
                  <td className="p-4">

                    <p className="font-semibold">
                      {
                        order.shippingAddress
                          ?.firstName
                      }{" "}
                      {
                        order.shippingAddress
                          ?.lastName
                      }
                    </p>

                    <p className="text-sm text-gray-500">
                      {
                        order.shippingAddress
                          ?.email
                      }
                    </p>

                    <p className="text-sm text-gray-500">
                      {
                        order.shippingAddress
                          ?.phone
                      }
                    </p>

                  </td>

                  {/* PRODUCTS */}
                  <td className="p-4">

                    <div className="space-y-2">

                      {order.items
                        ?.slice(0, 3)
                        .map(
                          (
                            item,
                            index
                          ) => (

                            <div
                              key={index}
                              className="flex items-center gap-3"
                            >

                              <img
                                src={
                                  item.image ||
                                  "https://via.placeholder.com/50"
                                }
                                alt={
                                  item.name
                                }
                                className="w-12 h-12 rounded object-cover border"
                              />

                              <div>

                                <p className="font-medium text-sm">
                                  {
                                    item.name
                                  }
                                </p>

                                <p className="text-xs text-gray-500">
                                  Qty:
                                  {" "}
                                  {
                                    item.quantity
                                  }
                                </p>

                              </div>

                            </div>
                          )
                        )}

                      {order.items
                        ?.length >
                        3 && (
                        <p className="text-xs text-blue-600">
                          +
                          {order.items
                            .length -
                            3}
                          {" "}
                          more products
                        </p>
                      )}

                    </div>

                  </td>

                  {/* TOTAL */}
                  <td className="p-4 font-bold text-green-600">
                    ₹
                    {
                      order.totalAmount
                    }
                  </td>

                  {/* PAYMENT */}
                  <td className="p-4">

                    <p>
                      {
                        order.paymentMethod
                      }
                    </p>

                    <p
                      className={`text-sm font-semibold ${
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

                  </td>

                  {/* STATUS */}
                  <td className="p-4">

                    <span
                      className={`px-3 py-1 rounded-full text-sm font-semibold
                      ${
                        order.orderStatus ===
                        "Delivered"
                          ? "bg-green-100 text-green-700"
                          : order.orderStatus ===
                            "Cancelled"
                          ? "bg-red-100 text-red-700"
                          : order.orderStatus ===
                            "Shipped"
                          ? "bg-blue-100 text-blue-700"
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
            )}

          </tbody>

        </table>

      </div>

      {/* ========================= */}
      {/* MOBILE VIEW */}
      {/* ========================= */}

      <div className="lg:hidden space-y-4">

        {orders.length === 0 ? (

          <div className="bg-white rounded-xl shadow p-6 text-center">
            No Orders Found
          </div>

        ) : (

          orders.map((order) => (

            <div
              key={order._id}
              className="bg-white rounded-2xl shadow p-4"
            >

              <div className="flex justify-between items-start mb-4">

                <div>

                  <p className="font-bold">
                    #
                    {order._id.slice(
                      -6
                    )}
                  </p>

                  <p className="text-sm text-gray-500">
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

                </div>

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

              {/* PRODUCTS */}

              <div className="space-y-3">

                {order.items?.map(
                  (
                    item,
                    index
                  ) => (

                    <div
                      key={index}
                      className="flex items-center gap-3"
                    >

                      <img
                        src={
                          item.image ||
                          "https://via.placeholder.com/60"
                        }
                        alt={
                          item.name
                        }
                        className="w-14 h-14 rounded-lg object-cover border"
                      />

                      <div>

                        <p className="font-medium">
                          {
                            item.name
                          }
                        </p>

                        <p className="text-sm text-gray-500">
                          Qty:
                          {" "}
                          {
                            item.quantity
                          }
                        </p>

                      </div>

                    </div>
                  )
                )}

              </div>

              <div className="border-t mt-4 pt-4">

                <p className="font-bold text-green-600 text-lg">
                  ₹
                  {
                    order.totalAmount
                  }
                </p>

                <p className="text-sm text-gray-500 mt-1">
                  {
                    order.paymentMethod
                  }
                  {" • "}
                  {
                    order.paymentStatus
                  }
                </p>

              </div>

            </div>
          ))
        )}

      </div>

    </div>
  );
}