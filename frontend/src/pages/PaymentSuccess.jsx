import React, {
  useContext,
  useEffect,
  useState,
} from "react";

import { Link } from "react-router-dom";

import api from "../api/Axios";
import { ShopContext } from "../context/ShopContext";

const PaymentSuccess = () => {
  const [order, setOrder] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  const { clearCart } =
    useContext(ShopContext);

  useEffect(() => {

    const verifyAndFetchOrder =
      async () => {

        try {

          const params =
            new URLSearchParams(
              window.location.search
            );

          const sessionId =
            params.get(
              "session_id"
            );

          const orderId =
            localStorage.getItem(
              "lastOrderId"
            );

          const paymentVerifiedKey =
            sessionId
              ? `paymentVerified:${sessionId}`
              : "paymentVerified";

          console.log(
            "Session ID:",
            sessionId
          );

          console.log(
            "Order ID:",
            orderId
          );

          // ====================================
          // VERIFY STRIPE PAYMENT ONLY ONCE
          // ====================================
          if (
            sessionId &&
            !localStorage.getItem(
              paymentVerifiedKey
            )
          ) {

            const verifyRes =
              await api.post(
                "/payment/verify-payment",
                {
                  sessionId,
                }
              );

            if (
              verifyRes.data.success
            ) {

              const user =
                JSON.parse(
                  localStorage.getItem(
                    "user"
                  )
                );

              // =========================
              // CLEAR DATABASE CART
              // =========================
              await api.delete(
                "/cart/clear",
                {
                  data: {
                    userId:
                      user._id,
                  },
                }
              );

              // =========================
              // CLEAR LOCAL STORAGE CART
              // =========================
              localStorage.removeItem(
                "cart"
              );

              // =========================
              // CLEAR CONTEXT CART
              // =========================
              await clearCart();

              // =========================
              // PREVENT RE-RUN
              // =========================
              localStorage.setItem(
                paymentVerifiedKey,
                "true"
              );
            }
          }

          // ====================================
          // FOR COD ORDERS
          // CLEAR CART ONLY ONCE
          // ====================================
          if (
            !sessionId &&
            !localStorage.getItem(
              "codCartCleared"
            )
          ) {

            const user =
              JSON.parse(
                localStorage.getItem(
                  "user"
                )
              );

            if (user?._id) {

              await api.delete(
                "/cart/clear",
                {
                  data: {
                    userId:
                      user._id,
                  },
                }
              );

              localStorage.removeItem(
                "cart"
              );

              await clearCart();

              localStorage.setItem(
                "codCartCleared",
                "true"
              );
            }
          }

          // ====================================
          // FETCH ORDER
          // ====================================
          if (orderId) {

            const res =
              await api.get(
                `/orders/${orderId}`
              );

            console.log(
              "ORDER RESPONSE:",
              res.data
            );

            if (
              res.data.success
            ) {

              setOrder(
                res.data.order
              );
            }
          }

        } catch (error) {

          console.log(
            "Payment Success Error:",
            error.response
              ?.data || error
          );

        } finally {

          setLoading(false);
        }
      };

    verifyAndFetchOrder();

  }, []); // IMPORTANT

  // ====================================
  // LOADING
  // ====================================
  if (loading) {

    return (
      <div className="min-h-screen flex justify-center items-center text-2xl font-semibold">
        Loading...
      </div>
    );
  }

  // ====================================
  // ORDER NOT FOUND
  // ====================================
  if (!order) {

    return (
      <div className="min-h-screen flex flex-col justify-center items-center">

        <h1 className="text-3xl font-bold text-red-500">
          Order Not Found
        </h1>

        <Link
          to="/"
          className="mt-5 bg-green-600 text-white px-6 py-3 rounded-lg"
        >
          Go Home
        </Link>

      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4">

      <div className="max-w-5xl mx-auto bg-white shadow-xl rounded-2xl p-8">

        {/* SUCCESS HEADER */}
        <div className="text-center">

          <div className="text-7xl mb-4">
            ✅
          </div>

          <h1 className="text-4xl font-bold text-green-600">
            Payment Successful!
          </h1>

          <p className="text-gray-600 mt-3">
            Thank you for shopping
            with GreenCart
          </p>

        </div>

        {/* ORDER INFO */}
        <div className="grid md:grid-cols-2 gap-6 mt-10">

          {/* PAYMENT DETAILS */}
          <div className="bg-green-50 p-6 rounded-xl">

            <h2 className="font-bold text-xl mb-4">
              Payment Details
            </h2>

            <p>
              <strong>
                Order ID:
              </strong>{" "}
              {order._id}
            </p>

            <p>
              <strong>
                Payment Method:
              </strong>{" "}
              {order.paymentMethod}
            </p>

            <p>
              <strong>
                Payment Status:
              </strong>{" "}
              {order.paymentStatus}
            </p>

            <p>
              <strong>
                Order Status:
              </strong>{" "}
              {order.orderStatus}
            </p>

          </div>

          {/* DELIVERY DETAILS */}
          <div className="bg-gray-50 p-6 rounded-xl">

            <h2 className="font-bold text-xl mb-4">
              Delivery Details
            </h2>

            <p>
              {order
                .shippingAddress
                ?.fullName ||
                "Customer"}
            </p>

            <p>
              {
                order
                  .shippingAddress
                  ?.phone
              }
            </p>

            <p>
              {
                order
                  .shippingAddress
                  ?.email
              }
            </p>

            {order
              .shippingAddress
              ?.address && (
              <p>
                {
                  order
                    .shippingAddress
                    ?.address
                }
              </p>
            )}

            <p>

              {
                order
                  .shippingAddress
                  ?.city
              }

              {order
                .shippingAddress
                ?.state &&
                `, ${order.shippingAddress.state}`}

              {order
                .shippingAddress
                ?.pincode &&
                ` - ${order.shippingAddress.pincode}`}

            </p>

          </div>

        </div>

        {/* PRODUCTS */}
        <div className="mt-10">

          <h2 className="text-2xl font-bold mb-5">
            Ordered Products
          </h2>

          <div className="space-y-4">

            {order.items?.map(
              (
                item,
                index
              ) => (

                <div
                  key={index}
                  className="flex flex-col md:flex-row justify-between items-center border rounded-xl p-4 gap-4"
                >

                  <div className="flex items-center gap-4">

                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-20 h-20 object-cover rounded-lg"
                    />

                    <div>

                      <h3 className="font-semibold">
                        {item.name}
                      </h3>

                      <p className="text-sm text-gray-500">
                        Qty:{" "}
                        {
                          item.quantity
                        }
                      </p>

                      <p className="text-sm text-gray-500">
                        ₹
                        {
                          item.price
                        }{" "}
                        each
                      </p>

                    </div>

                  </div>

                  <div className="font-bold text-lg">

                    ₹
                    {item.price *
                      item.quantity}

                  </div>

                </div>
              )
            )}

          </div>

        </div>

        {/* TOTAL */}
        <div className="mt-8 border-t pt-6">

          <div className="flex justify-between text-2xl font-bold">

            <span>
              Total Amount
            </span>

            <span>
              ₹
              {
                order.totalAmount
              }
            </span>

          </div>

        </div>

        {/* CONTINUE SHOPPING */}
        <Link
          to="/"
          onClick={() => {

            localStorage.removeItem(
              "paymentVerified"
            );

            localStorage.removeItem(
              "codCartCleared"
            );

            localStorage.removeItem(
              "lastOrderId"
            );
          }}
          className="block text-center mt-8 bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg"
        >
          Continue Shopping
        </Link>

      </div>

    </div>
  );
};

export default PaymentSuccess;
