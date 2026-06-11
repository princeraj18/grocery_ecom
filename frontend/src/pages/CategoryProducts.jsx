import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { FaBoxes, FaArrowLeft, FaShoppingBag } from "react-icons/fa";
import axios from "axios";
import api from "../api/Axios";

const CategoryProducts = () => {
  const { category } = useParams();
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [productsRes, categoriesRes] = await Promise.all([
          api.get("/products"),
          api.get("/categories"),
        ]);

        setProducts(productsRes.data.products || []);
        setCategories(categoriesRes.data.categories || []);
      } catch (error) {
        console.error("FETCH ERROR:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Helper to safely get a category's path/text/id from various shapes
  const getCatKey = (cat) => {
    if (!cat) return "";
    if (typeof cat === "string") return cat;
    if (typeof cat === "object") return cat.path || cat.text || cat._id || "";
    return "";
  };

  const paramKey = category?.toString().toLowerCase();

  const currentCategory = categories.find((cat) => {
    const key = getCatKey(cat).toString().toLowerCase();
    const id = (cat._id || "").toString().toLowerCase();
    return key === paramKey || id === paramKey;
  });

  const filteredProducts = products.filter((product) => {
    const prodKey = getCatKey(product.category).toString().toLowerCase();
    const prodId = (product.category && typeof product.category === "object")
      ? (product.category._id || "").toString().toLowerCase()
      : (product.category || "").toString().toLowerCase();

    const currId = (currentCategory?._id || "").toString().toLowerCase();

    return (
      prodKey === paramKey ||
      prodId === paramKey ||
      (currId && prodId === currId)
    );
  });

  // =====================================
  // PREMIUM SHIMMER ANIMATION LAYER
  // =====================================
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50/50 dark:bg-slate-950 px-4 py-8 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="h-32 bg-white dark:bg-slate-900 rounded-2xl animate-pulse border border-gray-100 dark:border-slate-800" />
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-72 bg-white dark:bg-slate-900 rounded-2xl animate-pulse border border-gray-100 dark:border-slate-800" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8f9fa] dark:bg-slate-950 text-gray-900 dark:text-slate-100 px-4 py-8 sm:px-6 lg:px-8 transition-colors duration-300">
      <div className="mx-auto max-w-7xl space-y-8">

        {/* TOP INTERACTIVE HUB BREADCRUMB */}
        <div className="flex items-center justify-between">
          <button 
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-gray-400 hover:text-gray-900 dark:hover:text-white transition"
          >
            <FaArrowLeft className="text-[10px]" /> Return Back
          </button>
        </div>

        {/* MASTER HEADER CONTROL BOARD */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 md:p-8 shadow-xs border border-gray-100 dark:border-slate-800/80 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="space-y-2">
            <span className="text-[10px] font-black uppercase tracking-widest text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/30 px-2.5 py-1 rounded-md">
              Category Shelf
            </span>
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight capitalize">
              {currentCategory?.text || category}
            </h1>
            <p className="text-xs font-medium text-gray-400">
              Found <span className="text-gray-700 dark:text-slate-300 font-bold">{filteredProducts.length}</span> curated items matching parameters
            </p>
          </div>

          <button
            onClick={() => navigate("/products")}
            className="inline-flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-gray-100 text-white dark:text-slate-900 text-xs font-bold uppercase tracking-wider px-5 py-3 rounded-xl shadow-xs transition active:scale-[0.98]"
          >
            <FaBoxes />
            <span>View Full Catalog</span>
          </button>
        </div>

        {/* CORE PRODUCT CATALOG LAYOUT */}
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-5">
            {filteredProducts.map((item) => {
              const actualPrice = item.variants?.[0]?.price || 0;
              const offerPrice = item.variants?.[0]?.offerPrice || 0;
              const discount = actualPrice > 0 ? Math.round(((actualPrice - offerPrice) / actualPrice) * 100) : 0;

              return (
                <Link
                  key={item._id}
                  to={`/products/${item._id}`}
                  className="group bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800/60 rounded-2xl p-3.5 flex flex-col justify-between shadow-2xs hover:shadow-md hover:border-gray-200/80 dark:hover:border-slate-700/80 transition-all duration-300"
                >
                  <div>
                    {/* CONTAINER WRAPPER FOR IMAGES */}
                    <div className="relative aspect-square w-full bg-gray-50 dark:bg-slate-950 rounded-xl flex items-center justify-center p-4 overflow-hidden">
                      {discount > 0 && (
                        <span className="absolute left-2.5 top-2.5 z-10 bg-emerald-500 text-white text-[9px] font-black px-2 py-0.5 rounded-md tracking-wider uppercase shadow-xs">
                          {discount}% OFF
                        </span>
                      )}
                      
                      <img
                        src={item.image?.[0] || "https://via.placeholder.com/300"}
                        alt={item.name}
                        className="h-full w-full object-contain mix-blend-multiply dark:mix-blend-normal transition-transform duration-500 ease-out group-hover:scale-105"
                        loading="lazy"
                      />
                    </div>

                    {/* METADATA CONTENT COMPARTMENT */}
                    <div className="pt-4 space-y-1">
                      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block truncate">
                        {typeof item.category === "object"
                          ? item.category?.text || item.category?.path || "Assorted Items"
                          : item.category}
                      </span>
                      <h2 className="text-sm font-semibold text-gray-800 dark:text-slate-200 line-clamp-2 min-h-[40px] leading-tight group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                        {item.name}
                      </h2>
                    </div>
                  </div>

                  {/* FOOTER INTERACTIVE BAR */}
                  <div className="mt-4 pt-3 border-t border-gray-50 dark:border-slate-800/50 flex items-center justify-between gap-1">
                    <div className="flex flex-col">
                      <span className="text-base font-black text-gray-900 dark:text-white tracking-tight">
                        ₹{offerPrice}
                      </span>
                      {actualPrice > offerPrice && (
                        <span className="text-xs text-gray-400 line-through font-medium">
                          ₹{actualPrice}
                        </span>
                      )}
                    </div>

                    <span className="inline-flex items-center gap-1.5 bg-emerald-50 hover:bg-emerald-600 dark:bg-emerald-950/40 dark:hover:bg-emerald-500 text-emerald-700 dark:text-emerald-400 hover:text-white dark:hover:text-white border border-emerald-200/30 dark:border-emerald-800/30 px-3 py-1.5 rounded-xl text-[11px] font-bold uppercase tracking-wider transition-all duration-200 active:scale-95">
                      <FaShoppingBag className="text-[10px]" />
                      <span>Add</span>
                    </span>
                  </div>

                </Link>
              );
            })}
          </div>
        ) : (
          /* 🛠️ FIXED: Standard JS comment replaced with correct JSX curly bracket block wrapper */
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-100 dark:border-slate-800 py-20 text-center max-w-xl mx-auto space-y-5 px-6">
            <div className="w-16 h-16 bg-slate-50 dark:bg-slate-950 rounded-full flex items-center justify-center mx-auto border dark:border-slate-800">
              <FaBoxes className="text-gray-400 text-xl" />
            </div>
            <div className="space-y-1.5">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Shelf Context Vacant</h2>
              <p className="text-xs text-gray-400 max-w-sm mx-auto leading-relaxed">
                There are currently no products linked onto this collection's specific ID parameters. Check back later or browse alternative categories.
              </p>
            </div>
            <button 
              onClick={() => navigate("/products")}
              className="inline-flex text-xs font-bold uppercase tracking-wider bg-slate-900 hover:bg-slate-800 text-white dark:bg-white dark:text-slate-900 px-5 py-2.5 rounded-xl transition"
            >
              Explore Available Vault
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoryProducts;