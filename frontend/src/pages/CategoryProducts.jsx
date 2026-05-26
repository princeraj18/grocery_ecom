import React from "react";
import { useParams, Link, useNavigate } from "react-router-dom";

import { dummyProducts, categories } from "../assets/greencart_assets/assets";

const CategoryProducts = () => {
  const { category } = useParams();
  const navigate = useNavigate();

  const currentCategory = categories.find(
    (cat) => cat.path.toLowerCase() === category.toLowerCase()
  );

  const filteredProducts = dummyProducts.filter(
    (product) => product.category.toLowerCase() === category.toLowerCase()
  );

  return (
    <div className="min-h-screen bg-[#f6f7f1] px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-5 rounded-[8px] bg-white p-5 shadow-sm">
          <p className="text-sm font-bold text-[#0c831f]">Category shelf</p>
          <div className="mt-2 flex flex-wrap items-end justify-between gap-3">
            <div>
              <h1 className="text-3xl font-black sm:text-4xl">
                {currentCategory?.text || category}
              </h1>
              <p className="mt-2 text-sm font-medium text-slate-500">
                {filteredProducts.length} fresh picks available now
              </p>
            </div>
            <button
              onClick={() => navigate("/products")}
              className="rounded bg-[#0c831f] px-4 py-2 text-sm font-black text-white"
            >
              View all products
            </button>
          </div>
        </div>

        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-5">
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
                    <img
                      src={item.image[0]}
                      alt={item.name}
                      className="h-32 w-32 object-contain transition group-hover:scale-105"
                    />
                  </div>

                  <div className="pt-3">
                    <p className="text-xs font-bold text-slate-500">
                      {item.category}
                    </p>
                    <h2 className="mt-1 min-h-[40px] text-sm font-black leading-snug line-clamp-2">
                      {item.name}
                    </h2>
                    <div className="mt-3 flex items-end justify-between gap-2">
                      <div>
                        <p className="font-black">Rs. {item.offerPrice}</p>
                        <p className="text-xs text-slate-400 line-through">
                          Rs. {item.price}
                        </p>
                      </div>
                      <span className="rounded border border-[#0c831f] px-3 py-1 text-xs font-black text-[#0c831f]">
                        ADD
                      </span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        ) : (
          <div className="rounded-[8px] bg-white py-20 text-center shadow-sm">
            <h2 className="text-2xl font-black">No products found</h2>
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoryProducts;
