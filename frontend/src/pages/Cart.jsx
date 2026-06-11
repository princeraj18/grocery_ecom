import { useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ShopContext } from "../context/ShopContext";
import { FaTrashAlt, FaMinus, FaPlus, FaShoppingCart, FaTicketAlt, FaArrowRight } from "react-icons/fa";

const Cart = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));
  
  const {
    cartItems,
    increaseQuantity,
    decreaseQuantity,
    removeFromCart,
  } = useContext(ShopContext);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 80);
    return () => clearTimeout(t);
  }, [cartItems]);

  // ======================================
  // TOTALS LOGIC
  // ======================================
  const subtotal = cartItems.reduce(
    (sum, item) => sum + (item.price || 0) * (item.quantity || 0),
    0
  );

  const shipping = cartItems.length > 0 ? 20 : 0;
  const total = subtotal + shipping;

  // ======================================
  // LOADING SKELETON
  // ======================================
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-950 gap-4">
        <div className="w-10 h-10 border-4 border-[#0c831f]/20 border-t-[#0c831f] dark:border-emerald-500/20 dark:border-t-emerald-500 rounded-full animate-spin"></div>
        <p className="text-sm font-bold tracking-wide text-slate-500 dark:text-slate-400">
          Syncing Your Cart...
        </p>
      </div>
    );
  }

  return (
    <div className="bg-slate-50 dark:bg-slate-950 min-h-screen text-slate-800 dark:text-slate-100 transition-colors duration-200">
      <div className="max-w-6xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
        
        <h1 className="text-2xl sm:text-3xl font-black mb-8 tracking-tight flex items-center gap-3">
          <FaShoppingCart className="text-[#0c831f] dark:text-emerald-500 text-xl sm:text-2xl" />
          Shopping Cart
        </h1>

        {/* EMPTY STATE */}
        {cartItems.length === 0 ? (
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800/80 p-8 sm:p-16 rounded-2xl shadow-sm text-center max-w-lg mx-auto">
            <div className="w-16 h-16 bg-slate-100 dark:bg-slate-950 text-slate-400 dark:text-slate-600 rounded-2xl flex items-center justify-center mx-auto mb-5">
              <FaShoppingCart className="text-2xl" />
            </div>
            <h2 className="text-xl font-black text-slate-800 dark:text-white tracking-tight">
              Your basket is empty
            </h2>
            <p className="text-slate-500 dark:text-slate-400 mt-2 text-sm max-w-sm mx-auto leading-relaxed">
              Looks like you haven't added any fresh groceries or essentials to your delivery yet.
            </p>
            <button
              onClick={() => navigate("/products")}
              className="mt-6 w-full sm:w-auto bg-[#0c831f] hover:bg-[#096b19] dark:bg-emerald-600 dark:hover:bg-emerald-500 text-white font-black text-sm px-6 py-3 rounded-xl shadow-sm transition-all active:scale-95"
            >
              Browse Products
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            
            {/* CART ITEM RUN-LIST */}
            <div className="space-y-4 lg:col-span-2">
              {cartItems.map((item) => (
                <div
                  key={`${item.productId}-${item.variantSize}`}
                  className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800/80 p-4 sm:p-5 rounded-xl shadow-sm flex items-center gap-4 sm:gap-5"
                >
                  {/* IMAGE CONTAINER */}
                  <div className="w-20 h-20 sm:w-24 sm:h-24 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-100 dark:border-slate-800 p-2 flex items-center justify-center shrink-0">
                    <img
                      src={item.image || "https://via.placeholder.com/150"}
                      alt={item.name}
                      className="max-w-full max-h-full object-contain"
                    />
                  </div>

                  {/* DATA DISPATCHER CONTAINER */}
                  <div className="flex-1 min-w-0 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    
                    {/* DETAILS GAP TEXT */}
                    <div className="min-w-0">
                      <h3 className="font-bold text-sm sm:text-base text-slate-900 dark:text-white truncate">
                        {item.name}
                      </h3>
                      <p className="text-xs font-semibold text-slate-400 dark:text-slate-500 mt-0.5 flex items-center gap-1">
                        Pack Size: 
                        <span className="text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded text-[11px]">
                          {item.variantSize || item.size}
                        </span>
                      </p>
                      
                      {/* INLINE MOBILE RATE DISPLAY */}
                      <p className="text-sm font-black text-[#0c831f] dark:text-emerald-400 mt-1.5 sm:hidden">
                        ₹{item.price}
                      </p>
                    </div>

                    {/* ACTION SHELF ASSEMBLIES */}
                    <div className="flex items-center justify-between sm:justify-end gap-4 sm:gap-6 border-t sm:border-t-0 border-slate-100 dark:border-slate-800/60 pt-2.5 sm:pt-0">
                      
                      {/* QUANTITY CONTROL STEPPER */}
                      <div className="flex items-center border border-slate-200 dark:border-slate-800 rounded-xl bg-slate-50 dark:bg-slate-950 overflow-hidden h-9">
                        <button
                          onClick={() => decreaseQuantity(item.productId, item.variantSize)}
                          className="px-2.5 h-full text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
                        >
                          <FaMinus className="text-[10px]" />
                        </button>
                        <span className="px-3 font-bold text-slate-800 dark:text-slate-100 text-sm min-w-[2rem] text-center select-none">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => increaseQuantity(item.productId, item.variantSize)}
                          className="px-2.5 h-full text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
                        >
                          <FaPlus className="text-[10px]" />
                        </button>
                      </div>

                      {/* STRUCTURAL LINE RATE PRICING METRIC */}
                      <div className="hidden sm:block text-right min-w-[4.5rem]">
                        <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Unit Price</p>
                        <p className="text-sm font-extrabold text-slate-600 dark:text-slate-400 mt-0.5">₹{item.price}</p>
                      </div>

                      {/* ROW GRAND TOTAL QUANTITY BREAKOUT */}
                      <div className="text-right min-w-[4.5rem]">
                        <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider hidden sm:block">Subtotal</p>
                        <p className="font-black text-slate-900 dark:text-white text-base mt-0.5">
                          ₹{item.price * item.quantity}
                        </p>
                      </div>

                      {/* FLUSH ACTIONS BUTTON ROW */}
                      <button
                        onClick={() => removeFromCart(item.productId, item.variantSize)}
                        className="text-slate-400 hover:text-red-500 dark:hover:text-red-400 transition-colors p-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/40"
                        title="Remove item"
                      >
                        <FaTrashAlt className="text-sm" />
                      </button>
                    </div>

                  </div>
                </div>
              ))}
            </div>

            {/* ORDER SUMMARY SIDEBAR MODULE */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800/80 rounded-2xl p-5 sm:p-6 lg:sticky lg:top-24 shadow-sm">
              <h2 className="text-lg font-black mb-5 text-slate-900 dark:text-white tracking-tight border-b border-slate-100 dark:border-slate-800 pb-3">
                Payment Summary
              </h2>

              <div className="space-y-3.5 text-sm text-slate-600 dark:text-slate-400">
                <div className="flex justify-between items-center">
                  <span className="font-medium">Basket Value</span>
                  <span className="font-bold text-slate-900 dark:text-white">₹{subtotal}</span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="font-medium">Delivery Fee</span>
                  <span className="font-bold text-slate-900 dark:text-white">₹{shipping}</span>
                </div>

                <hr className="border-slate-200 dark:border-slate-800/80 my-4" />

                <div className="flex justify-between items-center text-base font-black text-slate-900 dark:text-white">
                  <span>Grand Total</span>
                  <span className="text-lg text-[#0c831f] dark:text-emerald-400 font-black">
                    ₹{total}
                  </span>
                </div>
              </div>

              {/* ACTION: COUPONS SHEET TRANSITION AREA */}
              <button
                onClick={() => navigate("/coupons")}
                className="mt-6 w-full flex items-center justify-center gap-2 rounded-xl border-2 border-dashed border-slate-200 dark:border-slate-800 py-3 text-center text-xs font-bold text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-slate-950 hover:border-[#0c831f] dark:hover:border-emerald-500 hover:text-[#0c831f] dark:hover:text-emerald-400 transition-colors"
              >
                <FaTicketAlt />
                Apply Coupon Code
              </button>

              {/* SYSTEM FINAL CHECKOUT TRIGGER CTA */}
              <button
                onClick={() => {
                  if (!user) {
                    alert("Please log in to proceed to checkout.");
                    navigate("/login");
                    return;
                  }
                  navigate("/checkout");
                }}
                className="w-full mt-4 bg-[#0c831f] hover:bg-[#096b19] dark:bg-emerald-600 dark:hover:bg-emerald-500 text-white font-black py-3.5 rounded-xl shadow-md shadow-emerald-500/10 hover:shadow-emerald-500/20 transition-all text-sm tracking-wide flex items-center justify-center gap-2 group active:scale-[0.99]"
              >
                Proceed To Checkout
                <FaArrowRight className="text-xs transition-transform group-hover:translate-x-1" />
              </button>
            </div>

          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;