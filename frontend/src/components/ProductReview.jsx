import React, {
  useEffect,
  useState,
} from "react";


import axios from "axios";

export default function ProductReview({
  productId,
  userId,
}) {

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
  const averageRating =
  reviews.length
    ? (
        reviews.reduce(
          (sum, review) =>
            sum + review.rating,
          0
        ) / reviews.length
      ).toFixed(1)
    : 0;
  // ====================================
  // SUBMIT REVIEW
  // ====================================
  const submitReview =
    async (e) => {

      e.preventDefault();

      try {

        setLoading(true);

        const token =
          localStorage.getItem(
            "token"
          );

        const { data } =
          await axios.post(
            "http://localhost:5000/api/reviews",
            {
              user: userId,

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
          data.message
        );

        setRating(0);

        setComment("");
        fetchReviews();

      } catch (error) {

        console.log(error);

        alert(
          error.response?.data
            ?.message ||
            "Failed to submit review"
        );

      } finally {

        setLoading(false);
      }
    };
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


  useEffect(() => {
  fetchReviews();
}, [productId]);


  return (

    <div className="bg-white rounded-2xl shadow-lg p-6 mt-10">
      <div className="flex items-center gap-3 mb-5">
  <span className="text-3xl font-bold">
    {averageRating}
  </span>

  <span className="text-yellow-500 text-xl">
    ★★★★★
  </span>

  <span className="text-gray-500">
    ({reviews.length} reviews)
  </span>
</div>
{/* PRODUCT REVIEWS */}
<div className="mb-10">

  <h2 className="text-2xl font-bold mb-5">
    Customer Reviews
  </h2>

  {reviewsLoading ? (

    <p>Loading reviews...</p>

  ) : reviews.length === 0 ? (

    <div className="bg-gray-50 rounded-xl p-6 text-center">

      <p className="text-gray-500">
        No reviews yet.
      </p>

      <p className="text-sm text-gray-400 mt-1">
        Be the first to review this product.
      </p>

    </div>

  ) : (

    <div className="space-y-4">

      {reviews.map((review) => (

        <div
          key={review._id}
          className="border rounded-xl p-4"
        >

          {/* USER + RATING */}
          <div className="flex justify-between items-center">

            <h3 className="font-semibold">
              {review.user?.name}
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
            {review.comment}
          </p>

        </div>
      ))}

    </div>
  )}

</div>
      {/* TITLE */}
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

            {[
              1, 2, 3, 4, 5,
            ].map((star) => (

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
                className={`text-4xl transition
                  ${
                    star <=
                    (hover ||
                      rating)
                      ? "text-yellow-500"
                      : "text-gray-300"
                  }`}
              >
                ★
              </button>
            ))}

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

    </div>
  );
}