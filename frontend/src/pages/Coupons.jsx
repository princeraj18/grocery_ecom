import React, {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  useNavigate,
} from "react-router-dom";

import api from "../api/Axios";

const Coupons = () => {
  const navigate =
    useNavigate();

  const [coupons, setCoupons] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  useEffect(() => {
    const fetchCoupons =
      async () => {
        try {
          const { data } =
            await api.get(
              "/coupons/public"
            );

          setCoupons(
            data.coupons || []
          );
        } catch (err) {
          setError(
            err.response?.data
              ?.message ||
              "Failed to load coupons"
          );
        } finally {
          setLoading(false);
        }
      };

    fetchCoupons();
  }, []);

  const activeCoupons =
    useMemo(
      () =>
        coupons.filter(
          (coupon) =>
            coupon.isActive &&
            new Date(
              coupon.expiryDate
            ) >= new Date()
        ),
      [coupons]
    );

  const formatDiscount =
    (coupon) =>
      coupon.discountType ===
      "percentage"
        ? `${coupon.discountValue}% OFF`
        : `Rs. ${coupon.discountValue} OFF`;

  const handleApply =
    (coupon) => {
      sessionStorage.setItem(
        "selectedCouponCode",
        coupon.code
      );

      navigate("/checkout");
    };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-slate-900 p-10 text-2xl font-bold">
        Loading Coupons...
      </div>
    );
  }

  return (
    <div className="min-h-screen dark:bg-slate-950 px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-5 rounded-[8px] bg-[#172337] p-5 text-white">
          <p className="text-sm font-bold text-[#f7d851]">
            Grocify Deals
          </p>

          <div className="mt-2 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <div>
              <h1 className="text-3xl font-black sm:text-4xl">
                Coupons
              </h1>

              <p className="mt-2 text-sm text-white/75">
                Apply vendor coupons on eligible products in your cart.
              </p>
            </div>

            <button
              onClick={() =>
                navigate("/products")
              }
              className="w-fit rounded bg-white dark:bg-slate-900 px-4 py-3 text-sm font-black text-[#172337]"
            >
              Browse Products
            </button>
          </div>
        </div>

        {error && (
          <div className="mb-4 rounded border border-red-200 bg-red-50 p-4 text-red-700">
            {error}
          </div>
        )}

        {activeCoupons.length === 0 ? (
          <div className="rounded-[8px] bg-white dark:bg-slate-900 py-20 text-center shadow-sm">
            <h2 className="text-2xl font-black text-slate-700 dark:text-slate-300">
              No coupons available
            </h2>

            <p className="mt-2 text-slate-500 dark:text-slate-400">
              Check back later for new offers.
            </p>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {activeCoupons.map(
              (coupon) => {
                const products =
                  coupon.products || [];

                return (
                  <div
                    key={coupon._id}
                    className="rounded-[8px] border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 shadow-sm"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-xs font-black uppercase text-slate-500 dark:text-slate-400">
                          {coupon.vendor
                            ?.shopName ||
                            "Vendor"}
                        </p>

                        <h2 className="mt-1 text-2xl font-black text-slate-900 dark:text-white">
                          {formatDiscount(
                            coupon
                          )}
                        </h2>
                      </div>

                      <span className="rounded bg-[#e9f6eb] px-3 py-1 text-sm font-black text-[#0c831f]">
                        {coupon.code}
                      </span>
                    </div>

                    <div className="mt-4 grid grid-cols-2 gap-2 text-sm text-slate-600 dark:text-slate-400">
                      <p>
                        Min order:
                        <span className="ml-1 font-bold text-slate-900 dark:text-white">
                          Rs.{" "}
                          {
                            coupon.minOrderAmount ||
                            0
                          }
                        </span>
                      </p>

                      <p>
                        Max off:
                        <span className="ml-1 font-bold text-slate-900 dark:text-white">
                          Rs.{" "}
                          {
                            coupon.maxDiscount ||
                            coupon.discountValue
                          }
                        </span>
                      </p>
                    </div>

                    <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                      Valid till{" "}
                      {new Date(
                        coupon.expiryDate
                      ).toLocaleDateString()}
                    </p>

                    {products.length > 0 && (
                      <div className="mt-4">
                        <p className="mb-2 text-xs font-black uppercase text-slate-500 dark:text-slate-400">
                          Eligible products
                        </p>

                        <div className="grid grid-cols-3 gap-2">
                          {products
                            .slice(0, 3)
                            .map(
                              (product) => {
                                const image =
                                  Array.isArray(
                                    product.image
                                  )
                                    ? product
                                        .image[0]
                                    : product.image;

                                return (
                                  <button
                                    key={
                                      product._id
                                    }
                                    onClick={() =>
                                      navigate(
                                        `/products/${product._id}`
                                      )
                                    }
                                    className="rounded border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 p-2 text-left"
                                  >
                                    <img
                                      src={image}
                                      alt={
                                        product.name
                                      }
                                      className="h-16 w-full object-contain"
                                    />

                                    <p className="mt-1 truncate text-xs font-bold text-slate-700 dark:text-slate-300">
                                      {
                                        product.name
                                      }
                                    </p>
                                  </button>
                                );
                              }
                            )}
                        </div>
                      </div>
                    )}

                    <button
                      onClick={() =>
                        handleApply(coupon)
                      }
                      className="mt-5 w-full rounded bg-[#0c831f] py-3 text-sm font-black text-white hover:bg-[#096b19]"
                    >
                      Apply Coupon
                    </button>
                  </div>
                );
              }
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Coupons;
