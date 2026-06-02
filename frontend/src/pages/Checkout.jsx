// Checkout.jsx

import React, {
  useContext,
  useEffect,
  useState,
} from "react";

import { ShopContext } from "../context/ShopContext";
import api from "../api/Axios";

const Checkout = () => {
  const {
    cartItems,
    clearCart,
  } = useContext(ShopContext);

  const [paymentMethod, setPaymentMethod] =
    useState("cod");

  const [loading, setLoading] =
    useState(false);

  // =========================
  // SHIPPING DATA
  // =========================
  const [shippingData, setShippingData] =
    useState({
      firstName: "",
      lastName: "",
      phone: "",
      email: "",
      city: "",
      state: "",
      zipcode: "",
      street: "",
      country: "India",
    });

  // =========================
  // COUPON STATES
  // =========================
  const [couponCode, setCouponCode] =
    useState("");

  const [discount, setDiscount] =
    useState(0);

  const [appliedCoupon, setAppliedCoupon] =
    useState("");

  const SHIPPING_CHARGE = 20;

  useEffect(() => {
    const selectedCouponCode =
      sessionStorage.getItem(
        "selectedCouponCode"
      );

    if (selectedCouponCode) {
      setCouponCode(
        selectedCouponCode
      );

      sessionStorage.removeItem(
        "selectedCouponCode"
      );
    }
  }, []);

  // =========================
  // PRICE CALCULATIONS
  // =========================
  const originalSubtotal =
    cartItems.reduce(
      (total, item) =>
        total +
        item.price * item.quantity,
      0
    );

  const subtotal =
    originalSubtotal - discount;

  const total =
    subtotal + SHIPPING_CHARGE;

  // =========================
  // HANDLE INPUT CHANGE
  // =========================
  const handleChange = (e) => {
    setShippingData({
      ...shippingData,
      [e.target.name]:
        e.target.value,
    });
  };

  // =========================
  // VALIDATE FORM
  // =========================
  const validateForm = () => {
    if (
      !shippingData.firstName.trim() ||
      !shippingData.lastName.trim() ||
      !shippingData.phone.trim() ||
      !shippingData.email.trim() ||
      !shippingData.city.trim() ||
      !shippingData.state.trim() ||
      !shippingData.zipcode.trim() ||
      !shippingData.street.trim()
    ) {
      alert(
        "Please fill all shipping details"
      );
      return false;
    }

    if (
      !/^[0-9]{10}$/.test(
        shippingData.phone
      )
    ) {
      alert(
        "Please enter a valid 10 digit phone number"
      );
      return false;
    }

    if (
      !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(
        shippingData.email
      )
    ) {
      alert(
        "Please enter a valid email"
      );
      return false;
    }

    if (
      !/^[0-9]{6}$/.test(
        shippingData.zipcode
      )
    ) {
      alert(
        "Please enter valid zipcode"
      );
      return false;
    }

    return true;
  };

  // =========================
  // APPLY COUPON
  // =========================
  const handleApplyCoupon =
    async () => {
      // REMOVE COUPON
      if (appliedCoupon) {
        setAppliedCoupon("");
        setCouponCode("");
        setDiscount(0);

        alert("Coupon Removed");
        return;
      }

      try {
        const code =
          couponCode
            .trim()
            .toUpperCase();

        if (!code) {
          return alert(
            "Enter coupon code"
          );
        }

        const res =
          await api.post(
            "/coupons/validate",
            {
              code,
              cartItems,
            }
          );

        if (res.data.success) {
          setDiscount(
            res.data.discount
          );

          setAppliedCoupon(
            code
          );

          alert(
            "Coupon Applied Successfully"
          );
        }
      } catch (error) {
        alert(
          error.response?.data
            ?.message ||
            "Invalid Coupon"
        );

        setDiscount(0);
        setAppliedCoupon("");
      }
    };

  // =========================
  // PLACE ORDER
  // =========================
  const handlePlaceOrder =
    async () => {
      if (!validateForm()) return;

      if (
        cartItems.length === 0
      ) {
        alert(
          "Your cart is empty"
        );
        return;
      }

      try {
        setLoading(true);

        const user = JSON.parse(
          localStorage.getItem(
            "user"
          )
        );

        if (!user?._id) {
          alert(
            "Please login first"
          );
          return;
        }

        // =========================
        // CASH ON DELIVERY
        // =========================
        if (
          paymentMethod === "cod"
        ) {
          const res =
            await api.post(
              "/orders/create",
              {
                userId: user._id,

                products:
                  cartItems.map(
                    (item) => ({
                      productId:
                        item.productId ||
                        item._id,

                      name:
                        item.name,

                      image:
                        item.image,

                      price:
                        item.price,

                      quantity:
                        item.quantity,

                      variantId:
                        item.variantId,

                      variantSize:
                        item.variantSize ||
                        item.size ||
                        "Default",

                      size:
                        item.variantSize ||
                        item.size ||
                        "Default",
                    })
                  ),

                shippingAddress:
                  shippingData,

                totalAmount:
                  total,

                paymentMethod:
                  "COD",

                paymentStatus:
                  "Pending",
              }
            );

          localStorage.setItem(
            "lastOrderId",
            res.data.order._id
          );

          // CLEAR DATABASE CART
          await api.delete(
            "/cart/clear",
            {
              data: {
                userId:
                  user._id,
              },
            }
          );

          // CLEAR CONTEXT
          await clearCart();

          // CLEAR LOCAL STORAGE
          localStorage.removeItem(
            "cart"
          );

          window.location.href =
            "/payment-success";

          return;
        }

        // =========================
        // STRIPE PAYMENT
        // =========================
        const res =
          await api.post(
            "/payment/create-checkout-session",
            {
              userId: user._id,

              cartItems,

              shippingAddress:
                shippingData,

              totalAmount:
                total,
            }
          );

        localStorage.setItem(
          "lastOrderId",
          res.data.orderId
        );

        window.location.href =
          res.data.url;
      } catch (error) {
        console.log(error);

        alert(
          error.response?.data
            ?.message ||
            "Failed to place order"
        );
      } finally {
        setLoading(false);
      }
    };

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 lg:px-10">

      <div className="max-w-7xl mx-auto">

        <h1 className="text-4xl font-bold mb-10">
          Checkout
        </h1>

        <div className="grid lg:grid-cols-3 gap-8">

          {/* LEFT SIDE */}
          <div className="lg:col-span-2 space-y-8">

            {/* SHIPPING */}
            <div className="bg-white rounded-2xl shadow-md p-6">

              <h2 className="text-2xl font-semibold mb-6">
                Shipping Address
              </h2>

              <div className="grid md:grid-cols-2 gap-5">

                <input
                  type="text"
                  name="firstName"
                  placeholder="First Name"
                  value={
                    shippingData.firstName
                  }
                  onChange={
                    handleChange
                  }
                  className="border rounded-lg px-4 py-3"
                />

                <input
                  type="text"
                  name="lastName"
                  placeholder="Last Name"
                  value={
                    shippingData.lastName
                  }
                  onChange={
                    handleChange
                  }
                  className="border rounded-lg px-4 py-3"
                />

                <input
                  type="tel"
                  name="phone"
                  placeholder="Phone Number"
                  value={
                    shippingData.phone
                  }
                  onChange={
                    handleChange
                  }
                  className="border rounded-lg px-4 py-3"
                />

                <input
                  type="email"
                  name="email"
                  placeholder="Email Address"
                  value={
                    shippingData.email
                  }
                  onChange={
                    handleChange
                  }
                  className="border rounded-lg px-4 py-3"
                />

                <input
                  type="text"
                  name="city"
                  placeholder="City"
                  value={
                    shippingData.city
                  }
                  onChange={
                    handleChange
                  }
                  className="border rounded-lg px-4 py-3"
                />

                <input
                  type="text"
                  name="state"
                  placeholder="State"
                  value={
                    shippingData.state
                  }
                  onChange={
                    handleChange
                  }
                  className="border rounded-lg px-4 py-3"
                />

                <input
                  type="text"
                  name="zipcode"
                  placeholder="Pincode"
                  value={
                    shippingData.zipcode
                  }
                  onChange={
                    handleChange
                  }
                  className="border rounded-lg px-4 py-3"
                />
              </div>

              <textarea
                rows="4"
                name="street"
                placeholder="Full Address"
                value={
                  shippingData.street
                }
                onChange={
                  handleChange
                }
                className="w-full mt-5 border rounded-lg px-4 py-3"
              />
            </div>

            {/* PAYMENT */}
            <div className="bg-white rounded-2xl shadow-md p-6">

              <h2 className="text-2xl font-semibold mb-6">
                Payment Method
              </h2>

              <div className="space-y-4">

                <label className="flex items-center gap-3 border rounded-lg p-4 cursor-pointer">

                  <input
                    type="radio"
                    value="cod"
                    checked={
                      paymentMethod ===
                      "cod"
                    }
                    onChange={(e) =>
                      setPaymentMethod(
                        e.target.value
                      )
                    }
                  />

                  Cash On Delivery
                </label>

                <label className="flex items-center gap-3 border rounded-lg p-4 cursor-pointer">

                  <input
                    type="radio"
                    value="card"
                    checked={
                      paymentMethod ===
                      "card"
                    }
                    onChange={(e) =>
                      setPaymentMethod(
                        e.target.value
                      )
                    }
                  />

                  Debit / Credit Card
                </label>
              </div>
            </div>
          </div>

          {/* RIGHT SIDE */}
          <div>

            <div className="bg-white rounded-2xl shadow-md p-6 sticky top-5">

              <h2 className="text-2xl font-semibold mb-6">
                Order Summary
              </h2>

              {cartItems.length ===
              0 ? (
                <p>
                  Your cart is empty
                </p>
              ) : (
                cartItems.map(
                  (
                    item,
                    index
                  ) => (
                    <div
                      key={index}
                      className="flex justify-between mb-4"
                    >
                      <div>

                        <p className="font-medium">
                          {item.name}
                        </p>

                        <p className="text-sm text-gray-500">
                          Qty:{" "}
                          {
                            item.quantity
                          }
                        </p>

                        {(item.variantSize ||
                          item.size) && (
                          <p className="text-sm text-gray-500">
                            Size:{" "}
                            {
                              item.variantSize ||
                              item.size
                            }
                          </p>
                        )}
                      </div>

                      <span>
                        ₹
                        {item.price *
                          item.quantity}
                      </span>
                    </div>
                  )
                )
              )}

              {/* COUPON */}
              <div className="mt-5">

                <h3 className="font-semibold mb-3">
                  Apply Coupon
                </h3>

                <div className="flex gap-2">

                  <input
                    type="text"
                    placeholder="Enter Coupon Code"
                    value={
                      couponCode
                    }
                    onChange={(e) =>
                      setCouponCode(
                        e.target.value
                      )
                    }
                    className="flex-1 border rounded-lg px-4 py-2"
                  />

                  <button
                    onClick={
                      handleApplyCoupon
                    }
                    className={`px-4 rounded-lg text-white ${
                      appliedCoupon
                        ? "bg-red-600 hover:bg-red-700"
                        : "bg-blue-600 hover:bg-blue-700"
                    }`}
                  >
                    {appliedCoupon
                      ? "Applied"
                      : "Apply"}
                  </button>
                </div>

                {appliedCoupon && (
                  <p className="text-green-600 text-sm mt-2">
                    Coupon Applied:{" "}
                    {
                      appliedCoupon
                    }
                  </p>
                )}
              </div>

              <hr className="my-4" />

              <div className="flex justify-between mb-3">

                <span>
                  Original Price
                </span>

                <span>
                  ₹
                  {
                    originalSubtotal
                  }
                </span>
              </div>

              {discount > 0 && (
                <div className="flex justify-between mb-3 text-green-600">

                  <span>
                    Discount
                  </span>

                  <span>
                    - ₹
                    {discount}
                  </span>
                </div>
              )}

              <div className="flex justify-between mb-3">

                <span>
                  Subtotal
                </span>

                <span>
                  ₹{subtotal}
                </span>
              </div>

              <div className="flex justify-between mb-3">

                <span>
                  Shipping
                </span>

                <span>
                  ₹
                  {
                    SHIPPING_CHARGE
                  }
                </span>
              </div>

              <hr className="my-4" />

              <div className="flex justify-between text-xl font-bold">

                <span>Total</span>

                <span>
                  ₹{total}
                </span>
              </div>

              <button
                onClick={
                  handlePlaceOrder
                }
                disabled={loading}
                className="w-full mt-6 bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg"
              >
                {loading
                  ? "Processing..."
                  : "Place Order"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
