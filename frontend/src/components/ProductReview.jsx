import React, {
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

  return (

    <div className="bg-white rounded-2xl shadow-lg p-6 mt-10">

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