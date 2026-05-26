import React, {
  useEffect,
  useState,
} from "react";

import axios from "axios";

import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

export default function Reviews() {

  const [reviews, setReviews] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

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
          data.reviews
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

    <div className="flex">

      {/* SIDEBAR */}
      <Sidebar />

      {/* MAIN */}
      <div className="flex-1 bg-gray-100 min-h-screen">

        <Navbar />

        <div className="p-6">

          {/* HEADER */}
          <div className="mb-8">

            <h1 className="text-3xl font-bold">
              Product Reviews
            </h1>

            <p className="text-gray-500 mt-2">
              Reviews related to your
              products
            </p>

          </div>

          {/* LOADING */}
          {loading ? (

            <div className="text-xl font-semibold">
              Loading Reviews...
            </div>

          ) : reviews.length === 0 ? (

            <div className="bg-white p-10 rounded-2xl shadow">
              No Reviews Found
            </div>

          ) : (

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

              {reviews.map(
                (review) => (

                  <div
                    key={review._id}
                    className="bg-white rounded-2xl shadow p-6"
                  >

                    {/* PRODUCT */}
                    <div className="flex items-center gap-4 mb-4">

                      <img
                        src={
                          Array.isArray(
                            review.product
                              ?.image
                          )
                            ? review
                                .product
                                ?.image[0]
                            : review
                                .product
                                ?.image
                        }
                        alt=""
                        className="w-20 h-20 object-cover rounded-xl border"
                      />

                      <div>

                        <h2 className="text-lg font-bold">
                          {
                            review
                              .product
                              ?.name
                          }
                        </h2>

                        <p className="text-gray-500 text-sm">
                          {
                            review
                              .product
                              ?.category
                          }
                        </p>

                      </div>

                    </div>

                    {/* USER */}
                    <div className="mb-4">

                      <h3 className="font-semibold">
                        Customer
                      </h3>

                      <p>
                        {
                          review.user
                            ?.name
                        }
                      </p>

                      <p className="text-gray-500 text-sm">
                        {
                          review.user
                            ?.email
                        }
                      </p>

                    </div>

                    {/* RATING */}
                    <div className="mb-4">

                      <h3 className="font-semibold mb-2">
                        Rating
                      </h3>

                      <div className="flex items-center gap-1">

                        {[
                          1, 2, 3, 4, 5,
                        ].map((star) => (

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
                        ))}

                      </div>

                    </div>

                    {/* COMMENT */}
                    <div className="mb-6">

                      <h3 className="font-semibold mb-2">
                        Comment
                      </h3>

                      <p className="text-gray-700 leading-relaxed">
                        {
                          review.comment
                        }
                      </p>

                    </div>

                    {/* DATE */}
                    <div className="text-sm text-gray-400 mb-6">

                      {
                        new Date(
                          review.createdAt
                        ).toLocaleDateString()
                      }

                    </div>

                    {/* ACTION */}
                    <button
                      onClick={() =>
                        deleteReview(
                          review._id
                        )
                      }
                      className="bg-red-500 hover:bg-red-600 text-white px-5 py-2 rounded-xl transition"
                    >
                      Delete Review
                    </button>

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