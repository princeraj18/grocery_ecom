import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaStar, FaRegStar, FaCircleNotch, FaLock } from "react-icons/fa";
import api from "../api/Axios";

export default function ProductReview({ productId }) {
  // =========================
  // USER + TOKEN
  // =========================
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user")) || null;

  // =========================
  // STATES
  // =========================
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [reviewsLoading, setReviewsLoading] = useState(true);

  // =========================
  // AVERAGE RATING
  // =========================
  const averageRating =
    reviews.length > 0
      ? (
          reviews.reduce((sum, review) => sum + review.rating, 0) /
          reviews.length
        ).toFixed(1)
      : "0.0";

  // =========================
  // FETCH REVIEWS
  // =========================
  const fetchReviews = async () => {
    try {
      setReviewsLoading(true);
      const { data } = await api.get(
        `http://localhost:5000/api/reviews/product/${productId}`
      );
      setReviews(data.reviews || []);
    } catch (error) {
      console.error("FETCH REVIEWS ERROR:", error);
    } finally {
      setReviewsLoading(false);
    }
  };

  useEffect(() => {
    if (productId) fetchReviews();
  }, [productId]);

  // =========================
  // SUBMIT REVIEW
  // =========================
  const submitReview = async (e) => {
    e.preventDefault();

    if (!token || !user) {
      alert("Please login first");
      return;
    }

    if (rating === 0) {
      alert("Please select a rating metric");
      return;
    }

    try {
      setLoading(true);
      const response = await axios.post(
        "http://localhost:5000/api/reviews",
        { product: productId, rating, comment },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert(response.data.message || "Review submitted successfully");
      setRating(0);
      setHover(0);
      setComment("");
      fetchReviews();
    } catch (error) {
      console.error("REVIEW ERROR:", error);
      alert(error.response?.data?.message || "Failed to compile review");
    } finally {
      setLoading(false);
    }
  };

  // Helper helper to generate user avatars gracefully
  const getInitials = (name) => {
    if (!name) return "U";
    return name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);
  };

  return (
    <div className="space-y-12">
      
      {/* SECTION TITLE & OVERVIEW BLOCK */}
      <div className="grid md:grid-cols-12 gap-8 items-center bg-gray-50/50 dark:bg-slate-900/40 p-6 sm:p-8 rounded-2xl border border-gray-100 dark:border-slate-800/80">
        
        <div className="md:col-span-4 text-center md:text-left space-y-2 md:border-r border-gray-200 dark:border-slate-800 pr-0 md:pr-8">
          <h2 className="text-xl font-bold tracking-tight text-gray-900 dark:text-white">
            Ratings & Reviews
          </h2>
          <p className="text-sm text-gray-400">
            Verified direct buyer feedback metrics.
          </p>
        </div>

        {/* SCORE SUMMARY CARD */}
        <div className="md:col-span-8 flex flex-col sm:flex-row items-center justify-center md:justify-start gap-6">
          <div className="bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800/60 px-6 py-4 rounded-xl text-center shadow-xs">
            <p className="text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight">
              {averageRating}
            </p>
            <p className="text-xs text-gray-400 font-medium mt-1">out of 5.0</p>
          </div>

          <div className="space-y-1.5 text-center sm:text-left">
            <div className="flex items-center gap-1 text-amber-400 text-lg justify-center sm:justify-start">
              {[1, 2, 3, 4, 5].map((star) => (
                <span key={star}>
                  {star <= Math.round(parseFloat(averageRating)) ? (
                    <FaStar />
                  ) : (
                    <FaRegStar className="text-gray-300 dark:text-slate-700" />
                  )}
                </span>
              ))}
            </div>
            <p className="text-sm font-medium text-gray-600 dark:text-slate-400">
              Aggregated from <span className="font-semibold text-gray-900 dark:text-white">{reviews.length}</span> global community responses
            </p>
          </div>
        </div>
      </div>

      {/* REVIEWS LISTING LOGIC */}
      <div className="space-y-6">
        <h3 className="text-lg font-bold tracking-wide text-gray-900 dark:text-white">
          Customer Commentary
        </h3>

        {reviewsLoading ? (
          <div className="flex items-center gap-3 py-12 justify-center text-gray-400">
            <FaCircleNotch className="animate-spin text-xl text-emerald-600" />
            <span className="text-sm font-medium">Parsing experiences...</span>
          </div>
        ) : reviews.length === 0 ? (
          <div className="border border-dashed border-gray-200 dark:border-slate-800 rounded-2xl p-10 text-center space-y-1">
            <p className="text-gray-500 dark:text-slate-400 font-medium">No reviews published yet</p>
            <p className="text-xs text-gray-400">Acquired this asset? Share your context metrics down below.</p>
          </div>
        ) : (
          <div className="grid gap-4">
            {reviews.map((review) => (
              <div
                key={review._id}
                className="bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800/60 rounded-xl p-5 shadow-2xs space-y-3 transition hover:border-gray-200 dark:hover:border-slate-700"
              >
                {/* ACCOUNT PROFILE HEADER */}
                <div className="flex justify-between items-start gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-xs font-bold text-slate-600 dark:text-slate-300 border border-slate-200/40 dark:border-slate-700/40">
                      {getInitials(review.user?.name)}
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-gray-900 dark:text-white leading-none">
                        {review.user?.name || "Anonymous Consumer"}
                      </h4>
                      <span className="text-[11px] text-gray-400 font-medium">
                        {new Date(review.createdAt).toLocaleDateString(undefined, {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        })}
                      </span>
                    </div>
                  </div>

                  <div className="flex gap-0.5 text-amber-400 text-xs">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <span key={star}>
                        {star <= review.rating ? <FaStar /> : <FaRegStar className="text-gray-200 dark:text-slate-800" />}
                      </span>
                    ))}
                  </div>
                </div>

                {/* TEXTUAL BODY CONTENT */}
                <p className="text-sm text-gray-600 dark:text-slate-300 leading-relaxed pl-13">
                  {review.comment}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* REVIEW GENERATION FORM FORMULATION */}
      <div className="border-t border-gray-100 dark:border-slate-800 pt-8">
        {!user ? (
          <div className="bg-slate-50 dark:bg-slate-900/60 border border-gray-100 dark:border-slate-800/80 rounded-2xl p-6 flex flex-col items-center text-center space-y-3">
            <div className="p-3 bg-white dark:bg-slate-900 rounded-xl shadow-xs text-gray-400">
              <FaLock className="text-sm" />
            </div>
            <div className="space-y-0.5">
              <p className="text-sm font-bold text-gray-900 dark:text-white">Authentication State Mandatory</p>
              <p className="text-xs text-gray-400 max-w-sm">Please register or authenticate an ongoing session instance to append personal analytical feedback.</p>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-bold tracking-wide text-gray-900 dark:text-white">
                Log Product Evaluation
              </h3>
              <p className="text-xs text-gray-400 mt-0.5">Your evaluation helps adjust core structural performance parameters for alternative peers.</p>
            </div>

            <form onSubmit={submitReview} className="space-y-5">
              
              {/* STAR INTERACTIVE MATRIX CONTAINER */}
              <div className="space-y-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-400">
                  Target Rating Allocation
                </label>
                <div className="flex gap-1.5 items-center">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      type="button"
                      key={star}
                      onClick={() => setRating(star)}
                      onMouseEnter={() => setHover(star)}
                      onMouseLeave={() => setHover(0)}
                      className="text-2xl transition-transform active:scale-95 focus:outline-none"
                    >
                      <FaStar
                        className={`transition-colors duration-150 ${
                          star <= (hover || rating)
                            ? "text-amber-400 drop-shadow-xs"
                            : "text-gray-200 dark:text-slate-800"
                        }`}
                      />
                    </button>
                  ))}
                  {rating > 0 && (
                    <span className="text-xs font-semibold text-gray-400 ml-2">
                      ({rating} out of 5 stars selected)
                    </span>
                  )}
                </div>
              </div>

              {/* TEXTAREA INPUT FIELD ACCORDION */}
              <div className="space-y-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-400">
                  Detailed Commentary
                </label>
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  rows="4"
                  placeholder="Detail your qualitative experience regarding execution quality, pacing, or discrepancies encountered..."
                  className="w-full text-sm bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-xl p-4 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/5 placeholder-gray-400 dark:placeholder-slate-600 resize-none shadow-2xs"
                  required
                />
              </div>

              {/* ACTION SUBMISSION EXECUTION TRIGGER */}
              <button
                type="submit"
                disabled={loading}
                className="inline-flex items-center justify-center min-w-[140px] px-6 py-3 bg-slate-900 hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-gray-100 text-white text-xs font-bold uppercase tracking-wider rounded-xl transition shadow-xs active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <div className="flex items-center gap-2">
                    <FaCircleNotch className="animate-spin text-sm" />
                    <span>Processing...</span>
                  </div>
                ) : (
                  "Commit Review"
                )}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}