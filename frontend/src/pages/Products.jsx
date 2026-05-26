import React, { useState, useMemo, useContext, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { FaHeart, FaRegHeart, FaCheckCircle, FaSlidersH } from "react-icons/fa";

import { ShopContext } from "../context/ShopContext";
import { dummyProducts, categories } from "../assets/greencart_assets/assets";

const isMongoObjectId = (id) => /^[a-f\d]{24}$/i.test(id || "");

const Products = () => {
  const { products, addToCart, fetchWishlist } = useContext(ShopContext);
  const [search, setSearch] = useState(localStorage.getItem("productSearch") || "");
  const [category, setCategory] = useState("All");
  const [sortPrice, setSortPrice] = useState("");
  const [wishlistIds, setWishlistIds] = useState([]);

  const user = JSON.parse(localStorage.getItem("user"));
  const userId = user?._id;

  useEffect(() => {
    const fetchWishlist = async () => {
      try {
        const { data } = await axios.get(
          `http://localhost:5000/api/wishlist/${userId}`
        );
        setWishlistIds(data.wishlist.map((item) => item.product?._id));
      } catch (error) {
        console.log("WISHLIST ERROR:", error);
      }
    };

    if (userId) fetchWishlist();
  }, [userId]);

  useEffect(() => {
    const syncSearch = () => setSearch(localStorage.getItem("productSearch") || "");
    window.addEventListener("storage", syncSearch);
    syncSearch();
    return () => window.removeEventListener("storage", syncSearch);
  }, []);

  const toggleWishlist = async (e, productId) => {
    e.preventDefault();

    if (!userId) {
      alert("Please login first");
      return;
    }

    if (!isMongoObjectId(productId)) {
      alert("Wishlist is available for database products only");
      return;
    }

    try {
      if (wishlistIds.includes(productId)) {
        await axios.delete("http://localhost:5000/api/wishlist/remove", {
          data: { userId, productId },
        });
        setWishlistIds(wishlistIds.filter((id) => id !== productId));
        await fetchWishlist();
      } else {
        await axios.post("http://localhost:5000/api/wishlist/add", {
          userId,
          productId,
        });
        setWishlistIds([...wishlistIds, productId]);
        await fetchWishlist();
      }
    } catch (error) {
      console.log("WISHLIST TOGGLE ERROR:", error);
    }
  };

  const filteredProducts = useMemo(() => {
    const allProducts = [...dummyProducts, ...products];
    let filtered = [...allProducts];

    if (search.trim()) {
      const regex = new RegExp(search, "i");
      filtered = filtered.filter(
        (product) => regex.test(product.name) || regex.test(product.category)
      );
    }

    if (category !== "All") {
      filtered = filtered.filter((product) => product.category === category);
    }

    if (sortPrice === "low-high") {
      filtered.sort((a, b) => a.offerPrice - b.offerPrice);
    }

    if (sortPrice === "high-low") {
      filtered.sort((a, b) => b.offerPrice - a.offerPrice);
    }

    return filtered;
  }, [search, category, sortPrice, products]);

  const handleAdd = (e, item) => {
    e.preventDefault();
    addToCart(item);
  };

  return (
    <div className="min-h-screen bg-[#f6f7f1] px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-5 rounded-[8px] bg-[#172337] p-5 text-white">
          <p className="text-sm font-bold text-[#f7d851]">Grocify Supermart</p>
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
              Showing {filteredProducts.length} items
            </div>
          </div>
        </div>

        <div className="grid gap-5 lg:grid-cols-[250px_1fr]">
          <aside className="h-fit rounded-[8px] border border-slate-200 bg-white p-4 shadow-sm lg:sticky lg:top-24">
            <div className="mb-4 flex items-center gap-2 text-lg font-black">
              <FaSlidersH className="text-[#0c831f]" />
              Filters
            </div>

            <label className="text-xs font-black uppercase text-slate-500">
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
              className="mt-2 w-full rounded border border-slate-200 px-3 py-3 text-sm outline-none focus:border-[#0c831f]"
            />

            <label className="mt-5 block text-xs font-black uppercase text-slate-500">
              Categories
            </label>
            <div className="mt-2 grid gap-2">
              <button
                onClick={() => setCategory("All")}
                className={`rounded px-3 py-2 text-left text-sm font-bold ${
                  category === "All"
                    ? "bg-[#e9f6eb] text-[#0c831f]"
                    : "bg-slate-50 text-slate-700"
                }`}
              >
                All Categories
              </button>
              {categories.map((cat) => (
                <button
                  key={cat.path}
                  onClick={() => setCategory(cat.path)}
                  className={`rounded px-3 py-2 text-left text-sm font-bold ${
                    category === cat.path
                      ? "bg-[#e9f6eb] text-[#0c831f]"
                      : "bg-slate-50 text-slate-700"
                  }`}
                >
                  {cat.text}
                </button>
              ))}
            </div>

            <label className="mt-5 block text-xs font-black uppercase text-slate-500">
              Sort
            </label>
            <select
              value={sortPrice}
              onChange={(e) => setSortPrice(e.target.value)}
              className="mt-2 w-full rounded border border-slate-200 px-3 py-3 text-sm font-semibold outline-none focus:border-[#0c831f]"
            >
              <option value="">Recommended</option>
              <option value="low-high">Price: Low to High</option>
              <option value="high-low">Price: High to Low</option>
            </select>
          </aside>

          <main>
            <div className="mb-4 flex flex-wrap gap-2">
              {["10 min delivery", "Fresh stock", "Best price", "Pantry deals"].map(
                (tag) => (
                  <span
                    key={tag}
                    className="rounded bg-white px-3 py-2 text-xs font-black text-slate-700 shadow-sm"
                  >
                    {tag}
                  </span>
                )
              )}
            </div>

            <div className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-4">
              {filteredProducts.map((item) => {
                const discount = Math.max(
                  1,
                  Math.round(((item.price - item.offerPrice) / item.price) * 100)
                );

                return (
                  <Link
                    key={item._id}
                    to={`/products/${item._id}`}
                    className="group rounded-[8px] border border-slate-200 bg-white p-3 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
                  >
                    <div className="relative flex aspect-square items-center justify-center rounded-[8px] bg-[#f7f8f3]">
                      <span className="absolute left-2 top-2 rounded bg-[#0c831f] px-2 py-1 text-[11px] font-black text-white">
                        {discount}% OFF
                      </span>
                      <button
                        onClick={(e) => toggleWishlist(e, item._id)}
                        className="absolute right-2 top-2 z-20 flex h-8 w-8 items-center justify-center rounded-full bg-white shadow-sm"
                      >
                        {wishlistIds.includes(item._id) ? (
                          <FaHeart className="text-red-500" />
                        ) : (
                          <FaRegHeart className="text-slate-500" />
                        )}
                      </button>
                      <img
                        src={item.image?.[0]}
                        alt={item.name}
                        className="h-32 w-32 object-contain transition group-hover:scale-105"
                      />
                    </div>

                    <div className="pt-3">
                      <p className="text-xs font-bold text-slate-500">
                        {item.category}
                      </p>
                      <h3 className="mt-1 min-h-[40px] text-sm font-black leading-snug text-slate-900 line-clamp-2">
                        {item.name}
                      </h3>

                      {item.vendor && (
                        <div className="mt-2 flex items-center gap-1 text-xs text-slate-500">
                          <span>{item.vendor.shopName}</span>
                          {item.vendor.isVerified && (
                            <FaCheckCircle className="text-[#2874f0]" />
                          )}
                        </div>
                      )}

                      <p
                        className={`mt-2 text-xs font-bold ${
                          item.inStock ? "text-[#0c831f]" : "text-red-500"
                        }`}
                      >
                        {item.inStock ? "In stock" : "Out of stock"}
                      </p>

                      <div className="mt-3 flex items-end justify-between gap-2">
                        <div>
                          <p className="text-base font-black">
                            Rs. {item.offerPrice}
                          </p>
                          <p className="text-xs text-slate-400 line-through">
                            Rs. {item.price}
                          </p>
                        </div>

                        <button
                          className="rounded border border-[#0c831f] px-3 py-1.5 text-xs font-black text-[#0c831f] hover:bg-[#0c831f] hover:text-white"
                          onClick={(e) => handleAdd(e, item)}
                          disabled={!item.inStock}
                        >
                          ADD
                        </button>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>

            {filteredProducts.length === 0 && (
              <div className="rounded-[8px] bg-white py-20 text-center shadow-sm">
                <h2 className="text-2xl font-black text-slate-700">
                  No products found
                </h2>
                <p className="mt-2 text-slate-500">Try changing your filters.</p>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default Products;
