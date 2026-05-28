import React, {
  useState,
  useMemo,
  useContext,
  useEffect,
} from "react";

import { Link } from "react-router-dom";

import {
  FaHeart,
  FaRegHeart,
  FaCheckCircle,
  FaSlidersH,
} from "react-icons/fa";

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

  const [search, setSearch] = useState(
    localStorage.getItem("productSearch") || ""
  );

  const [category, setCategory] =
    useState("All");

  const [sortPrice, setSortPrice] =
    useState("");

  const user = JSON.parse(
    localStorage.getItem("user")
  );

  const userId = user?._id;

  // =========================
  // WISHLIST IDS
  // =========================
  const wishlistIds = useMemo(() => {
    return wishlistItems.map(
      (item) =>
        item.product?._id ||
        item.productId
    );
  }, [wishlistItems]);

  // =========================
  // SEARCH SYNC
  // =========================
  useEffect(() => {
    const syncSearch = () =>
      setSearch(
        localStorage.getItem(
          "productSearch"
        ) || ""
      );

    window.addEventListener(
      "storage",
      syncSearch
    );

    syncSearch();

    return () =>
      window.removeEventListener(
        "storage",
        syncSearch
      );
  }, []);

  // =========================
  // TOGGLE WISHLIST
  // =========================
  const toggleWishlist = async (
    e,
    productId
  ) => {
    e.preventDefault();

    if (!userId) {
      alert("Please login first");
      return;
    }

    try {
      if (
        wishlistIds.includes(productId)
      ) {
        await removeFromWishlist(
          productId
        );
      } else {
        await addToWishlist(
          productId
        );
      }
    } catch (error) {
      console.log(
        "WISHLIST ERROR:",
        error
      );
    }
  };

  // =========================
  // FILTER PRODUCTS
  // =========================
  const filteredProducts =
    useMemo(() => {
      let filtered = [...products];

      // SEARCH
      if (search.trim()) {
        const regex = new RegExp(
          search,
          "i"
        );

        filtered = filtered.filter(
          (product) =>
            regex.test(product.name) ||
            regex.test(
              product.category?.text ||
                ""
            )
        );
      }

      // CATEGORY FILTER
      if (category !== "All") {
        const selected = (category || "").toString().toLowerCase();
        
        // Find the currently selected category object
        const currentCat = categories.find((cat) => {
          const catPath = (cat.path || "").toString().toLowerCase();
          const catId = (cat._id || "").toString().toLowerCase();
          const catText = (cat.text || "").toString().toLowerCase();
          return catPath === selected || catId === selected || catText === selected;
        });
        
        const currentCatId = currentCat?._id?.toString() || "";
        
        filtered = filtered.filter((product) => {
          // Handle product.category as object or string
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
            // If product.category is stored as a string (ObjectId)
            const prodIdStr = product.category.toString().toLowerCase();
            return (
              prodIdStr === selected ||
              (currentCatId && prodIdStr === currentCatId)
            );
          }
          return false;
        });
      }

      // SORT LOW TO HIGH
      if (sortPrice === "low-high") {
        filtered.sort(
          (a, b) =>
            (a.variants?.[0]
              ?.offerPrice || 0) -
            (b.variants?.[0]
              ?.offerPrice || 0)
        );
      }

      // SORT HIGH TO LOW
      if (sortPrice === "high-low") {
        filtered.sort(
          (a, b) =>
            (b.variants?.[0]
              ?.offerPrice || 0) -
            (a.variants?.[0]
              ?.offerPrice || 0)
        );
      }

      return filtered;
    }, [
      search,
      category,
      sortPrice,
      products,
    ]);

  // =========================
  // ADD TO CART
  // =========================
  const handleAdd = (
    e,
    item
  ) => {
    e.preventDefault();
    addToCart(item);
  };

  // =========================
  // LOADING
  // =========================
  if (loadingProducts) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <h2 className="text-2xl font-semibold">
          Loading Products...
        </h2>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f6f7f1] px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">

        {/* HEADER */}
        <div className="mb-5 rounded-[8px] bg-[#172337] p-5 text-white">
          <p className="text-sm font-bold text-[#f7d851]">
            Grocify Supermart
          </p>

          <div className="mt-2 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">

            <div>
              <h1 className="text-3xl font-black sm:text-4xl">
                Fresh groceries and pantry essentials
              </h1>

              <p className="mt-2 text-sm text-white/75">
                Quick delivery, daily offers, and trusted vendors in one shelf.
              </p>
            </div>

            <div className="rounded bg-white/10 px-4 py-3 text-sm font-bold">
              Showing{" "}
              {
                filteredProducts.length
              }{" "}
              items
            </div>
          </div>
        </div>

        <div className="grid gap-5 lg:grid-cols-[250px_1fr]">

          {/* SIDEBAR */}
          <aside className="h-fit rounded-[8px] border border-slate-200 bg-white p-4 shadow-sm lg:sticky lg:top-24">

            <div className="mb-4 flex items-center gap-2 text-lg font-black">
              <FaSlidersH className="text-[#0c831f]" />
              Filters
            </div>

            {/* SEARCH */}
            <label className="text-xs font-black uppercase text-slate-500">
              Search
            </label>

            <input
              type="text"
              placeholder="Search groceries..."
              value={search}
              onChange={(e) => {
                setSearch(
                  e.target.value
                );

                localStorage.setItem(
                  "productSearch",
                  e.target.value
                );
              }}
              className="mt-2 w-full rounded border border-slate-200 px-3 py-3 text-sm outline-none focus:border-[#0c831f]"
            />

            {/* CATEGORY */}
            <label className="mt-5 block text-xs font-black uppercase text-slate-500">
              Categories
            </label>

            <div className="mt-2 grid gap-2">

              <button
                onClick={() => {
                  setCategory("All");
                  setSearch("");
                  localStorage.removeItem("productSearch");
                }}
                className={`rounded px-3 py-2 text-left text-sm font-bold ${
                  category === "All"
                    ? "bg-[#e9f6eb] text-[#0c831f]"
                    : "bg-slate-50 text-slate-700"
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
                    className={`rounded px-3 py-2 text-left text-sm font-bold ${
                      isActive ? "bg-[#e9f6eb] text-[#0c831f]" : "bg-slate-50 text-slate-700"
                    }`}
                  >
                    {cat.text}
                  </button>
                );
              })}
            </div>

            {/* SORT */}
            <label className="mt-5 block text-xs font-black uppercase text-slate-500">
              Sort
            </label>

            <select
              value={sortPrice}
              onChange={(e) =>
                setSortPrice(
                  e.target.value
                )
              }
              className="mt-2 w-full rounded border border-slate-200 px-3 py-3 text-sm font-semibold outline-none focus:border-[#0c831f]"
            >
              <option value="">
                Recommended
              </option>

              <option value="low-high">
                Price: Low to High
              </option>

              <option value="high-low">
                Price: High to Low
              </option>
            </select>
          </aside>

          {/* PRODUCTS */}
          <main>

            <div className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-4">

              {filteredProducts.map(
                (item) => {

                  const actualPrice =
                    item.variants?.[0]
                      ?.price || 0;

                  const offerPrice =
                    item.variants?.[0]
                      ?.offerPrice || 0;

                  const discount =
                    actualPrice > 0
                      ? Math.round(
                          ((actualPrice -
                            offerPrice) /
                            actualPrice) *
                            100
                        )
                      : 0;

                  return (
                    <Link
                      key={item._id}
                      to={`/products/${item._id}`}
                      className="group rounded-[8px] border border-slate-200 bg-white p-3 shadow-sm"
                    >

                      <div className="relative flex aspect-square items-center justify-center rounded-[8px] bg-[#f7f8f3]">

                        <span className="absolute left-2 top-2 rounded bg-[#0c831f] px-2 py-1 text-[11px] font-black text-white">
                          {discount}% OFF
                        </span>

                        <button
                          onClick={(e) =>
                            toggleWishlist(
                              e,
                              item._id
                            )
                          }
                          className="absolute right-2 top-2 z-20 flex h-8 w-8 items-center justify-center rounded-full bg-white shadow-sm"
                        >
                          {wishlistIds.includes(
                            item._id
                          ) ? (
                            <FaHeart className="text-red-500" />
                          ) : (
                            <FaRegHeart className="text-slate-500" />
                          )}
                        </button>

                        <img
                          src={
                            Array.isArray(
                              item.image
                            )
                              ? item.image[0]
                              : item.image
                          }
                          alt={item.name}
                          className="h-32 w-32 object-contain"
                        />
                      </div>

                      <div className="pt-3">

                        <p className="text-xs font-bold text-slate-500">
                          {
                            item.category
                              ?.text
                          }
                        </p>

                        <h3 className="mt-1 min-h-[40px] text-sm font-black leading-snug text-slate-900 line-clamp-2">
                          {item.name}
                        </h3>

                        <div className="mt-3 flex items-end justify-between gap-2">

                          <div>
                            <p className="text-base font-black">
                              Rs.{" "}
                              {
                                offerPrice
                              }
                            </p>

                            <p className="text-xs text-slate-400 line-through">
                              Rs.{" "}
                              {
                                actualPrice
                              }
                            </p>
                          </div>

                          <button
                            className="rounded border border-[#0c831f] px-3 py-1.5 text-xs font-black text-[#0c831f]"
                            onClick={(e) =>
                              handleAdd(
                                e,
                                item
                              )
                            }
                          >
                            ADD
                          </button>
                        </div>
                      </div>
                    </Link>
                  );
                }
              )}
            </div>

            {/* EMPTY */}
            {filteredProducts.length ===
              0 && (
              <div className="rounded-[8px] bg-white py-20 text-center shadow-sm">
                <h2 className="text-2xl font-black text-slate-700">
                  No products found
                </h2>

                <p className="mt-2 text-slate-500">
                  Try changing your
                  filters.
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