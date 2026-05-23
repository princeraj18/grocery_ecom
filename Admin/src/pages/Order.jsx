/* eslint-disable react-hooks/set-state-in-effect */

import { useEffect, useState } from "react";
import api from "../services/api";

export default function Order() {

  const [orders, setOrders] =
    useState([]);

  // FETCH ORDERS
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

  // UPDATE STATUS
  const updateStatus =
    async (id, status) => {

      try {

        await api.put(
          `/orders/${id}`,
          {
            orderStatus: status,
          }
        );

        fetchOrders();

      } catch (err) {

        console.log(err);
      }
    };

  return (
    <div>

      <h1 className="text-2xl font-bold mb-6">
        Orders
      </h1>

      <div className="bg-white shadow rounded overflow-x-auto">

        <table className="w-full">

          <thead className="bg-gray-100">

            <tr>

              <th className="p-3 text-left">
                Order ID
              </th>

              <th className="p-3 text-left">
                Customer
              </th>

              <th className="p-3 text-left">
                Total
              </th>

              <th className="p-3 text-left">
                Status
              </th>

            </tr>

          </thead>

          <tbody>

            {
              orders.length === 0 ? (

                <tr>

                  <td
                    colSpan="4"
                    className="p-4 text-center"
                  >
                    No orders found
                  </td>

                </tr>

              ) : (

                orders.map((order) => (

                  <tr
                    key={order._id}
                    className="border-t"
                  >

                    <td className="p-3">
                      #{order._id.slice(-6)}
                    </td>

                    <td className="p-3">
                      {
                        order.user?.name ||
                        "Guest"
                      }
                    </td>

                    <td className="p-3">
                      ₹{order.totalAmount}
                    </td>

                    <td className="p-3">

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
                        className="border p-2 rounded"
                      >

                        <option value="processing">
                          Processing
                        </option>

                        <option value="shipped">
                          Shipped
                        </option>

                        <option value="delivered">
                          Delivered
                        </option>

                        <option value="cancelled">
                          Cancelled
                        </option>

                      </select>

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