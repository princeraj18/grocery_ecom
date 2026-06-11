import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { FaEye } from "react-icons/fa";
import { ShopContext } from "../context/ShopContext";

const RelatedProducts = ({ category, productId }) => {
  const { products } = useContext(ShopContext);
  const navigate = useNavigate();

  const allProducts = products || [];

  const relatedProducts = allProducts
    .filter(
      (item) =>
        (item.category?._id === category || item.category === category) &&
        item._id !== productId
    )
    .slice(0, 4);

  if (relatedProducts.length === 0) {
    return null;
  }

  return (
    <div className="mt-20 space-y-8">
      
      {/* SECTION HEADER BLOCK */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-gray-100 dark:border-slate-800/80 pb-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
            Curated Alternatives
          </h2>
          <p className="text-xs text-gray-400 mt-0.5">
            Discover complementary variants selected specifically to match your criteria.
          </p>
        </div>
        <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 bg-slate-50 dark:bg-slate-900 px-2.5 py-1 rounded-md border border-gray-100 dark:border-slate-800/40">
          Handpicked Collection
        </span>
      </div>

      {/* PRODUCTS GRID MATRIX */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {relatedProducts.map((item) => {
          // 🛠️ FIX: Extract pricing variables from the first item variant configuration
          const baseVariant = item.variants?.[0] || {};
          const itemPrice = baseVariant.price || item.price || 0;
          const itemOfferPrice = baseVariant.offerPrice || item.offerPrice || 0;

          // Calculate discount percentage safely using the extracted variant values
          const discountPercent = itemPrice && itemOfferPrice
            ? Math.round(((itemPrice - itemOfferPrice) / itemPrice) * 100)
            : 0;

          return (
            <div
              key={item._id}
              className="group bg-white dark:bg-slate-900 rounded-2xl border border-gray-100 dark:border-slate-800/60 overflow-hidden flex flex-col shadow-2xs hover:shadow-md hover:border-gray-200/80 dark:hover:border-slate-700/80 transition-all duration-300"
            >
              
              {/* IMAGE WRAPPER CONTAINER */}
              <div 
                onClick={() => navigate(`/products/${item._id}`)}
                className="relative overflow-hidden aspect-square bg-gray-50 dark:bg-slate-950 cursor-pointer"
              >
                <img
                  src={item.image?.[0] || "https://via.placeholder.com/400x400"}
                  alt={item.name}
                  className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                  loading="lazy"
                />
                
                {/* FLOATING PERFORMANCE BADGE */}
                {discountPercent > 0 && (
                  <span className="absolute top-3 left-3 bg-emerald-500 text-white text-[10px] font-extrabold px-2 py-0.5 rounded-md shadow-xs tracking-wider uppercase">
                    -{discountPercent}%
                  </span>
                )}
              </div>

              {/* INFORMATION COMPARTMENT METADATA */}
              <div className="p-4 flex flex-col flex-grow justify-between space-y-4">
                <div className="space-y-1.5">
                  <h3 
                    onClick={() => navigate(`/products/${item._id}`)}
                    className="font-semibold text-sm text-gray-800 dark:text-slate-200 group-hover:text-emerald-600 transition-colors cursor-pointer line-clamp-2 min-h-[40px] leading-snug"
                  >
                    {item.name}
                  </h3>

                  {/* PRICING STRUCTURE */}
                  <div className="flex items-baseline gap-2 flex-wrap">
                    <p className="text-base font-extrabold text-emerald-600 dark:text-emerald-400 tracking-tight">
                      ₹{itemOfferPrice}
                    </p>
                    {itemPrice > itemOfferPrice && (
                      <p className="text-xs text-gray-400 line-through font-medium">
                        ₹{itemPrice}
                      </p>
                    )}
                  </div>
                </div>

                {/* TARGET CALL TO ACTION EXECUTOR */}
                <button
                  onClick={() => navigate(`/products/${item._id}`)}
                  className="w-full inline-flex items-center justify-center gap-2 bg-gray-50 hover:bg-slate-900 dark:bg-slate-800/50 dark:hover:bg-white text-gray-700 hover:text-white dark:text-slate-300 dark:hover:text-slate-900 py-2.5 rounded-xl text-xs font-bold transition-all shadow-2xs active:scale-[0.97]"
                >
                  <FaEye className="text-xs" />
                  <span>Inspect Variant</span>
                </button>
              </div>

            </div>
          );
        })}
      </div>
    </div>
  );
};

export default RelatedProducts;