import React, { useEffect, useState } from "react";
import api from "../api/api"; // Swapped hardcoded axios out for your central configured API routing instance
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import { Menu, X, Trash2, Star, MessageSquare } from "lucide-react";

export default function Reviews() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // ====================================
  // FETCH VENDOR REVIEWS
  // ====================================
  const fetchReviews = async () => {
    try {
      const token = localStorage.getItem("vendorToken");
      const { data } = await api.get("/reviews/vendor", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setReviews(data.reviews || []);
    } catch (error) {
      console.error("Error fetching reviews:", error);
    } finally {
      setLoading(false);
    }
  };

  // ====================================
  // DELETE REVIEW
  // ====================================
  const deleteReview = async (id) => {
    try {
      const token = localStorage.getItem("vendorToken");
      const confirmDelete = window.confirm("Are you sure you want to delete this review?");
      if (!confirmDelete) return;

      await api.delete(`/reviews/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setReviews((prev) => prev.filter((review) => review._id !== id));
    } catch (error) {
      console.error("Error deleting review:", error);
      alert(error.response?.data?.message || "Failed to delete review");
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  return (
    <div className="flex h-screen w-screen bg-gray-50 dark:bg-slate-950 overflow-hidden relative text-gray-900 dark:text-white font-sans">
      {/* MOBILE OVERLAY */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden transition-opacity duration-300"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* SIDEBAR CONTAINER */}
      <aside
        className={`fixed lg:static top-0 bottom-0 left-0 z-50 w-64 bg-white dark:bg-slate-900 h-full border-r border-gray-200 dark:border-slate-800 transition-transform duration-300 ease-in-out ${ sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0" }`}
      >
        <Sidebar />
      </aside>

      {/* MAIN LAYOUT WRAPPER */}
      <div className="flex-1 flex flex-col h-full min-w-0 overflow-hidden">
        {/* TOP NAV BAR */}
        <header className="sticky top-0 z-30 bg-white dark:bg-slate-900 border-b border-gray-200 dark:border-slate-800 flex items-center h-16 px-4">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="lg:hidden p-2 text-gray-600 dark:text-slate-400 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-lg transition-colors mr-2"
            aria-label="Toggle Menu"
          >
            {sidebarOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
          
          <div className="flex-1 min-w-0">
            <Navbar />
          </div>
        </header>

        {/* SCROLLABLE PAGE CONTENT */}
        <main className="flex-1 overflow-y-auto bg-gray-50/50 dark:bg-slate-950 p-4 sm:p-6 lg:p-8">
          {/* HEADER */}
          <div className="mb-8">
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
              Product Reviews
            </h1>
            <p className="text-gray-500 dark:text-slate-400 mt-1 text-xs sm:text-sm">
              Manage and monitor customer feedback across your product listings.
            </p>
          </div>

          {/* MAIN STATES CONTAINER */}
          {loading ? (
            <div className="flex flex-col justify-center items-center h-[50vh] gap-3">
              <div className="w-8 h-8 border-2 border-gray-900 dark:border-white border-t-transparent rounded-full animate-spin"></div>
              <div className="text-sm font-medium text-gray-500 dark:text-slate-400 animate-pulse">
                Loading feedback history...
              </div>
            </div>
          ) : reviews.length === 0 ? (
            <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 p-16 rounded-xl text-center max-w-md mx-auto mt-12 shadow-sm">
              <div className="w-12 h-12 rounded-full bg-gray-50 dark:bg-slate-800 flex items-center justify-center mx-auto mb-4 border border-gray-100 dark:border-slate-700">
                <MessageSquare size={20} className="text-gray-400 dark:text-slate-500" />
              </div>
              <h2 className="text-base font-semibold text-gray-900 dark:text-white mb-1">
                No Reviews Found
              </h2>
              <p className="text-gray-500 dark:text-slate-400 text-xs max-w-xs mx-auto leading-relaxed">
                Customers haven't submitted any performance reviews for your items yet.
              </p>
            </div>
          ) : (
            /* FIXED REVIEWS GRID */
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 max-w-[1600px] mx-auto">
              {reviews.map((review) => (
                <div
                  key={review._id}
                  className="bg-white dark:bg-slate-900 rounded-xl border border-gray-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col justify-between h-[440px] w-full min-w-0 overflow-hidden"
                >
                  {/* TOP CONTAINER (IMAGE & DATA PACKET) */}
                  <div className="flex flex-col min-h-0">
                    
                    {/* FIXED PRODUCT BANNER IMAGE */}
                    <div className="relative h-40 w-full bg-gray-100 dark:bg-slate-950 border-b border-gray-100 dark:border-slate-800 flex-shrink-0 overflow-hidden">
                      <img
                        src={
                          Array.isArray(review.product?.image)
                            ? review.product?.image[0]
                            : review.product?.image || ""
                        }
                        alt={review.product?.name || "Product"}
                        className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                        onError={(e) => {
                          e.target.src = "https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=600&auto=format&fit=crop&q=60";
                        }}
                      />
                      {review.product?.category?.text && (
                        <span className="absolute top-3 right-3 bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm border border-gray-200 dark:border-slate-800 text-gray-800 dark:text-slate-200 px-2.5 py-0.5 rounded-md text-[11px] font-medium uppercase tracking-wider">
                          {review.product.category.text}
                        </span>
                      )}
                    </div>

                    {/* CONTENT INNER WRAPPER */}
                    <div className="p-5 space-y-3.5 min-h-0 flex flex-col">
                      {/* Product Name Title */}
                      <div>
                        <h2 className="text-sm font-bold text-gray-900 dark:text-white line-clamp-1" title={review.product?.name}>
                          {review.product?.name || "Unknown Product"}
                        </h2>
                      </div>

                      {/* Customer Summary Mini-Panel */}
                      <div className="bg-gray-50/70 dark:bg-slate-800/40 p-2.5 rounded-lg border border-gray-100 dark:border-slate-800/60 flex flex-col justify-center h-[54px] flex-shrink-0">
                        <h3 className="font-semibold text-xs text-gray-800 dark:text-slate-200 line-clamp-1">
                          {review.user?.name || "Anonymous User"}
                        </h3>
                        <p className="text-[11px] text-gray-400 dark:text-slate-500 break-all line-clamp-1 mt-0.5">
                          {review.user?.email || "No email available"}
                        </p>
                      </div>

                      {/* Star Rating Tracker */}
                      <div className="flex-shrink-0">
                        <div className="flex items-center gap-0.5">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              size={15}
                              className={`${ star <= review.rating ? "text-amber-400 fill-amber-400" : "text-gray-200 dark:text-slate-700" }`}
                            />
                          ))}
                        </div>
                      </div>

                      {/* Comment Body - Uniformly Restricted */}
                      <div className="flex-1 min-h-0 overflow-y-auto custom-scrollbar">
                        <p className="text-gray-600 dark:text-slate-400 leading-relaxed text-xs line-clamp-3 italic">
                          "{review.comment || "No written feedback text was provided by the buyer."}"
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* BOTTOM ACTION BAR - RIGID ALIGNMENT */}
                  <div className="px-5 py-4 border-t border-gray-100 dark:border-slate-800 flex items-center justify-between gap-4 flex-shrink-0 bg-gray-50/30 dark:bg-slate-800/20 rounded-b-xl">
                    <span className="text-[11px] font-medium text-gray-400 dark:text-slate-500 tracking-wide">
                      {review.createdAt ? new Date(review.createdAt).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      }) : "Recent"}
                    </span>
                    
                    <button
                      onClick={() => deleteReview(review._id)}
                      className="border border-gray-200 dark:border-slate-800 hover:border-red-200 dark:hover:border-red-900/50 text-gray-600 dark:text-slate-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50/50 dark:hover:bg-red-950/20 px-3 py-1.5 rounded-lg text-[11px] font-semibold flex items-center gap-1.5 transition-all duration-150 active:scale-[0.97]"
                    >
                      <Trash2 size={13} />
                      Delete
                    </button>
                  </div>

                </div>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}