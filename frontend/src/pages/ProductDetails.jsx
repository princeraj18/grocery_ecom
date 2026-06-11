import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { 
  FaHeart, 
  FaRegHeart, 
  FaCheckCircle, 
  FaExclamationTriangle, 
  FaShoppingBag, 
  FaArrowLeft,
  FaSpinner
} from "react-icons/fa";

import { ShopContext } from "../context/ShopContext";
import ProductReview from "../components/ProductReview";
import RelatedProducts from "../components/RelatedProducts";
import api from "../api/Axios";

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { addToCart, fetchWishlist } = useContext(ShopContext);

  const [product, setProduct] = useState(null);
  const [mainImage, setMainImage] = useState(0);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);

  const user = JSON.parse(localStorage.getItem("user")) || null;
  const userId = user?._id;

  // =====================================
  // FETCH PRODUCT DATA
  // =====================================
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setPageLoading(true);
        const { data } = await api.get(`/products/${id}`);
        const productData = data.product;

        setProduct(productData);
        setMainImage(0); // Reset image index on page change

        if (productData.variants && productData.variants.length > 0) {
          setSelectedVariant(productData.variants[0]);
        }
      } catch (error) {
        console.error("PRODUCT FETCH ERROR:", error);
      } finally {
        setPageLoading(false);
      }
    };

    if (id) fetchProduct();
  }, [id]);

  // =====================================
  // WISHLIST SYNC LIFECYCLE
  // =====================================
  useEffect(() => {
    const checkWishlist = async () => {
      if (!userId || !product?._id) return;
      try {
        const { data } = await api.get(`/wishlist/${userId}`);
        const exists = data.wishlist.some((item) => item.product?._id === product._id);
        setIsWishlisted(exists);
      } catch (error) {
        console.error("Wishlist sync error:", error);
      }
    };

    checkWishlist();
  }, [userId, product]);

  // =====================================
  // TOGGLE WISHLIST ACTION
  // =====================================
  const toggleWishlist = async () => {
    if (!userId) {
      alert("Please login first");
      return;
    }

    try {
      if (isWishlisted) {
        await api.delete("/wishlist/remove", {
          data: { userId, productId: product._id },
        });
        setIsWishlisted(false);
        alert("Removed from wishlist");
      } else {
        await api.post("/wishlist/add", {
          userId,
          productId: product._id,
        });
        setIsWishlisted(true);
        alert("Added to wishlist");
      }
      if (fetchWishlist) await fetchWishlist();
    } catch (error) {
      console.error("Wishlist modifier mutation error:", error);
    }
  };

  // =====================================
  // CART ADDITION INTERCEPTOR
  // =====================================
  const handleAddToCart = () => {
    if (!selectedVariant || selectedVariant.stockQuantity <= 0) {
      alert("Product option variant is out of stock");
      return;
    }

    addToCart({
      ...product,
      selectedVariant: {
        _id: selectedVariant?._id,
        size: selectedVariant?.size,
        price: selectedVariant?.price,
        offerPrice: selectedVariant?.offerPrice,
        stockQuantity: selectedVariant?.stockQuantity,
      },
    });

    alert("Product added to cart context successfully");
  };

  // =====================================
  // LOADING / ERROR GLOBAL WRAPPERS
  // =====================================
  if (pageLoading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4 text-gray-500">
        <FaSpinner className="animate-spin text-3xl text-emerald-600" />
        <p className="text-sm font-medium tracking-wide uppercase text-gray-400">Syncing Catalog Matrix...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-md mx-auto my-20 text-center p-8 border border-dashed rounded-2xl space-y-4">
        <FaExclamationTriangle className="text-amber-500 text-3xl mx-auto" />
        <h2 className="text-lg font-bold text-gray-900 dark:text-white">Product Matrix Unavailable</h2>
        <p className="text-xs text-gray-400">The parameters provided do not map onto an active item entry inside our cloud databases.</p>
        <button onClick={() => navigate("/products")} className="inline-flex text-xs font-bold uppercase bg-slate-900 text-white px-5 py-2.5 rounded-xl">
          Return to Catalog
        </button>
      </div>
    );
  }

  // Calculate percentage discount based on selected option dynamically
  const variableDiscount = selectedVariant?.price && selectedVariant?.offerPrice
    ? Math.round(((selectedVariant.price - selectedVariant.offerPrice) / selectedVariant.price) * 100)
    : 0;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-16">
      
      {/* SECTION BREADCRUMB COMPARTMENT */}
      <button 
        onClick={() => navigate(-1)}
        className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-gray-400 hover:text-gray-900 dark:hover:text-white transition"
      >
        <FaArrowLeft /> Back to Catalog
      </button>

      {/* CORE PRESENTATION LAYER SPLIT GRID */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12 items-start">
        
        {/* LEFT COLUMN: MULTI-IMAGE VIEWER INTERACTIVE HUB */}
        <div className="md:col-span-6 space-y-4 md:sticky md:top-6">
          <div className="relative aspect-square sm:aspect-4/3 md:aspect-square bg-gray-50 dark:bg-slate-950 border border-gray-100 dark:border-slate-800 rounded-2xl overflow-hidden group">
            <img
              src={product.image?.[mainImage] || "https://via.placeholder.com/600"}
              alt={product.name}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-102"
            />

            {/* FLOATING ACTION UTILITY: WISHLIST TOGGLE */}
            <button
              onClick={toggleWishlist}
              className="absolute top-4 right-4 bg-white/90 dark:bg-slate-900/90 hover:bg-white dark:hover:bg-slate-900 p-3.5 rounded-full shadow-md transition-all active:scale-90 text-xl backdrop-blur-xs"
            >
              {isWishlisted ? (
                <FaHeart className="text-red-500 drop-shadow-2xs" />
              ) : (
                <FaRegHeart className="text-gray-600 dark:text-slate-400" />
              )}
            </button>
            
            {variableDiscount > 0 && (
              <span className="absolute bottom-4 left-4 bg-emerald-600 text-white text-[10px] font-black px-3 py-1 rounded-md uppercase tracking-wider shadow-sm">
                Save {variableDiscount}% Instantly
              </span>
            )}
          </div>

          {/* FILMSTRIP THUMBNAIL TRACK */}
          <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-thin">
            {product.image?.map((img, index) => (
              <button
                key={index}
                onClick={() => setMainImage(index)}
                className={`w-20 sm:w-24 h-20 sm:h-24 rounded-xl overflow-hidden border-2 bg-gray-50 dark:bg-slate-950 shrink-0 transition ${
                  mainImage === index 
                    ? "border-emerald-600 ring-4 ring-emerald-500/10" 
                    : "border-gray-100 dark:border-slate-800/80 hover:border-gray-300 dark:hover:border-slate-700"
                }`}
              >
                <img src={img} alt="" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>

        {/* RIGHT COLUMN: CORE COMMERCE SPECIFICATION SYSTEM */}
        <div className="md:col-span-6 space-y-6 lg:py-2">
          
          {/* TAGSSTACK & TITLE MATRICES */}
          <div className="space-y-3">
            <span className="inline-flex text-[10px] font-extrabold uppercase tracking-widest bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 px-3 py-1 rounded-md border border-emerald-200/30">
              {product.category?.text || "General Utility"}
            </span>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight leading-tight">
              {product.name}
            </h1>
          </div>

          {/* MERCHANT VALIDATION ECOSYSTEM */}
          <div className="flex items-center gap-3 flex-wrap border-y border-gray-100 dark:border-slate-800/80 py-3.5">
            <span className="text-xs text-gray-400 font-medium">
              Merchant: <span className="font-bold text-gray-700 dark:text-slate-300 ml-0.5">{product.vendor?.shopName || "Global Fulfillment Hub"}</span>
            </span>
            {product.vendor?.isVerified ? (
              <span className="inline-flex items-center gap-1 bg-blue-50 dark:bg-blue-950/30 text-blue-700 dark:text-blue-400 px-2.5 py-0.5 rounded-md text-[10px] font-bold uppercase border border-blue-200/20">
                <FaCheckCircle className="text-[11px]" /> Verified Storefront
              </span>
            ) : (
              <span className="bg-red-50 dark:bg-red-950/30 text-red-600 dark:text-red-400 px-2.5 py-0.5 rounded-md text-[10px] font-bold uppercase">
                Standard Vendor
              </span>
            )}
          </div>

          {/* PRICING DYNAMICS CONTEXT CARD */}
          <div className="bg-slate-50 dark:bg-slate-900/40 p-4 rounded-2xl border border-gray-100 dark:border-slate-800/50 flex items-baseline gap-3.5">
            <p className="text-3xl font-black text-emerald-600 dark:text-emerald-400 tracking-tight">
              ₹{selectedVariant?.offerPrice}
            </p>
            {selectedVariant?.price > selectedVariant?.offerPrice && (
              <p className="text-sm font-medium text-gray-400 line-through">
                MSRP: ₹{selectedVariant?.price}
              </p>
            )}
          </div>

          {/* OPTION CONFIGURATOR PILLS MATRICES */}
          <div className="space-y-3">
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-400">
              Select Execution Size / Variant
            </label>
            <div className="flex gap-2.5 flex-wrap">
              {product.variants?.map((variant, index) => {
                const isActive = selectedVariant?.size === variant.size;
                return (
                  <button
                    key={index}
                    onClick={() => setSelectedVariant(variant)}
                    className={`px-4 py-2.5 text-xs font-bold tracking-wide border rounded-xl transition shadow-2xs active:scale-[0.98] ${
                      isActive
                        ? "bg-emerald-600 border-emerald-600 text-white shadow-md shadow-emerald-600/10"
                        : "bg-white dark:bg-slate-900 border-gray-200 dark:border-slate-800 text-gray-700 dark:text-slate-300 hover:border-gray-300 dark:hover:border-slate-700"
                    }`}
                  >
                    {variant.size}
                  </button>
                );
              })}
            </div>
          </div>

          {/* LIVE STOCK PARAMETERS CRADLE */}
          <div className="text-xs font-medium">
            {selectedVariant?.stockQuantity > 0 ? (
              <div className="inline-flex items-center gap-2 text-emerald-600 bg-emerald-50/60 dark:bg-emerald-950/20 px-3 py-1.5 rounded-lg border border-emerald-500/10">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span>Allocation Stable: <strong>{selectedVariant.stockQuantity}</strong> items unreserved</span>
              </div>
            ) : (
              <div className="inline-flex items-center gap-2 text-red-500 bg-red-50/60 dark:bg-red-950/20 px-3 py-1.5 rounded-lg border border-red-500/10">
                <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
                <span>Replenishment Pending: Zero units remaining</span>
              </div>
            )}
          </div>

          {/* ITEM STRUCTURAL DATA EXTRACTS */}
          <div className="space-y-3 pt-2">
            <h3 className="text-sm font-bold uppercase tracking-wider text-gray-400">
              Structural Specifications
            </h3>
            <div className="prose prose-sm dark:prose-invert text-gray-600 dark:text-slate-400 max-w-none">
              <ul className="list-disc pl-4 space-y-1.5 text-sm leading-relaxed">
                {Array.isArray(product.description) ? (
                  product.description.map((desc, index) => <li key={index}>{desc}</li>)
                ) : (
                  <li>{product.description}</li>
                )}
              </ul>
            </div>
          </div>

          {/* PRIMARY TRANSACTION TRIGGER MODULE */}
          <div className="flex flex-col sm:flex-row gap-4 pt-4 border-t border-gray-100 dark:border-slate-800/80">
            <button
              onClick={handleAddToCart}
              disabled={!selectedVariant || selectedVariant?.stockQuantity <= 0}
              className={`flex-grow inline-flex items-center justify-center gap-2.5 px-8 py-3.5 rounded-xl font-bold uppercase text-xs tracking-widest shadow-sm transition active:scale-[0.99] disabled:opacity-40 disabled:cursor-not-allowed ${
                selectedVariant?.stockQuantity > 0
                  ? "bg-slate-900 hover:bg-slate-800 text-white dark:bg-white dark:text-slate-900 dark:hover:bg-gray-100"
                  : "bg-gray-200 dark:bg-slate-800 text-gray-400 cursor-not-allowed"
              }`}
            >
              <FaShoppingBag className="text-xs" />
              {selectedVariant?.stockQuantity > 0 ? "Commit to Cart" : "Out of Stock"}
            </button>

            <button
              onClick={() => navigate("/products")}
              className="px-6 py-3.5 bg-transparent hover:bg-gray-50 dark:hover:bg-slate-900 border border-gray-200 dark:border-slate-800 text-gray-600 dark:text-slate-300 font-bold uppercase text-xs tracking-widest rounded-xl transition"
            >
              Keep Browsing
            </button>
          </div>

        </div>
      </div>

      {/* FEEDBACK & ANALYTICAL REVIEW SUB-SYSTEM */}
      <div className="border-t border-gray-100 dark:border-slate-800/80 pt-16">
        <ProductReview productId={product._id} />
      </div>

      {/* COMPLEMENTARY CURATED RELATED MATRIX */}
      <RelatedProducts category={product.category?._id || product.category} productId={product._id} />

    </div>
  );
};

export default ProductDetails;