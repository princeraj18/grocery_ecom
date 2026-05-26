import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaArrowRight, FaClock, FaPercent, FaShieldAlt } from "react-icons/fa";

import {
  dummyProducts,
  categories,
  assets,
  features,
} from "../assets/greencart_assets/assets";

const Home = () => {
  const navigate = useNavigate();
  const heroProducts = dummyProducts.slice(0, 5);
  const bestDeals = dummyProducts.slice(0, 10);

  return (
    <div className="min-h-screen bg-[#f6f7f1] text-slate-900">
      <section className="px-4 py-5 sm:px-6 lg:px-10">
        <div className="mx-auto grid max-w-7xl gap-5 lg:grid-cols-[1.55fr_0.75fr]">
          <div className="relative overflow-hidden rounded-[8px] bg-[#f7d851] px-5 py-7 shadow-sm sm:px-8 lg:min-h-[430px]">
            <div className="relative z-10 max-w-2xl">
              <div className="inline-flex items-center gap-2 rounded bg-white/80 px-3 py-1 text-sm font-bold text-[#0c831f]">
                <FaClock className="text-xs" />
                Delivery in 10-30 minutes
              </div>

              <h1 className="mt-5 max-w-xl text-4xl font-black leading-tight text-slate-950 sm:text-5xl lg:text-6xl">
                Grocery, fresh food and pantry staples
              </h1>

              <p className="mt-4 max-w-lg text-base font-medium text-slate-700 sm:text-lg">
                Daily essentials, fruits, vegetables, dairy and snacks with
                quick delivery and clear prices.
              </p>

              <div className="mt-6 flex flex-wrap gap-3">
                <button
                  onClick={() => navigate("/products")}
                  className="inline-flex items-center gap-2 rounded bg-[#0c831f] px-5 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-[#096818]"
                >
                  Shop groceries
                  <FaArrowRight className="text-xs" />
                </button>
                <button
                  onClick={() => navigate("/products")}
                  className="rounded border border-slate-900/15 bg-white px-5 py-3 text-sm font-bold text-slate-900 transition hover:bg-slate-50"
                >
                  Today's deals
                </button>
              </div>
            </div>

            <img
              src={assets.main_banner_bg}
              alt="Fresh grocery assortment"
              className="mt-8 w-full max-w-xl object-contain lg:absolute lg:bottom-0 lg:right-2 lg:mt-0 lg:w-[52%]"
            />
          </div>

          <div className="grid gap-5">
            <div className="rounded-[8px] bg-white p-5 shadow-sm">
              <p className="text-xs font-black uppercase tracking-wide text-[#2874f0]">
                Pantry saver
              </p>
              <h2 className="mt-2 text-2xl font-black">Monthly stock-up deals</h2>
              <p className="mt-2 text-sm text-slate-600">
                Rice, flour, instant food and beverages at everyday value.
              </p>
              <button
                onClick={() => navigate("/products")}
                className="mt-5 rounded bg-[#2874f0] px-4 py-2 text-sm font-bold text-white"
              >
                Explore pantry
              </button>
            </div>

            <div className="rounded-[8px] bg-[#172337] p-5 text-white shadow-sm">
              <p className="text-xs font-black uppercase tracking-wide text-[#f7d851]">
                Fresh promise
              </p>
              <h2 className="mt-2 text-2xl font-black">Handpicked daily</h2>
              <div className="mt-4 grid grid-cols-3 gap-3">
                {heroProducts.slice(0, 3).map((product) => (
                  <img
                    key={product._id}
                    src={product.image[0]}
                    alt={product.name}
                    className="h-20 w-full rounded bg-white object-contain p-2"
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="px-4 py-5 sm:px-6 lg:px-10">
        <div className="mx-auto max-w-7xl">
          <div className="mb-4 flex items-end justify-between gap-4">
            <div>
              <p className="text-sm font-bold text-[#0c831f]">Shop by category</p>
              <h2 className="text-2xl font-black">Everything for your kitchen</h2>
            </div>
            <button
              onClick={() => navigate("/products")}
              className="hidden text-sm font-bold text-[#0c831f] sm:block"
            >
              View all
            </button>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-7">
            {categories.map((category) => (
              <Link
                key={category.path}
                to={`/category/${category.path}`}
                className="group rounded-[8px] border border-slate-200 bg-white p-3 shadow-sm transition hover:-translate-y-0.5 hover:border-[#0c831f]"
              >
                <div
                  className="flex aspect-square items-center justify-center rounded-[8px]"
                  style={{ backgroundColor: category.bgColor }}
                >
                  <img
                    src={category.image}
                    alt={category.text}
                    className="h-24 w-24 object-contain transition group-hover:scale-105"
                  />
                </div>
                <h3 className="mt-3 text-sm font-black leading-tight">
                  {category.text}
                </h3>
                <p className="mt-1 text-xs font-semibold text-slate-500">
                  Fresh picks
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 py-5 sm:px-6 lg:px-10">
        <div className="mx-auto max-w-7xl rounded-[8px] bg-white p-4 shadow-sm sm:p-5">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-sm font-bold text-[#2874f0]">Super saver store</p>
              <h2 className="text-2xl font-black">Best deals on daily essentials</h2>
            </div>
            <div className="inline-flex items-center gap-2 rounded bg-[#fff3cd] px-3 py-2 text-sm font-black text-[#9a5a00]">
              <FaPercent className="text-xs" />
              Up to 50% off
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-5">
            {bestDeals.map((product) => (
              <Link
                key={product._id}
                to={`/products/${product._id}`}
                className="group rounded-[8px] border border-slate-200 bg-white p-3 transition hover:shadow-md"
              >
                <div className="relative flex aspect-square items-center justify-center rounded-[8px] bg-[#f7f8f3]">
                  <span className="absolute left-2 top-2 rounded bg-[#0c831f] px-2 py-1 text-[11px] font-black text-white">
                    {Math.max(
                      1,
                      Math.round(
                        ((product.price - product.offerPrice) / product.price) *
                          100
                      )
                    )}
                    % OFF
                  </span>
                  <img
                    src={product.image[0]}
                    alt={product.name}
                    className="h-32 w-32 object-contain transition group-hover:scale-105"
                  />
                </div>
                <p className="mt-3 text-xs font-semibold text-slate-500">
                  {product.category}
                </p>
                <h3 className="mt-1 min-h-[40px] text-sm font-black leading-snug line-clamp-2">
                  {product.name}
                </h3>
                <div className="mt-2 flex items-end justify-between gap-2">
                  <div>
                    <p className="text-base font-black">Rs. {product.offerPrice}</p>
                    <p className="text-xs text-slate-400 line-through">
                      Rs. {product.price}
                    </p>
                  </div>
                  <span className="rounded border border-[#0c831f] px-3 py-1 text-xs font-black text-[#0c831f]">
                    ADD
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 py-5 sm:px-6 lg:px-10">
        <div className="mx-auto grid max-w-7xl gap-4 md:grid-cols-3">
          <div className="rounded-[8px] bg-[#0c831f] p-5 text-white">
            <FaClock />
            <h3 className="mt-3 text-xl font-black">Quick delivery</h3>
            <p className="mt-2 text-sm text-white/80">
              Fast fulfilment for urgent daily needs.
            </p>
          </div>
          <div className="rounded-[8px] bg-[#2874f0] p-5 text-white">
            <FaShieldAlt />
            <h3 className="mt-3 text-xl font-black">Trusted checkout</h3>
            <p className="mt-2 text-sm text-white/80">
              Secure payments, COD and clear order tracking.
            </p>
          </div>
          <div className="rounded-[8px] bg-[#172337] p-5 text-white">
            <img src={features[1].icon} alt="" className="h-5 w-5 invert" />
            <h3 className="mt-3 text-xl font-black">Fresh quality</h3>
            <p className="mt-2 text-sm text-white/80">
              Produce, dairy and bakery items selected for freshness.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
