import React, {
  useEffect,
  useState,
} from "react";

import axios from "axios";

import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

import {
  Menu,
  X,
} from "lucide-react";

export default function Reviews() {

  const [reviews, setReviews] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  // MOBILE SIDEBAR
  const [sidebarOpen, setSidebarOpen] =
    useState(false);

  // ====================================
  // FETCH VENDOR REVIEWS
  // ====================================
  const fetchReviews =
    async () => {

      try {

        const token =
          localStorage.getItem(
            "vendorToken"
          );

        const { data } =
          await axios.get(
            "http://localhost:5000/api/reviews/vendor",
            {
              headers: {
                Authorization:
                  `Bearer ${token}`,
              },
            }
          );

        setReviews(
          data.reviews || []
        );

      } catch (error) {

        console.log(error);

      } finally {

        setLoading(false);
      }
    };

  // ====================================
  // DELETE REVIEW
  // ====================================
  const deleteReview =
    async (id) => {

      try {

        const token =
          localStorage.getItem(
            "vendorToken"
          );

        const confirmDelete =
          window.confirm(
            "Delete this review?"
          );

        if (!confirmDelete)
          return;

        await axios.delete(
          `http://localhost:5000/api/reviews/${id}`,
          {
            headers: {
              Authorization:
                `Bearer ${token}`,
            },
          }
        );

        setReviews(
          reviews.filter(
            (review) =>
              review._id !== id
          )
        );

      } catch (error) {

        console.log(error);

        alert(
          "Failed to delete review"
        );
      }
    };

  useEffect(() => {

    fetchReviews();

  }, []);

  return (

    <div className="flex bg-gray-100 min-h-screen overflow-hidden">

      {/* ========================================= */}
      {/* DESKTOP SIDEBAR */}
      {/* ========================================= */}
      <div className="hidden lg:block">

        <Sidebar />

      </div>

      {/* ========================================= */}
      {/* MOBILE SIDEBAR */}
      {/* ========================================= */}
      {sidebarOpen && (

        <>

          {/* OVERLAY */}
          <div
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            onClick={() =>
              setSidebarOpen(false)
            }
          />

          {/* SIDEBAR */}
          <div className="fixed top-0 left-0 h-full z-50 lg:hidden">

            <Sidebar />

          </div>

        </>
      )}

      {/* ========================================= */}
      {/* MAIN */}
      {/* ========================================= */}
      <div className="flex-1 flex flex-col overflow-hidden">

        {/* ========================================= */}
        {/* TOP NAVBAR */}
        {/* ========================================= */}
        <div className="sticky top-0 z-30 bg-white shadow-sm">
        
                  <div className="flex items-center">
        
                    {/* MOBILE MENU */}
                    <button
                      onClick={() =>
                        setSidebarOpen(
                          !sidebarOpen
                        )
                      }
                      className="lg:hidden p-4"
                    >
                      {sidebarOpen ? (
                        <X size={28} />
                      ) : (
                        <Menu size={28} />
                      )}
                    </button>
        
                    <div className="flex-1">
                      <Navbar />
                    </div>
        
                  </div>
        
                </div>

        {/* ========================================= */}
        {/* PAGE CONTENT */}
        {/* ========================================= */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6">

          {/* HEADER */}
          <div className="mb-8">

            <h1 className="hidden lg:block text-3xl font-bold">
              Product Reviews
            </h1>

            <p className="text-gray-500 mt-2">
              Reviews related to your
              products
            </p>

          </div>

          {/* LOADING */}
          {loading ? (

            <div className="flex justify-center items-center h-[50vh]">

              <div className="text-xl font-semibold animate-pulse">
                Loading Reviews...
              </div>

            </div>

          ) : reviews.length === 0 ? (

            <div className="bg-white p-10 rounded-2xl shadow text-center">

              <h2 className="text-2xl font-bold mb-2">
                No Reviews Found
              </h2>

              <p className="text-gray-500">
                No customer reviews yet
              </p>

            </div>

          ) : (

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">

              {reviews.map(
                (review) => (

                  <div
                    key={review._id}
                    className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border"
                  >

                    {/* PRODUCT IMAGE */}
                    <div className="relative">

                      <img
                        src={
                          Array.isArray(
                            review.product?.image
                          )
                            ? review.product
                                ?.image[0]
                            : review.product
                                ?.image
                        }
                        alt=""
                        className="w-full h-52 object-cover"
                      />

                      <div className="absolute bottom-3 left-3 bg-black/70 text-white px-3 py-1 rounded-full text-sm">
                        {
                          review.product
                            ?.category
                        }
                      </div>

                    </div>

                    {/* CONTENT */}
                    <div className="p-5">

                      {/* PRODUCT */}
                      <div className="mb-5">

                        <h2 className="text-xl font-bold text-gray-800 line-clamp-2">
                          {
                            review.product
                              ?.name
                          }
                        </h2>

                      </div>

                      {/* CUSTOMER */}
                      <div className="mb-5">

                        <p className="text-sm text-gray-500 mb-1">
                          Customer
                        </p>

                        <h3 className="font-semibold text-gray-800">
                          {
                            review.user
                              ?.name
                          }
                        </h3>

                        <p className="text-sm text-gray-500 break-all">
                          {
                            review.user
                              ?.email
                          }
                        </p>

                      </div>

                      {/* RATING */}
                      <div className="mb-5">

                        <p className="text-sm text-gray-500 mb-2">
                          Rating
                        </p>

                        <div className="flex items-center gap-1">

                          {[1, 2, 3, 4, 5].map(
                            (star) => (

                              <span
                                key={star}
                                className={`text-2xl ${
                                  star <=
                                  review.rating
                                    ? "text-yellow-500"
                                    : "text-gray-300"
                                }`}
                              >
                                ★
                              </span>
                            )
                          )}

                        </div>

                      </div>

                      {/* COMMENT */}
                      <div className="mb-5">

                        <p className="text-sm text-gray-500 mb-2">
                          Comment
                        </p>

                        <p className="text-gray-700 leading-relaxed text-sm">
                          {
                            review.comment
                          }
                        </p>

                      </div>

                      {/* DATE */}
                      <div className="mb-5 text-sm text-gray-400">

                        {new Date(
                          review.createdAt
                        ).toLocaleDateString()}

                      </div>

                      {/* DELETE */}
                      <button
                        onClick={() =>
                          deleteReview(
                            review._id
                          )
                        }
                        className="w-full bg-red-500 hover:bg-red-600 text-white py-3 rounded-xl transition font-semibold"
                      >
                        Delete Review
                      </button>

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