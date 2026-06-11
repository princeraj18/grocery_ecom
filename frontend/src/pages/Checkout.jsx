import React, { useContext, useEffect, useState } from "react";
import { ShopContext } from "../context/ShopContext";
import api from "../api/Axios";
import { 
  FaUser, 
  FaPhone, 
  FaEnvelope, 
  FaCity, 
  FaMapMarkedAlt, 
  FaMapPin, 
  FaRoad, 
  FaMoneyBillWave, 
  FaCreditCard, 
  FaTicketAlt, 
  FaShoppingBag, 
  FaLock 
} from "react-icons/fa";

const Checkout = () => {
  const { cartItems, clearCart } = useContext(ShopContext);

  const [paymentMethod, setPaymentMethod] = useState("cod");
  const [loading, setLoading] = useState(false);

  // =========================
  // SHIPPING DATA
  // =========================
  const [shippingData, setShippingData] = useState({
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
  const [couponCode, setCouponCode] = useState("");
  const [discount, setDiscount] = useState(0);
  const [appliedCoupon, setAppliedCoupon] = useState("");

  const SHIPPING_CHARGE = 20;

  useEffect(() => {
    const selectedCouponCode = sessionStorage.getItem("selectedCouponCode");

    if (selectedCouponCode) {
      setCouponCode(selectedCouponCode);
      sessionStorage.removeItem("selectedCouponCode");
    }
  }, []);

  // =========================
  // PRICE CALCULATIONS
  // =========================
  const originalSubtotal = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  const subtotal = originalSubtotal - discount;
  const total = subtotal + SHIPPING_CHARGE;

  // =========================
  // HANDLE INPUT CHANGE
  // =========================
  const handleChange = (e) => {
    setShippingData({
      ...shippingData,
      [e.target.name]: e.target.value,
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
      alert("Please fill all shipping details");
      return false;
    }

    if (!/^[0-9]{10}$/.test(shippingData.phone)) {
      alert("Please enter a valid 10 digit phone number");
      return false;
    }

    if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(shippingData.email)) {
      alert("Please enter a valid email");
      return false;
    }

    if (!/^[0-9]{6}$/.test(shippingData.zipcode)) {
      alert("Please enter valid zipcode");
      return false;
    }

    return true;
  };

  // =========================
  // APPLY COUPON
  // =========================
  const handleApplyCoupon = async () => {
    if (appliedCoupon) {
      setAppliedCoupon("");
      setCouponCode("");
      setDiscount(0);
      alert("Coupon Removed");
      return;
    }

    try {
      const code = couponCode.trim().toUpperCase();

      if (!code) {
        return alert("Enter coupon code");
      }

      const res = await api.post("/coupons/validate", {
        code,
        cartItems,
      });

      if (res.data.success) {
        setDiscount(res.data.discount);
        setAppliedCoupon(code);
        alert("Coupon Applied Successfully");
      }
    } catch (error) {
      alert(error.response?.data?.message || "Invalid Coupon");
      setDiscount(0);
      setAppliedCoupon("");
    }
  };

  // =========================
  // PLACE ORDER
  // =========================
  const handlePlaceOrder = async () => {
    if (!validateForm()) return;

    if (cartItems.length === 0) {
      alert("Your cart is empty");
      return;
    }

    try {
      setLoading(true);
      const user = JSON.parse(localStorage.getItem("user"));

      if (!user?._id) {
        alert("Please login first");
        return;
      }

      // =========================
      // CASH ON DELIVERY
      // =========================
      if (paymentMethod === "cod") {
        const res = await api.post("/orders/create", {
          userId: user._id,
          products: cartItems.map((item) => ({
            productId: item.productId || item._id,
            name: item.name,
            image: item.image,
            price: item.price,
            quantity: item.quantity,
            variantId: item.variantId,
            variantSize: item.variantSize || item.size || "Default",
            size: item.variantSize || item.size || "Default",
          })),
          shippingAddress: shippingData,
          totalAmount: total,
          paymentMethod: "COD",
          paymentStatus: "Pending",
        });

        localStorage.setItem("lastOrderId", res.data.order._id);

        // Clear Remote Cart
        await api.delete("/cart/clear", { data: { userId: user._id } });
        // Clear Context & Storage
        await clearCart();
        localStorage.removeItem("cart");

        window.location.href = "/payment-success";
        return;
      }

      // =========================
      // STRIPE PAYMENT
      // =========================
      const res = await api.post("/payment/create-checkout-session", {
        userId: user._id,
        cartItems,
        shippingAddress: shippingData,
        totalAmount: total,
      });

      localStorage.setItem("lastOrderId", res.data.orderId);
      window.location.href = res.data.url;
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || "Failed to place order");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 py-10 px-4 sm:px-6 lg:px-8 transition-colors duration-200">
      <div className="max-w-7xl mx-auto">
        
        {/* PAGE HEADER */}
        <div className="border-b border-slate-200 dark:border-slate-800 pb-5 mb-8">
          <h1 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white sm:text-4xl">
            Secure Checkout
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-2 flex items-center gap-1.5">
            <FaLock className="text-emerald-500 text-xs" /> Complete your shipping and deployment settings below.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 items-start">
          
          {/* LEFT COLUMN: MODULE FORMS */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* MODULE 1: SHIPPING INFORMATION */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800/80 rounded-2xl shadow-sm p-6 sm:p-8">
              <h2 className="text-lg font-black text-slate-900 dark:text-white mb-6 flex items-center gap-2">
                <span className="w-1.5 h-5 bg-[#0c831f] dark:bg-emerald-500 rounded-full inline-block"></span>
                Shipping Information
              </h2>

              <div className="grid md:grid-cols-2 gap-5">
                {/* First Name */}
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-slate-400 dark:text-slate-500">
                    <FaUser className="text-xs" />
                  </span>
                  <input
                    type="text"
                    name="firstName"
                    placeholder="First Name"
                    value={shippingData.firstName}
                    onChange={handleChange}
                    className="w-full bg-slate-50 focus:bg-white dark:bg-slate-950/40 dark:focus:bg-slate-950 border border-slate-200 dark:border-slate-800 focus:border-[#0c831f] dark:focus:border-emerald-500 focus:ring-1 focus:ring-[#0c831f] dark:focus:ring-emerald-500 rounded-xl pl-10 pr-4 py-3 text-sm transition-all outline-none"
                  />
                </div>

                {/* Last Name */}
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-slate-400 dark:text-slate-500">
                    <FaUser className="text-xs" />
                  </span>
                  <input
                    type="text"
                    name="lastName"
                    placeholder="Last Name"
                    value={shippingData.lastName}
                    onChange={handleChange}
                    className="w-full bg-slate-50 focus:bg-white dark:bg-slate-950/40 dark:focus:bg-slate-950 border border-slate-200 dark:border-slate-800 focus:border-[#0c831f] dark:focus:border-emerald-500 focus:ring-1 focus:ring-[#0c831f] dark:focus:ring-emerald-500 rounded-xl pl-10 pr-4 py-3 text-sm transition-all outline-none"
                  />
                </div>

                {/* Phone Number */}
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-slate-400 dark:text-slate-500">
                    <FaPhone className="text-xs" />
                  </span>
                  <input
                    type="tel"
                    name="phone"
                    placeholder="Phone Number (10 digits)"
                    value={shippingData.phone}
                    onChange={handleChange}
                    className="w-full bg-slate-50 focus:bg-white dark:bg-slate-950/40 dark:focus:bg-slate-950 border border-slate-200 dark:border-slate-800 focus:border-[#0c831f] dark:focus:border-emerald-500 focus:ring-1 focus:ring-[#0c831f] dark:focus:ring-emerald-500 rounded-xl pl-10 pr-4 py-3 text-sm transition-all outline-none"
                  />
                </div>

                {/* Email Address */}
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-slate-400 dark:text-slate-500">
                    <FaEnvelope className="text-xs" />
                  </span>
                  <input
                    type="email"
                    name="email"
                    placeholder="Email Address"
                    value={shippingData.email}
                    onChange={handleChange}
                    className="w-full bg-slate-50 focus:bg-white dark:bg-slate-950/40 dark:focus:bg-slate-950 border border-slate-200 dark:border-slate-800 focus:border-[#0c831f] dark:focus:border-emerald-500 focus:ring-1 focus:ring-[#0c831f] dark:focus:ring-emerald-500 rounded-xl pl-10 pr-4 py-3 text-sm transition-all outline-none"
                  />
                </div>

                {/* City */}
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-slate-400 dark:text-slate-500">
                    <FaCity className="text-xs" />
                  </span>
                  <input
                    type="text"
                    name="city"
                    placeholder="City"
                    value={shippingData.city}
                    onChange={handleChange}
                    className="w-full bg-slate-50 focus:bg-white dark:bg-slate-950/40 dark:focus:bg-slate-950 border border-slate-200 dark:border-slate-800 focus:border-[#0c831f] dark:focus:border-emerald-500 focus:ring-1 focus:ring-[#0c831f] dark:focus:ring-emerald-500 rounded-xl pl-10 pr-4 py-3 text-sm transition-all outline-none"
                  />
                </div>

                {/* State */}
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-slate-400 dark:text-slate-500">
                    <FaMapMarkedAlt className="text-xs" />
                  </span>
                  <input
                    type="text"
                    name="state"
                    placeholder="State"
                    value={shippingData.state}
                    onChange={handleChange}
                    className="w-full bg-slate-50 focus:bg-white dark:bg-slate-950/40 dark:focus:bg-slate-950 border border-slate-200 dark:border-slate-800 focus:border-[#0c831f] dark:focus:border-emerald-500 focus:ring-1 focus:ring-[#0c831f] dark:focus:ring-emerald-500 rounded-xl pl-10 pr-4 py-3 text-sm transition-all outline-none"
                  />
                </div>

                {/* Pincode */}
                <div className="relative md:col-span-2">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-slate-400 dark:text-slate-500">
                    <FaMapPin className="text-xs" />
                  </span>
                  <input
                    type="text"
                    name="zipcode"
                    placeholder="Pincode (6 digits)"
                    value={shippingData.zipcode}
                    onChange={handleChange}
                    className="w-full bg-slate-50 focus:bg-white dark:bg-slate-950/40 dark:focus:bg-slate-950 border border-slate-200 dark:border-slate-800 focus:border-[#0c831f] dark:focus:border-emerald-500 focus:ring-1 focus:ring-[#0c831f] dark:focus:ring-emerald-500 rounded-xl pl-10 pr-4 py-3 text-sm transition-all outline-none"
                  />
                </div>
              </div>

              {/* Street Textarea */}
              <div className="relative mt-5">
                <span className="absolute top-3.5 left-4 text-slate-400 dark:text-slate-500">
                  <FaRoad className="text-xs" />
                </span>
                <textarea
                  rows="3"
                  name="street"
                  placeholder="Full Street Address, Landmark, Apartment Number"
                  value={shippingData.street}
                  onChange={handleChange}
                  className="w-full bg-slate-50 focus:bg-white dark:bg-slate-950/40 dark:focus:bg-slate-950 border border-slate-200 dark:border-slate-800 focus:border-[#0c831f] dark:focus:border-emerald-500 focus:ring-1 focus:ring-[#0c831f] dark:focus:ring-emerald-500 rounded-xl pl-10 pr-4 py-3 text-sm transition-all outline-none resize-none"
                />
              </div>
            </div>

            {/* MODULE 2: PAYMENT STRATEGY */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800/80 rounded-2xl shadow-sm p-6 sm:p-8">
              <h2 className="text-lg font-black text-slate-900 dark:text-white mb-6 flex items-center gap-2">
                <span className="w-1.5 h-5 bg-[#0c831f] dark:bg-emerald-500 rounded-full inline-block"></span>
                Payment Method
              </h2>

              <div className="grid sm:grid-cols-2 gap-4">
                {/* COD Radio Card */}
                <label 
                  className={`flex items-center gap-4 border rounded-xl p-5 cursor-pointer transition-all ${
                    paymentMethod === "cod"
                      ? "border-[#0c831f] dark:border-emerald-500 bg-emerald-50/20 dark:bg-emerald-950/10 ring-1 ring-[#0c831f] dark:ring-emerald-500"
                      : "border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/30"
                  }`}
                >
                  <input
                    type="radio"
                    value="cod"
                    checked={paymentMethod === "cod"}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="w-4 h-4 text-[#0c831f] dark:text-emerald-500 focus:ring-[#0c831f] dark:focus:ring-emerald-500 border-slate-300 dark:border-slate-700"
                  />
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-amber-100 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 rounded-lg">
                      <FaMoneyBillWave />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-900 dark:text-white">Cash On Delivery</p>
                      <p className="text-xs text-slate-400">Pay inside your doorstep</p>
                    </div>
                  </div>
                </label>

                {/* Card Radio Card */}
                <label 
                  className={`flex items-center gap-4 border rounded-xl p-5 cursor-pointer transition-all ${
                    paymentMethod === "card"
                      ? "border-[#0c831f] dark:border-emerald-500 bg-emerald-50/20 dark:bg-emerald-950/10 ring-1 ring-[#0c831f] dark:ring-emerald-500"
                      : "border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/30"
                  }`}
                >
                  <input
                    type="radio"
                    value="card"
                    checked={paymentMethod === "card"}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="w-4 h-4 text-[#0c831f] dark:text-emerald-500 focus:ring-[#0c831f] dark:focus:ring-emerald-500 border-slate-300 dark:border-slate-700"
                  />
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-blue-100 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 rounded-lg">
                      <FaCreditCard />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-900 dark:text-white">Online Card / Stripe</p>
                      <p className="text-xs text-slate-400">Secure immediate processing</p>
                    </div>
                  </div>
                </label>
              </div>
            </div>

          </div>

          {/* RIGHT COLUMN: STICKY ORDER SUMMARY PANEL */}
          <div className="lg:sticky lg:top-6">
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800/80 rounded-2xl shadow-sm p-6">
              
              <h2 className="text-lg font-black text-slate-900 dark:text-white mb-4 flex items-center gap-2 pb-3 border-b border-slate-100 dark:border-slate-800/60">
                <FaShoppingBag className="text-[#0c831f] dark:text-emerald-500 text-sm" /> 
                Order Summary
              </h2>

              {/* CART ITEMS FEED */}
              {cartItems.length === 0 ? (
                <p className="text-sm text-slate-400 text-center py-6">Your cart is current empty</p>
              ) : (
                <div className="max-h-60 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800/40 pr-1 space-y-3 mb-4">
                  {cartItems.map((item, index) => (
                    <div key={index} className="flex justify-between items-start text-sm pt-3 first:pt-0 gap-3">
                      <div className="min-w-0">
                        <p className="font-bold text-slate-900 dark:text-white truncate">{item.name}</p>
                        <div className="flex gap-2 text-xs text-slate-400 font-medium mt-0.5">
                          <span>Qty: <span className="text-slate-600 dark:text-slate-300 font-bold">{item.quantity}</span></span>
                          {(item.variantSize || item.size) && (
                            <>
                              <span>•</span>
                              <span>Size: <span className="text-slate-600 dark:text-slate-300 font-bold">{item.variantSize || item.size}</span></span>
                            </>
                          )}
                        </div>
                      </div>
                      <span className="font-extrabold text-slate-900 dark:text-slate-200 shrink-0">
                        ₹{item.price * item.quantity}
                      </span>
                    </div>
                  ))}
                </div>
              )}

              {/* COUPON INPUT FIELD */}
              <div className="pt-4 border-t border-slate-100 dark:border-slate-800/60">
                <label className="block text-xs font-black uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1">
                  <FaTicketAlt /> Voucher Coupon Code
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="PROMO100"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    className="flex-1 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 focus:border-[#0c831f] dark:focus:border-emerald-500 focus:ring-1 focus:ring-[#0c831f] dark:focus:ring-emerald-500 rounded-xl px-3 py-2 text-sm uppercase font-mono tracking-wider outline-none"
                  />
                  <button
                    onClick={handleApplyCoupon}
                    className={`px-4 rounded-xl text-xs font-black tracking-wide text-white transition-all ${
                      appliedCoupon 
                        ? "bg-rose-600 hover:bg-rose-700 shadow-sm" 
                        : "bg-slate-900 hover:bg-black dark:bg-emerald-600 dark:hover:bg-emerald-500 shadow-sm"
                    }`}
                  >
                    {appliedCoupon ? "Remove" : "Apply"}
                  </button>
                </div>

                {appliedCoupon && (
                  <p className="text-emerald-600 dark:text-emerald-400 text-xs font-semibold mt-2 flex items-center gap-1 animate-pulse">
                    ✓ Code "{appliedCoupon}" successfully matched!
                  </p>
                )}
              </div>

              {/* FINANCIALS PANEL */}
              <div className="space-y-3 pt-5 mt-5 border-t border-slate-100 dark:border-slate-800/60 text-sm">
                <div className="flex justify-between items-center text-slate-500 dark:text-slate-400">
                  <span>Gross Original Price</span>
                  <span className="font-medium text-slate-800 dark:text-slate-200">₹{originalSubtotal}</span>
                </div>

                {discount > 0 && (
                  <div className="flex justify-between items-center text-emerald-600 dark:text-emerald-400 font-medium">
                    <span>Voucher Discount</span>
                    <span>- ₹{discount}</span>
                  </div>
                )}

                <div className="flex justify-between items-center text-slate-500 dark:text-slate-400">
                  <span>Net Subtotal</span>
                  <span className="font-medium text-slate-800 dark:text-slate-200">₹{subtotal}</span>
                </div>

                <div className="flex justify-between items-center text-slate-500 dark:text-slate-400">
                  <span>Shipping & Handling</span>
                  <span className="font-medium text-slate-800 dark:text-slate-200">₹{SHIPPING_CHARGE}</span>
                </div>

                <div className="pt-4 border-t border-slate-100 dark:border-slate-800/60 flex justify-between items-baseline">
                  <span className="text-base font-black text-slate-900 dark:text-white">Grand Total</span>
                  <span className="text-2xl font-black text-[#0c831f] dark:text-emerald-400">₹{total}</span>
                </div>
              </div>

              {/* PRIMARY ORDER TRIGGER BUTTON */}
              <button
                onClick={handlePlaceOrder}
                disabled={loading}
                className="w-full mt-6 bg-[#0c831f] hover:bg-[#096b19] dark:bg-emerald-600 dark:hover:bg-emerald-500 disabled:bg-slate-300 dark:disabled:bg-slate-800 text-white font-black text-sm py-3.5 rounded-xl shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 group"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                    <span>Processing Secure Payload...</span>
                  </>
                ) : (
                  <>
                    <span>{paymentMethod === "cod" ? "Confirm Order" : "Proceed to Payment"}</span>
                  </>
                )}
              </button>
              
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};

export default Checkout;