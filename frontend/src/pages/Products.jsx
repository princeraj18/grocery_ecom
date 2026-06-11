import React, { useState, useMemo, useContext, useEffect } from "react";
import { Link } from "react-router-dom";
import { FaHeart, FaRegHeart, FaSlidersH } from "react-icons/fa";
import { ShopContext } from "../context/ShopContext";

const Products = () => {
  const {
    products,
    categories,
    loadingProducts,
    addToCart,
    addToWishlist,
    removeFromWishlist,
    wishlistItems,
  } = useContext(ShopContext);

  const [search, setSearch] = useState(localStorage.getItem("productSearch") || "");
  const [category, setCategory] = useState("All");
  const [sortPrice, setSortPrice] = useState("");

  const user = JSON.parse(localStorage.getItem("user"));
  const userId = user?._id;

  // =========================
  // WISHLIST IDS
  // =========================
  const wishlistIds = useMemo(() => {
    if (!Array.isArray(wishlistItems)) {
      return [];
    }
    return wishlistItems.map(
      (item) => (item.product?._id || item.product || item.productId)?.toString()
    );
  }, [wishlistItems]);

  // =========================
  // SEARCH SYNC
  // =========================
  useEffect(() => {
    const syncSearch = () => setSearch(localStorage.getItem("productSearch") || "");
    window.addEventListener("storage", syncSearch);
    syncSearch();
    return () => window.removeEventListener("storage", syncSearch);
  }, []);

  // =========================
  // TOGGLE WISHLIST
  // =========================
  const toggleWishlist = async (e, product) => {
    e.preventDefault();
    e.stopPropagation();

    if (!userId) {
      alert("Please login first");
      return;
    }

    try {
      if (wishlistIds.includes(product._id.toString())) {
        await removeFromWishlist(product._id);
      } else {
        await addToWishlist(product);
      }
    } catch (error) {
      console.log("WISHLIST ERROR:", error);
    }
  };

  // =========================
  // FILTER PRODUCTS
  // =========================
  const filteredProducts = useMemo(() => {
    let filtered = [...products];

    // SEARCH
    if (search.trim()) {
      const regex = new RegExp(search, "i");
      filtered = filtered.filter(
        (product) =>
          regex.test(product.name) || regex.test(product.category?.text || "")
      );
    }

    // CATEGORY FILTER
    if (category !== "All") {
      const selected = (category || "").toString().toLowerCase();

      const currentCat = categories.find((cat) => {
        const catPath = (cat.path || "").toString().toLowerCase();
        const catId = (cat._id || "").toString().toLowerCase();
        const catText = (cat.text || "").toString().toLowerCase();
        return catPath === selected || catId === selected || catText === selected;
      });

      const currentCatId = currentCat?._id?.toString() || "";

      filtered = filtered.filter((product) => {
        if (typeof product.category === "object" && product.category) {
          const prodPath = (product.category.path || "").toString().toLowerCase();
          const prodId = (product.category._id || "").toString().toLowerCase();
          const prodText = (product.category.text || "").toString().toLowerCase();

          return (
            prodPath === selected ||
            prodId === selected ||
            prodText === selected ||
            (currentCatId && prodId === currentCatId)
          );
        } else if (typeof product.category === "string") {
          const prodIdStr = product.category.toString().toLowerCase();
          return prodIdStr === selected || (currentCatId && prodIdStr === currentCatId);
        }
        return false;
      });
    }

    // SORT LOW TO HIGH
    if (sortPrice === "low-high") {
      filtered.sort(
        (a, b) => (a.variants?.[0]?.offerPrice || 0) - (b.variants?.[0]?.offerPrice || 0)
      );
    }

    // SORT HIGH TO LOW
    if (sortPrice === "high-low") {
      filtered.sort(
        (a, b) => (b.variants?.[0]?.offerPrice || 0) - (a.variants?.[0]?.offerPrice || 0)
      );
    }

    return filtered;
  }, [search, category, sortPrice, products, categories]);

  // =========================
  // ADD TO CART
  // =========================
  const handleAdd = async (e, item) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      await addToCart(item);
    } catch (error) {
      console.log("ADD TO CART ERROR:", error);
    }
  };

  if (loadingProducts) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-[#f6f7f1] dark:bg-slate-950 text-slate-900 dark:text-slate-100">
        <h2 className="text-2xl font-black tracking-tight animate-pulse">
          Loading Products...
        </h2>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f6f7f1] dark:bg-slate-950 px-4 py-6 sm:px-6 lg:px-8 text-slate-900 dark:text-slate-100 transition-colors duration-200">
      <div className="mx-auto max-w-7xl">
        
        {/* TOP BRAND HEADER ROW */}
        <div className="mb-6 rounded-2xl bg-[#172337] dark:bg-slate-900 p-6 text-white border border-transparent dark:border-slate-800/60 shadow-sm">
          <p className="text-xs font-black uppercase tracking-wider text-[#f7d851]">
            Grocify Supermart
          </p>
          <div className="mt-2 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <h1 className="text-2xl sm:text-4xl font-black tracking-tight">
                Fresh groceries and pantry essentials
              </h1>
              <p className="mt-1 text-xs sm:text-sm text-slate-300">
                Quick delivery, daily offers, and trusted vendors in one shelf.
              </p>
            </div>
            <div className="w-fit rounded-xl bg-white/10 dark:bg-slate-950/40 border border-white/5 dark:border-slate-800 px-4 py-2.5 text-xs font-bold tracking-wide">
              Showing <span className="text-amber-400 font-black">{filteredProducts.length}</span> items
            </div>
          </div>
        </div>

        {/* CONTROLS LAYOUT STRUCT */}
        <div className="grid gap-6 lg:grid-cols-[260px_1fr]">
          
          {/* CONTROL SIDEBAR FOR FILTERING */}
          <aside className="h-fit rounded-2xl border border-slate-200 dark:border-slate-800/80 bg-white dark:bg-slate-900 p-5 shadow-sm lg:sticky lg:top-24 space-y-5">
            <div className="flex items-center gap-2 text-base font-black tracking-tight">
              <FaSlidersH className="text-[#0c831f] dark:text-emerald-500" />
              Filters
            </div>

            {/* CONTROL BLOCK: SEARCH */}
            <div>
              <label className="text-[10px] font-black uppercase tracking-wider text-slate-400 dark:text-slate-500">
                Search
              </label>
              <input
                type="text"
                placeholder="Search groceries..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  localStorage.setItem("productSearch", e.target.value);
                }}
                className="mt-1.5 w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3.5 py-2.5 text-sm outline-none focus:border-[#0c831f] dark:focus:border-emerald-500 transition-colors"
              />
            </div>

            {/* CONTROL BLOCK: CATEGORY ITERATORS */}
            <div>
              <label className="block text-[10px] font-black uppercase tracking-wider text-slate-400 dark:text-slate-500">
                Categories
              </label>
              <div className="mt-2 grid gap-1.5 max-h-[260px] overflow-y-auto pr-1">
                <button
                  onClick={() => {
                    setCategory("All");
                    setSearch("");
                    localStorage.removeItem("productSearch");
                  }}
                  className={`rounded-xl px-3 py-2.5 text-left text-xs font-bold transition-colors ${
                    category === "All"
                      ? "bg-[#e9f6eb] dark:bg-emerald-950/30 text-[#0c831f] dark:text-emerald-400"
                      : "bg-slate-50 dark:bg-slate-950 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/60"
                  }`}
                >
                  All Categories
                </button>

                {categories.map((cat) => {
                  const catKey = cat.path || cat._id;
                  const isActive =
                    category === "All"
                      ? false
                      : (cat.path && category?.toLowerCase() === cat.path?.toLowerCase()) ||
                        (cat._id && category?.toString() === cat._id?.toString()) ||
                        (cat.text && category?.toLowerCase() === cat.text?.toLowerCase());

                  return (
                    <button
                      key={cat._id}
                      onClick={() => {
                        setCategory(catKey);
                        setSearch("");
                        localStorage.removeItem("productSearch");
                      }}
                      className={`rounded-xl px-3 py-2.5 text-left text-xs font-bold transition-colors ${
                        isActive
                          ? "bg-[#e9f6eb] dark:bg-emerald-950/30 text-[#0c831f] dark:text-emerald-400"
                          : "bg-slate-50 dark:bg-slate-950 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/60"
                      }`}
                    >
                      {cat.text}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* CONTROL BLOCK: VALUE SORTING */}
            <div>
              <label className="block text-[10px] font-black uppercase tracking-wider text-slate-400 dark:text-slate-500">
                Sort
              </label>
              <select
                value={sortPrice}
                onChange={(e) => setSortPrice(e.target.value)}
                className="mt-1.5 w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2.5 text-xs font-bold outline-none focus:border-[#0c831f] dark:focus:border-emerald-500 transition-colors"
              >
                <option value="">Recommended</option>
                <option value="low-high">Price: Low to High</option>
                <option value="high-low">Price: High to Low</option>
              </select>
            </div>
          </aside>

          {/* MAIN CONTAINER CATALOG VIEW */}
          <main>
            <div className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-4">
              {filteredProducts.map((item) => {
                const actualPrice = item.variants?.[0]?.price || 0;
                const offerPrice = item.variants?.[0]?.offerPrice || 0;
                const discount = actualPrice > 0 ? Math.round(((actualPrice - offerPrice) / actualPrice) * 100) : 0;

                return (
                  <Link
                    key={item._id}
                    to={`/products/${item._id}`}
                    className="group rounded-2xl border border-slate-200 dark:border-slate-800/80 bg-white dark:bg-slate-900 p-3 shadow-sm flex flex-col justify-between transition-all hover:shadow-md"
                  >
                    <div>
                      {/* CARD IMAGE CONTAINER */}
                      <div className="relative flex aspect-square items-center justify-center rounded-xl bg-[#f7f8f3] dark:bg-slate-950/40 p-2">
                        {discount > 0 && (
                          <span className="absolute left-2 top-2 rounded bg-[#0c831f] dark:bg-emerald-600 px-2 py-0.5 text-[10px] font-black text-white tracking-wide">
                            {discount}% OFF
                          </span>
                        )}

                        <button
                          type="button"
                          onClick={(e) => toggleWishlist(e, item)}
                          className="absolute right-2 top-2 z-20 flex h-8 w-8 items-center justify-center rounded-full bg-white dark:bg-slate-900 shadow-sm border border-slate-100 dark:border-slate-800/40 active:scale-95 transition-transform"
                        >
                          {wishlistIds.includes(item._id.toString()) ? (
                            <FaHeart className="text-red-500 text-xs" />
                          ) : (
                            <FaRegHeart className="text-slate-400 dark:text-slate-500 text-xs" />
                          )}
                        </button>

                        <img
                          src={Array.isArray(item.image) ? item.image[0] : item.image}
                          alt={item.name}
                          className="h-28 w-28 sm:h-32 sm:w-32 object-contain transition-transform duration-300 group-hover:scale-105"
                        />
                      </div>

                      {/* CARD LABEL METRICS */}
                      <div className="pt-2.5">
                        <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wide">
                          {item.category?.text}
                        </p>
                        <h3 className="mt-0.5 min-h-[40px] text-xs sm:text-sm font-black leading-snug text-slate-800 dark:text-slate-200 line-clamp-2">
                          {item.name}
                        </h3>
                      </div>
                    </div>

                    {/* CARD FINANCIAL CONSTRAINTS ROW */}
                    <div className="mt-3 flex items-end justify-between gap-2 pt-2 border-t border-slate-50 dark:border-slate-800/40">
                      <div>
                        <p className="text-sm sm:text-base font-black text-slate-900 dark:text-white">
                          Rs. {offerPrice}
                        </p>
                        {actualPrice > offerPrice && (
                          <p className="text-[10px] sm:text-xs text-slate-400 line-through">
                            Rs. {actualPrice}
                          </p>
                        )}
                      </div>

                      <button
                        type="button"
                        className="rounded-lg border border-[#0c831f] dark:border-emerald-500 px-3 py-1.5 text-xs font-black text-[#0c831f] dark:text-emerald-400 bg-emerald-50/10 dark:bg-emerald-950/10 hover:bg-[#0c831f] dark:hover:bg-emerald-600 hover:text-white dark:hover:text-white transition-colors"
                        onClick={(e) => handleAdd(e, item)}
                      >
                        ADD
                      </button>
                    </div>
                  </Link>
                );
              })}
            </div>

            {/* EMPTY RESULT PLACEHOLDER */}
            {filteredProducts.length === 0 && (
              <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800/60 py-20 text-center shadow-sm">
                <h2 className="text-xl font-black text-slate-700 dark:text-slate-300">
                  No products found
                </h2>
                <p className="mt-1 text-xs text-slate-400 dark:text-slate-500 font-medium">
                  Try changing your search parameters or query filters.
                </p>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default Products;