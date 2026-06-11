import React from "react";
import { useContext } from "react";
import { ShopContext } from "../context/ShopContext";
import { Link, useNavigate } from "react-router-dom";
import { FaArrowRight, FaClock, FaPercent, FaShieldAlt } from "react-icons/fa";
import { assets, features } from "../assets/greencart_assets/assets";

const Home = () => {
  const navigate = useNavigate();
  const { categories, products, loadingProducts } = useContext(ShopContext);

  const heroProducts = products.slice(0, 5);
  const bestDeals = products.slice(0, 10);

  if (loadingProducts) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-[#f6f7f1] dark:bg-slate-950">
        <h2 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white animate-pulse">
          Loading Products...
        </h2>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f6f7f1] dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans transition-colors duration-200 overflow-x-hidden">
      
      {/* HERO HERO STRIP SECTION */}
      <section className="px-4 py-5 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        {/* Changed grid-cols-1 to switch dynamically to side-by-side layout on large viewports */}
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-[1.55fr_0.75fr]">
          
          {/* PRIMARY BANNER BLOCK */}
          <div className="relative overflow-hidden rounded-2xl bg-[#f7d851] dark:bg-amber-500/10 border border-transparent dark:border-amber-500/20 px-5 py-7 shadow-sm sm:px-8 lg:min-h-[430px] flex flex-col justify-between">
            <div className="relative z-10 max-w-2xl">
              <div className="inline-flex items-center gap-2 rounded-lg bg-white dark:bg-slate-900 px-3 py-1.5 text-xs font-bold text-[#0c831f] dark:text-emerald-400 shadow-sm">
                <FaClock className="text-xs" />
                Delivery in 10-30 minutes
              </div>

              <h1 className="mt-5 text-2xl font-black leading-tight text-slate-950 dark:text-white sm:text-4xl lg:text-5xl tracking-tight">
                Grocery, fresh food and pantry staples
              </h1>

              <p className="mt-4 max-w-lg text-sm font-semibold text-slate-800 dark:text-slate-300">
                Daily essentials, fruits, vegetables, dairy and snacks with quick delivery and clear prices.
              </p>

              <div className="mt-6 flex flex-wrap gap-3">
                <button
                  onClick={() => navigate("/products")}
                  className="inline-flex items-center gap-2 rounded-xl bg-[#0c831f] hover:bg-[#096818] dark:bg-emerald-600 dark:hover:bg-emerald-500 px-5 py-3 text-xs font-bold text-white shadow-md shadow-emerald-900/10 transition-all active:scale-[0.98]"
                >
                  Shop groceries
                  <FaArrowRight className="text-[10px]" />
                </button>
                <button
                  onClick={() => navigate("/products")}
                  className="rounded-xl border border-slate-900/10 dark:border-slate-800 bg-white dark:bg-slate-900 px-5 py-3 text-xs font-bold text-slate-900 dark:text-white shadow-sm transition-colors hover:bg-slate-50 dark:hover:bg-slate-800"
                >
                  Today's deals
                </button>
              </div>
            </div>

            {/* Banner Image is now responsive across screen widths layout */}
            <img
              src={assets.main_banner_bg}
              alt="Fresh grocery assortment"
              className="mt-6 w-full max-w-md mx-auto object-contain dark:mix-blend-lighten dark:opacity-80 lg:absolute lg:bottom-0 lg:right-2 lg:mt-0 lg:max-w-none lg:w-[48%]"
            />
          </div>

          {/* SIDE ACCENT PROMO STACK */}
          {/* Changed grid layouts layout from hard static row height styles to responsive columns */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-5">
            {/* PANTRY SAVER PANEL */}
            <div className="rounded-2xl bg-white dark:bg-slate-900 p-5 shadow-sm border border-slate-100 dark:border-slate-800/60 flex flex-col justify-between">
              <div>
                <p className="text-[10px] font-black uppercase tracking-wider text-[#2874f0] dark:text-blue-400">
                  Pantry saver
                </p>
                <h2 className="mt-1.5 text-xl sm:text-2xl font-black tracking-tight text-slate-900 dark:text-white">
                  Monthly stock-up deals
                </h2>
                <p className="mt-2 text-xs text-slate-600 dark:text-slate-400 font-medium">
                  Rice, flour, instant food and beverages at everyday value.
                </p>
              </div>
              <button
                onClick={() => navigate("/products")}
                className="mt-5 w-fit rounded-xl bg-[#2874f0] hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-500 px-4 py-2.5 text-xs font-bold text-white shadow-sm transition-colors"
              >
                Explore pantry
              </button>
            </div>

            {/* FRESH PROMISE PREVIEW MARQUEE */}
            <div className="rounded-2xl bg-[#172337] dark:bg-slate-900/40 p-5 text-white shadow-sm border border-transparent dark:border-slate-800/60 flex flex-col justify-between">
              <div>
                <p className="text-[10px] font-black uppercase tracking-wider text-[#f7d851] dark:text-amber-400">
                  Fresh promise
                </p>
                <h2 className="mt-1.5 text-xl sm:text-2xl font-black tracking-tight text-white">
                  Handpicked daily
                </h2>
              </div>
              <div className="mt-4 grid grid-cols-3 gap-3">
                {heroProducts.slice(0, 3).map((product) => (
                  <img
                    key={product._id}
                    src={Array.isArray(product.image) ? product.image[0] : product.image}
                    alt={product.name}
                    className="h-16 sm:h-20 w-full rounded-xl bg-white dark:bg-slate-950 object-contain p-2 border border-slate-100/10"
                  />
                ))}
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* CATEGORIES INDEX GRID SECTION */}
      <section className="px-4 py-5 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="mb-4 flex items-end justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-[#0c831f] dark:text-emerald-400">
              Shop by category
            </p>
            <h2 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 dark:text-white">
              Everything for your kitchen
            </h2>
          </div>
          <button
            onClick={() => navigate("/products")}
            className="hidden text-xs font-bold text-[#0c831f] dark:text-emerald-400 hover:underline sm:block"
          >
            View all
          </button>
        </div>

        {/* Made Grid items auto-adjust for smaller screen limits */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-7 gap-3">
          {categories.length > 0 ? (
            categories.map((category) => (
              <Link
                key={category._id}
                to={`/category/${category.path}`}
                className="group rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-3 shadow-sm transition-all hover:-translate-y-0.5 hover:border-[#0c831f] dark:hover:border-emerald-500"
              >
                <div
                  className="flex aspect-square items-center justify-center rounded-xl transition-opacity dark:opacity-90"
                  style={{ backgroundColor: category.bgColor }}
                >
                  <img
                    src={category.image}
                    alt={category.text}
                    className="h-20 w-20 sm:h-24 sm:w-24 object-contain transition duration-300 group-hover:scale-105"
                  />
                </div>
                <h3 className="mt-3 text-xs sm:text-sm font-black leading-tight text-slate-900 dark:text-slate-100 line-clamp-1">
                  {category.text}
                </h3>
                <p className="mt-1 text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wide">
                  Fresh Picks
                </p>
              </Link>
            ))
          ) : (
            <div className="col-span-full text-center py-10">
              <p className="text-xs font-semibold text-slate-400">
                Loading Categories...
              </p>
            </div>
          )}
        </div>
      </section>

      {/* CORE FINANCIAL VALUE SUPER SAVER GRID */}
      <section className="px-4 py-5 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="rounded-2xl bg-white dark:bg-slate-900 p-4 shadow-sm sm:p-5 border border-slate-100 dark:border-slate-800/40">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-[#2874f0] dark:text-blue-400">
                Super saver store
              </p>
              <h2 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 dark:text-white">
                Best deals on daily essentials
              </h2>
            </div>
            <div className="inline-flex items-center gap-1.5 rounded-lg bg-[#fff3cd] dark:bg-amber-950/40 border border-amber-200/20 px-3 py-1.5 text-xs font-black text-[#9a5a00] dark:text-amber-400">
              <FaPercent className="text-[10px]" />
              Up to 50% off
            </div>
          </div>

          {/* Fixed product display layout framework here: columns switch cleanly to prevent stretching */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
            {bestDeals.map((product) => {
              const actualPrice = product.variants?.[0]?.price || 0;
              const offerPrice = product.variants?.[0]?.offerPrice || 0;
              const discount = actualPrice > 0 ? Math.round(((actualPrice - offerPrice) / actualPrice) * 100) : 0;

              return (
                <Link
                  key={product._id}
                  to={`/products/${product._id}`}
                  className="group rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-3 shadow-sm transition-all hover:shadow-md flex flex-col justify-between"
                >
                  <div>
                    <div className="relative flex aspect-square items-center justify-center rounded-xl bg-[#f7f8f3] dark:bg-slate-950/60 p-2">
                      <span className="absolute left-2 top-2 rounded-md bg-[#0c831f] dark:bg-emerald-600 px-2 py-0.5 text-[10px] font-black text-white tracking-wide">
                        {discount}% OFF
                      </span>
                      <img
                        src={Array.isArray(product.image) ? product.image[0] : product.image}
                        alt={product.name}
                        className="h-24 w-24 sm:h-32 sm:w-32 object-contain transition duration-300 group-hover:scale-105"
                      />
                    </div>

                    <p className="mt-2 text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wide">
                      {product.category?.text}
                    </p>
                    <h3 className="mt-0.5 min-h-[40px] text-xs sm:text-sm font-black leading-snug line-clamp-2 text-slate-800 dark:text-slate-200">
                      {product.name}
                    </h3>
                  </div>

                  <div className="mt-3 flex flex-wrap items-end justify-between gap-2 pt-2 border-t border-slate-50 dark:border-slate-800/40">
                    <div>
                      <p className="text-sm sm:text-base font-black text-slate-900 dark:text-white">
                        Rs. {offerPrice}
                      </p>
                      <p className="text-[10px] sm:text-xs text-slate-400 line-through">
                        Rs. {actualPrice}
                      </p>
                    </div>
                    <span className="rounded-lg border border-[#0c831f] dark:border-emerald-500 px-2.5 py-1.5 text-[10px] sm:text-xs font-black text-[#0c831f] dark:text-emerald-400 bg-emerald-50/20 dark:bg-emerald-950/10 group-hover:bg-[#0c831f] dark:group-hover:bg-emerald-600 group-hover:text-white dark:group-hover:text-white transition-colors">
                      ADD
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* CORE OPERATIONAL TRUST SIGNALS */}
      <section className="px-4 py-5 sm:px-6 lg:px-8 max-w-7xl mx-auto pb-12">
        {/* Changed layout wrapper from hard md:grid-cols-3 directly into a responsive grid system */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          <div className="rounded-2xl bg-[#0c831f] dark:bg-emerald-900/20 border border-transparent dark:border-emerald-800/30 p-5 text-white dark:text-emerald-300 shadow-sm">
            <FaClock className="text-xl" />
            <h3 className="mt-3 text-lg font-black tracking-tight text-white">Quick delivery</h3>
            <p className="mt-1.5 text-xs sm:text-sm text-white/80 dark:text-slate-400 font-medium">
              Fast fulfilment for urgent daily needs.
            </p>
          </div>
          <div className="rounded-2xl bg-[#2874f0] dark:bg-blue-900/20 border border-transparent dark:border-blue-800/30 p-5 text-white dark:text-blue-300 shadow-sm">
            <FaShieldAlt className="text-xl" />
            <h3 className="mt-3 text-lg font-black tracking-tight text-white">Trusted checkout</h3>
            <p className="mt-1.5 text-xs sm:text-sm text-white/80 dark:text-slate-400 font-medium">
              Secure payments, COD and clear order tracking.
            </p>
          </div>
          <div className="rounded-2xl bg-[#172337] dark:bg-slate-900 border border-transparent dark:border-slate-800 p-5 text-white dark:text-slate-300 shadow-sm sm:col-span-2 md:col-span-1">
            <img src={features[1].icon} alt="" className="h-5 w-5 invert dark:opacity-80" />
            <h3 className="mt-3 text-lg font-black tracking-tight text-white">Fresh quality</h3>
            <p className="mt-1.5 text-xs sm:text-sm text-white/80 dark:text-slate-400 font-medium">
              Produce, dairy and bakery items selected for freshness.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;