/* eslint-disable react-hooks/set-state-in-effect */

import { useEffect, useState } from "react";
import api from "../services/api";

export default function Order() {

  const [orders, setOrders] =
    useState([]);

  // ==========================
  // FETCH ALL ORDERS
  // ==========================
  const fetchOrders =
    async () => {

      try {

        const res =
          await api.get("/orders");

        setOrders(
          Array.isArray(
            res.data?.orders
          )
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

    <div className="p-6">

      {/* HEADER */}
      <h1 className="text-3xl font-bold mb-6">
        Orders
      </h1>

      {/* TABLE */}
      <div className="bg-white shadow rounded-xl overflow-x-auto">

        <table className="w-full">

          {/* TABLE HEAD */}
          <thead className="bg-black text-white">

            <tr>

              <th className="p-4 text-left">
                Order ID
              </th>

              <th className="p-4 text-left">
                Customer
              </th>

              <th className="p-4 text-left">
                Address
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

          {/* TABLE BODY */}
          <tbody>

            {
              orders.length === 0 ? (

                <tr>

                  <td
                    colSpan="6"
                    className="p-6 text-center"
                  >
                    No orders found
                  </td>

                </tr>

              ) : (

                orders.map((order) => (

                  <tr
                    key={order._id}
                    className="border-b hover:bg-gray-50"
                  >

                    {/* ORDER ID */}
                    <td className="p-4 font-semibold">
                      #{order._id.slice(-6)}
                    </td>

                    {/* CUSTOMER */}
                    <td className="p-4">

                      <div>

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

                      </div>

                    </td>

                    {/* ADDRESS */}
                    <td className="p-4 text-sm">

                      <div className="max-w-xs">

                        <p>
                          {
                            order.shippingAddress
                              ?.street
                          }
                        </p>

                        <p>
                          {
                            order.shippingAddress
                              ?.city
                          }
                          ,{" "}
                          {
                            order.shippingAddress
                              ?.state
                          }
                        </p>

                        <p>
                          {
                            order.shippingAddress
                              ?.country
                          }{" "}
                          -
                          {" "}
                          {
                            order.shippingAddress
                              ?.zipcode
                          }
                        </p>

                      </div>

                    </td>

                    {/* TOTAL */}
                    <td className="p-4 font-bold text-green-600">
                      ₹{order.totalAmount}
                    </td>

                    {/* PAYMENT */}
                    <td className="p-4">

                      <div>

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

                      </div>

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
              )
            }

          </tbody>

        </table>

      </div>

    </div>
  );
}