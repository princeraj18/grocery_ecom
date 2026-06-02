import {
  useContext,
  useState,
  useEffect,
} from "react";

import { useNavigate } from "react-router-dom";

import { ShopContext } from "../context/ShopContext";

const Cart = () => {
  const navigate = useNavigate();
const user = JSON.parse(
  localStorage.getItem("user")
);
  const {
    cartItems,
    increaseQuantity,
    decreaseQuantity,
    removeFromCart,
  } = useContext(ShopContext);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    const t = setTimeout(
      () => setLoading(false),
      50
    );

    return () =>
      clearTimeout(t);
  }, [cartItems]);

  // =========================
  // TOTALS
  // =========================
  const subtotal =
    cartItems.reduce(
      (sum, item) =>
        sum +
        (item.price || 0) *
          (item.quantity || 0),
      0
    );

  const shipping =
    cartItems.length > 0
      ? 20
      : 0;

  const total =
    subtotal + shipping;

  // =========================
  // LOADING
  // =========================
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-lg font-medium text-gray-600 animate-pulse">
          Loading Cart...
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto py-6 px-4 sm:py-10 sm:px-6 lg:px-8 bg-gray-50 min-h-screen">

      {/* HEADING */}
      <h1 className="text-2xl sm:text-4xl font-bold mb-6 sm:mb-8 text-gray-900">
        Shopping Cart
      </h1>

      {/* EMPTY CART */}
      {cartItems.length ===
      0 ? (
        <div className="bg-white p-6 sm:p-12 rounded-xl shadow-sm text-center border border-gray-100 max-w-xl mx-auto">

          <h2 className="text-xl sm:text-2xl font-semibold text-gray-700">
            Your Cart is Empty
          </h2>

          <p className="text-gray-500 mt-2 text-sm sm:text-base">
            Looks like you
            haven't added
            anything to your
            cart yet.
          </p>

          <button
            onClick={() =>
              navigate(
                "/products"
              )
            }
            className="mt-6 w-full sm:w-auto bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-6 py-3 rounded-lg transition-colors shadow-sm"
          >
            Continue Shopping
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">

          {/* CART ITEMS */}
          <div className="space-y-4 lg:col-span-2">

            {cartItems.map(
              (item, index) => (
                <div
                  key={`${item.productId}-${item.variantSize} `}
                  className="bg-white p-4 sm:p-5 rounded-xl shadow-sm border border-gray-100 flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-5"
                >

                  {/* IMAGE */}
                  <img
                    src={
                      item.image
                    }
                    alt={
                      item.name
                    }
                    className="w-20 h-20 sm:w-24 sm:h-24 object-cover rounded-lg border border-gray-100 mix-blend-multiply"
                  />

                  {/* PRODUCT DETAILS */}
                  <div className="flex-1 min-w-0">

                    <h3 className="font-semibold text-base sm:text-lg text-gray-900 truncate">
                      {item.name}
                    </h3>

                    {/* VARIANT */}
                    <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
                      Size:
                      <span className="font-medium text-gray-700 ml-1">
                        {item.variantSize ||
                          item.size}
                      </span>
                    </p>

                    {/* MOBILE PRICE */}
                    <p className="text-indigo-600 font-bold mt-1.5 sm:hidden">
                      ₹
                      {
                        item.price
                      }
                    </p>
                  </div>

                  {/* DESKTOP PRICE */}
                  <div className="hidden sm:block text-left px-2">
                    <p className="text-sm text-gray-400">
                      Price
                    </p>

                    <p className="text-gray-700 font-medium">
                      ₹
                      {
                        item.price
                      }
                    </p>
                  </div>

                  {/* ACTIONS */}
                  <div className="flex w-full sm:w-auto items-center justify-between sm:justify-end gap-6 pt-3 sm:pt-0 border-t sm:border-t-0 border-gray-100">

                    {/* QUANTITY */}
                    <div className="flex items-center border border-gray-200 rounded-lg bg-gray-50">

                      {/* DECREASE */}
                      <button
                        onClick={() =>
                          decreaseQuantity(
                            item.productId,
                            item.variantSize
                          )
                        }
                        className="px-3 py-1.5 text-gray-600 hover:bg-gray-200 rounded-l-lg transition-colors font-medium"
                      >
                        -
                      </button>

                      <span className="px-3 py-1.5 font-semibold text-gray-800 text-sm sm:text-base min-w-[2rem] text-center">
                        {
                          item.quantity
                        }
                      </span>

                      {/* INCREASE */}
                      <button
                        onClick={() =>
                          increaseQuantity(
                            item.productId,
                            item.variantSize
                          )
                        }
                        className="px-3 py-1.5 text-gray-600 hover:bg-gray-200 rounded-r-lg transition-colors font-medium"
                      >
                        +
                      </button>
                    </div>

                    {/* TOTAL */}
                    <div className="sm:w-24 text-right">

                      <p className="text-xs text-gray-400 sm:hidden">
                        Total
                      </p>

                      <p className="font-bold text-gray-900 text-base sm:text-lg">
                        ₹
                        {item.price *
                          item.quantity}
                      </p>
                    </div>

                    {/* REMOVE */}
                    <button
                      onClick={() =>
                        removeFromCart(
                          item.productId,
                          item.variantSize
                        )
                      }
                      className="text-sm font-medium text-red-500 hover:text-red-700 transition-colors p-1"
                    >
                      Remove
                    </button>

                  </div>
                </div>
              )
            )}
          </div>

          {/* ORDER SUMMARY */}
          <div className="bg-white shadow-sm border border-gray-100 rounded-xl p-5 sm:p-6 lg:sticky lg:top-6">

            <h2 className="text-xl sm:text-2xl font-bold mb-5 text-gray-900">
              Order Summary
            </h2>

            <div className="space-y-3.5 text-sm sm:text-base text-gray-600">

              <div className="flex justify-between">
                <span>
                  Products Total
                </span>

                <span className="font-medium text-gray-900">
                  ₹{subtotal}
                </span>
              </div>

              <div className="flex justify-between">
                <span>
                  Shipping Charge
                </span>

                <span className="font-medium text-gray-900">
                  ₹{shipping}
                </span>
              </div>

              <hr className="border-gray-200 my-4" />

              <div className="flex justify-between text-lg sm:text-xl font-bold text-gray-900">

                <span>
                  Grand Total
                </span>

                <span className="text-indigo-600">
                  ₹{total}
                </span>
              </div>
            </div>

            <button
              onClick={() =>
                navigate(
                  "/coupons"
                )
              }
              className="mt-5 w-full rounded-lg border border-[#0c831f] py-3 text-center font-bold text-[#0c831f] hover:bg-[#e9f6eb]"
            >
              View Available Coupons
            </button>

          {/* CHECKOUT */}
<button
  onClick={() => {

    if (!user) {

      alert("please login to proceed to checkout");
      navigate("/login");

      return;
    }

    navigate("/checkout");
  }}
  className="w-full mt-6 bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3 rounded-lg shadow-sm transition-colors tracking-wide text-center"
>
  Proceed To Checkout
</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
