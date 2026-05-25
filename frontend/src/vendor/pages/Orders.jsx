import React, {
  useEffect,
  useState,
} from "react";

import axios from "axios";

import Sidebar from "../components/Sidebar";

import Navbar from "../components/Navbar";

export default function Orders() {

  const [orders, setOrders] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

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
          data.orders
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

    <div className="flex">

      {/* SIDEBAR */}
      <Sidebar />

      {/* MAIN */}
      <div className="flex-1 bg-gray-100 min-h-screen">

        <Navbar />

        <div className="p-6">

          {/* HEADING */}
          <h1 className="text-3xl font-bold mb-6">
            Orders
          </h1>

          {/* LOADING */}
          {loading ? (

            <div className="text-xl font-semibold">
              Loading...
            </div>

          ) : orders.length === 0 ? (

            <div className="bg-white p-10 rounded-xl shadow">
              No Orders Found
            </div>

          ) : (

            <div className="space-y-6">

              {orders.map(
                (order) => (

                  <div
                    key={order._id}
                    className="bg-white rounded-xl shadow p-6"
                  >

                    {/* TOP */}
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

                      <div>

                        <h2 className="text-xl font-bold">
                          Order ID:
                        </h2>

                        <p className="text-gray-500 break-all">
                          {order._id}
                        </p>

                        <p className="mt-2">
                          <span className="font-semibold">
                            Customer:
                          </span>
                          {" "}
                          {
                            order.user?.name
                          }
                        </p>

                        <p>
                          <span className="font-semibold">
                            Email:
                          </span>
                          {" "}
                          {
                            order.user?.email
                          }
                        </p>

                      </div>

                      <div>

                        <p className="text-lg font-bold text-green-600">
                          ₹
                          {
                            order.totalAmount
                          }
                        </p>

                        <p className="text-sm text-gray-500">
                          Payment:
                          {" "}
                          {
                            order.paymentMethod
                          }
                        </p>

                        <p
                          className={`font-semibold ${
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

                    {/* PRODUCTS */}
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
                              className="flex items-center gap-4 border rounded-lg p-3"
                            >

                              {/* IMAGE */}
                              <img
                                src={
                                  item.image
                                }
                                alt={
                                  item.name
                                }
                                className="w-20 h-20 object-cover rounded-lg"
                              />

                              {/* DETAILS */}
                              <div className="flex-1">

                                <h4 className="font-bold">
                                  {
                                    item.name
                                  }
                                </h4>

                                <p className="text-gray-500">
                                  Quantity:
                                  {" "}
                                  {
                                    item.quantity
                                  }
                                </p>

                                <p className="text-gray-500">
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

                    {/* SHIPPING */}
                    <div className="mt-6">

                      <h3 className="font-bold text-lg mb-2">
                        Shipping Address
                      </h3>

                      <p>
                        {
                          order
                            .shippingAddress
                            ?.firstName
                        }
                        {" "}
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
                        ,
                        {" "}
                        {
                          order
                            .shippingAddress
                            ?.city
                        }
                        ,
                        {" "}
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

                    {/* STATUS */}
                    <div className="mt-6 flex flex-col md:flex-row md:items-center gap-4">

                      <div>

                        <p className="font-semibold">
                          Current Status:
                        </p>

                        <p className="text-blue-600 font-bold">
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
                        className="border p-3 rounded-lg"
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