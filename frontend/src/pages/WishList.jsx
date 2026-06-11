import React, { useContext, useEffect, useState } from "react";
import api from "../api/Axios";
import { useNavigate } from "react-router-dom";
import { ShopContext } from "../context/ShopContext";
import { FaHeart, FaTrashAlt, FaEye, FaShoppingBag } from "react-icons/fa";

const WishList = () => {
  const navigate = useNavigate();

  const { fetchWishlist: refreshNavbarWishlist, removeFromWishlist } =
    useContext(ShopContext);

  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);

  // ======================================
  // GET USER
  // ======================================
  const user = JSON.parse(localStorage.getItem("user"));
  const userId = user?._id;

  // ======================================
  // NORMALIZE WISHLIST
  // ======================================
  const normalizeWishlist = (wishlistData) => {
    if (Array.isArray(wishlistData?.items)) {
      return wishlistData.items;
    }
    if (Array.isArray(wishlistData)) {
      return wishlistData;
    }
    return [];
  };

  // ======================================
  // FETCH WISHLIST
  // ======================================
  const fetchWishlist = async () => {
    try {
      const { data } = await api.get(`/wishlist/${userId}`);
      setWishlist(normalizeWishlist(data.wishlist));
    } catch (error) {
      console.log("WISHLIST ERROR:", error);
    } finally {
      setLoading(false);
    }
  };

  // ======================================
  // REMOVE ITEM
  // ======================================
  const removeItem = async (productId) => {
    try {
      await removeFromWishlist(productId);
      setWishlist((prev) =>
        prev.filter((item) => item.product?._id !== productId)
      );
      await refreshNavbarWishlist();
    } catch (error) {
      console.log("REMOVE ERROR:", error);
    }
  };

  useEffect(() => {
    if (userId) {
      fetchWishlist();
    } else {
      setLoading(false);
    }
  }, [userId]);

  // ======================================
  // LOADING STATE
  // ======================================
  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen bg-slate-50 dark:bg-slate-950">
        <div className="h-8 w-8 border-2 border-slate-300 border-t-black dark:border-t-white rounded-full animate-spin mb-4" />
        <p className="text-sm font-bold tracking-wide text-slate-400 dark:text-slate-500 uppercase animate-pulse">
          Loading Saved Items...
        </p>
      </div>
    );
  }

  return (
    <div className="bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 min-h-screen transition-colors duration-200 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        
        {/* HEADER */}
        <div className="flex items-center gap-3 mb-8 border-b border-slate-200 dark:border-slate-800 pb-5">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-50 dark:bg-red-950/20 text-red-500">
            <FaHeart className="text-base" />
          </div>
          <div>
            <h1 className="text-xl font-black tracking-tight sm:text-2xl">
              My Wishlist
            </h1>
            <p className="text-xs font-medium text-slate-400 dark:text-slate-500 mt-0.5">
              Review and manage your curated product choices ({wishlist.length} items)
            </p>
          </div>
        </div>

        {/* EMPTY STATE */}
        {wishlist.length === 0 ? (
          <div className="max-w-md mx-auto border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-2xl p-10 text-center shadow-sm">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-slate-50 dark:bg-slate-950 text-slate-300 dark:text-slate-700 mx-auto mb-4">
              <FaShoppingBag size={24} />
            </div>
            <h2 className="text-base font-black mb-1">Your wishlist is empty</h2>
            <p className="text-xs text-slate-400 dark:text-slate-500 mb-6 max-w-xs mx-auto">
              Tap the heart icon on any item while browsing to save it right here.
            </p>
            <button
              onClick={() => navigate("/products")}
              className="inline-flex items-center justify-center bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-950 text-xs font-bold px-5 py-2.5 rounded-xl hover:opacity-90 active:scale-95 transition-all shadow-sm"
            >
              Browse Catalog
            </button>
          </div>
        ) : (
          /* GRID SYSTEM */
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {wishlist.map((item) => {
              const product = item.product;
              if (!product) return null;

              const variants = Array.isArray(product?.variants) ? product.variants : [];
              const firstVariant = variants[0] || {};

              const totalStock = variants.length > 0
                ? variants.reduce((total, v) => total + Number(v.stockQuantity || v.stock || 0), 0)
                : Number(product?.stockQuantity || product?.stock || 0);

              const productImage = Array.isArray(product?.image) ? product.image[0] : product?.image;

              return (
                <div
                  key={item._id}
                  className="group relative flex flex-col justify-between border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-2xl shadow-sm overflow-hidden hover:shadow-md transition-all duration-200"
                >
                  <div>
                    {/* IMAGE FRAME WITH HOVER INTERACTIONS */}
                    <div className="relative aspect-square w-full overflow-hidden bg-slate-50 dark:bg-slate-950 border-b border-slate-100 dark:border-slate-800/50">
                      <img
                        src={productImage}
                        alt={product?.name}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        loading="lazy"
                      />
                      
                      {/* MINI STOCK LABEL */}
                      <span
                        className={`absolute top-2.5 left-2.5 text-[10px] font-bold px-2 py-0.5 rounded-md tracking-wide ${
                          totalStock > 0
                            ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400 border border-emerald-200/40"
                            : "bg-rose-50 text-rose-600 dark:bg-rose-950/50 dark:text-rose-400 border border-rose-200/40"
                        }`}
                      >
                        {totalStock > 0 ? "IN STOCK" : "OUT OF STOCK"}
                      </span>

                      {/* QUICK REMOVE HOVER ICON */}
                      <button
                        onClick={() => removeItem(product?._id)}
                        title="Remove from wishlist"
                        className="absolute top-2.5 right-2.5 flex h-7 w-7 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-400 hover:text-rose-500 hover:border-rose-200 transition-all shadow-sm dark:bg-slate-900 dark:border-slate-800"
                      >
                        <FaTrashAlt className="text-xs" />
                      </button>
                    </div>

                    {/* CORE DATA BODY */}
                    <div className="p-3.5">
                      <p className="text-[10px] font-bold tracking-wider text-slate-400 uppercase truncate">
                        {product?.category?.text || product?.category || "General"}
                      </p>
                      
                      <h2 className="font-bold text-xs tracking-tight text-slate-800 dark:text-slate-100 mt-1 line-clamp-2 min-h-[32px] group-hover:text-slate-600 dark:group-hover:text-slate-300 transition-colors">
                        {product?.name}
                      </h2>

                      {/* VARIABLE SIZES MATRIX */}
                      <div className="flex flex-wrap gap-1 mt-2.5 min-h-[20px]">
                        {variants.length > 0 ? (
                          variants.slice(0, 4).map((v, index) => (
                            <span
                              key={index}
                              className="bg-slate-100 dark:bg-slate-800 border border-slate-200/30 dark:border-slate-700/30 text-[9px] font-bold px-1.5 py-0.5 rounded text-slate-500 dark:text-slate-400"
                            >
                              {v.size || "N/A"}
                            </span>
                          ))
                        ) : (
                          <span className="text-[10px] font-medium text-slate-400 dark:text-slate-500">
                            Standard Size
                          </span>
                        )}
                        {variants.length > 4 && (
                          <span className="text-[9px] font-bold text-slate-400 self-center">
                            +{variants.length - 4} more
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* TRANSACTION FOOTER CONTAINER */}
                  <div className="p-3.5 pt-0 border-t border-slate-50 dark:border-slate-800/40 mt-2">
                    <div className="flex items-baseline gap-2 mb-3">
                      <span className="text-sm font-black text-slate-900 dark:text-white">
                        ₹{firstVariant?.offerPrice ?? firstVariant?.price ?? 0}
                      </span>
                      {firstVariant?.price && firstVariant?.offerPrice < firstVariant?.price && (
                        <span className="text-[10px] font-semibold text-slate-400 line-through">
                          ₹{firstVariant?.price}
                        </span>
                      )}
                    </div>

                    {/* COMPACT CLEAN DIRECT ACTION */}
                    <button
                      onClick={() => navigate(`/products/${product?._id}`)}
                      className="w-full flex h-8 items-center justify-center gap-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-900 transition-all active:scale-[0.98]"
                    >
                      <FaEye className="text-[11px]" />
                      <span>View Details</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default WishList;