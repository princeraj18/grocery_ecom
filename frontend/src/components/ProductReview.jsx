import React, {
  useEffect,
  useState,
} from "react";

import axios from "axios";

export default function ProductReview({
  productId,
}) {

  // =========================
  // USER + TOKEN
  // =========================
  const token =
    localStorage.getItem("token");

  const user =
    JSON.parse(
      localStorage.getItem("user")
    ) || null;

  // =========================
  // STATES
  // =========================
  const [rating, setRating] =
    useState(0);

  const [hover, setHover] =
    useState(0);

  const [comment, setComment] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const [reviews, setReviews] =
    useState([]);

  const [reviewsLoading, setReviewsLoading] =
    useState(true);

  // =========================
  // AVERAGE RATING
  // =========================
  const averageRating =
    reviews.length > 0
      ? (
          reviews.reduce(
            (sum, review) =>
              sum + review.rating,
            0
          ) / reviews.length
        ).toFixed(1)
      : 0;

  // =========================
  // FETCH REVIEWS
  // =========================
  const fetchReviews =
    async () => {

      try {

        const { data } =
          await axios.get(
            `http://localhost:5000/api/reviews/product/${productId}`
          );

        setReviews(
          data.reviews || []
        );

      } catch (error) {

        console.log(
          "FETCH REVIEWS ERROR:",
          error
        );

      } finally {

        setReviewsLoading(false);
      }
    };

  // =========================
  // LOAD REVIEWS
  // =========================
  useEffect(() => {

    fetchReviews();

  }, [productId]);

  // =========================
  // SUBMIT REVIEW
  // =========================
  const submitReview =
    async (e) => {

      e.preventDefault();

      // CHECK LOGIN
      if (!token || !user) {

        alert(
          "Please login first"
        );

        return;
      }

      // CHECK RATING
      if (rating === 0) {

        alert(
          "Please select a rating"
        );

        return;
      }

      try {

        setLoading(true);

        const response =
          await axios.post(
            "http://localhost:5000/api/reviews",
            {
              product: productId,
              rating,
              comment,
            },
            {
              headers: {
                Authorization:
                  `Bearer ${token}`,
              },
            }
          );

        alert(
          response.data.message ||
          "Review submitted successfully"
        );

        // RESET FORM
        setRating(0);

        setHover(0);

        setComment("");

        fetchReviews();

      } catch (error) {

        console.log(
          "REVIEW ERROR:",
          error
        );

        alert(
          error.response?.data?.message ||
          "Failed to submit review"
        );

      } finally {

        setLoading(false);
      }
    };

  return (

    <div className="bg-white rounded-2xl shadow-lg p-6 mt-10">

      {/* ========================= */}
      {/* AVERAGE RATING */}
      {/* ========================= */}
      <div className="flex items-center gap-3 mb-8">

        <span className="text-3xl font-bold">
          {averageRating}
        </span>

        <div className="flex text-yellow-500 text-xl">

          {[1, 2, 3, 4, 5].map(
            (star) => (

              <span key={star}>
                {star <=
                Math.round(
                  averageRating
                )
                  ? "★"
                  : "☆"}
              </span>
            )
          )}

        </div>

        <span className="text-gray-500">
          ({reviews.length} reviews)
        </span>

      </div>

      {/* ========================= */}
      {/* REVIEWS */}
      {/* ========================= */}
      <div className="mb-10">

        <h2 className="text-2xl font-bold mb-5">
          Customer Reviews
        </h2>

        {reviewsLoading ? (

          <p>
            Loading reviews...
          </p>

        ) : reviews.length === 0 ? (

          <div className="bg-gray-50 rounded-xl p-6 text-center">

            <p className="text-gray-500">
              No reviews yet.
            </p>

            <p className="text-sm text-gray-400 mt-1">
              Be the first to
              review this product.
            </p>

          </div>

        ) : (

          <div className="space-y-4">

            {reviews.map(
              (review) => (

                <div
                  key={review._id}
                  className="border rounded-xl p-4"
                >

                  {/* USER + RATING */}
                  <div className="flex justify-between items-center">

                    <h3 className="font-semibold">
                      {
                        review.user
                          ?.name || "User"
                      }
                    </h3>

                    <div className="text-yellow-500">

                      {"★".repeat(
                        review.rating
                      )}

                      {"☆".repeat(
                        5 -
                          review.rating
                      )}

                    </div>

                  </div>

                  {/* DATE */}
                  <p className="text-xs text-gray-400 mt-1">

                    {new Date(
                      review.createdAt
                    ).toLocaleDateString()}

                  </p>

                  {/* COMMENT */}
                  <p className="mt-3 text-gray-700">

                    {
                      review.comment
                    }

                  </p>

                </div>
              )
            )}

          </div>
        )}

      </div>

      {/* ========================= */}
      {/* REVIEW FORM */}
      {/* ========================= */}

      {!user ? (

        <div className="bg-red-50 border border-red-200 text-red-600 rounded-xl p-5 text-center">

          <p className="font-semibold">
            Please login first to submit a review.
          </p>

        </div>

      ) : (

        <>
          <h2 className="text-2xl font-bold mb-6">
            Write a Review
          </h2>

          <form
            onSubmit={submitReview}
            className="space-y-6"
          >

            {/* STAR RATING */}
            <div>

              <label className="block font-semibold mb-3">
                Rating
              </label>

              <div className="flex gap-2">

                {[1, 2, 3, 4, 5].map(
                  (star) => (

                    <button
                      type="button"
                      key={star}
                      onClick={() =>
                        setRating(star)
                      }
                      onMouseEnter={() =>
                        setHover(star)
                      }
                      onMouseLeave={() =>
                        setHover(0)
                      }
                      className={`text-4xl transition ${
                        star <=
                        (hover ||
                          rating)
                          ? "text-yellow-500"
                          : "text-gray-300"
                      }`}
                    >
                      ★
                    </button>
                  )
                )}

              </div>

            </div>

            {/* COMMENT */}
            <div>

              <label className="block font-semibold mb-3">
                Comment
              </label>

              <textarea
                value={comment}
                onChange={(e) =>
                  setComment(
                    e.target.value
                  )
                }
                rows="5"
                placeholder="Write your review here..."
                className="w-full border rounded-xl p-4 outline-none focus:border-black resize-none"
                required
              />

            </div>

            {/* BUTTON */}
            <button
              type="submit"
              disabled={loading}
              className="bg-black hover:bg-gray-800 text-white px-8 py-3 rounded-xl transition disabled:opacity-50"
            >

              {loading
                ? "Submitting..."
                : "Submit Review"}

            </button>

          </form>
        </>
      )}

    </div>
  );
}