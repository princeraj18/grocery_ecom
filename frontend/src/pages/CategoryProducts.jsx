import React, {
  useState,
  useEffect,
} from "react";

import {
  useParams,
  Link,
  useNavigate,
} from "react-router-dom";

import axios from "axios";

const CategoryProducts = () => {
  const { category } = useParams();
  const navigate = useNavigate();

  const [products, setProducts] =
    useState([]);

  const [categories, setCategories] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [
          productsRes,
          categoriesRes,
        ] = await Promise.all([
          axios.get(
            "http://localhost:5000/api/products"
          ),
          axios.get(
            "http://localhost:5000/api/categories"
          ),
        ]);

        setProducts(
          productsRes.data.products || []
        );

        setCategories(
          categoriesRes.data.categories || []
        );
      } catch (error) {
        console.log(
          "FETCH ERROR:",
          error
        );
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
    // also allow matching by category _id
    const id = (cat._id || "").toString().toLowerCase();
    return key === paramKey || id === paramKey;
  });

  const filteredProducts = products.filter((product) => {
    const prodKey = getCatKey(product.category).toString().toLowerCase();
    const prodId = (product.category && typeof product.category === "object")
      ? (product.category._id || "").toString().toLowerCase()
      : (product.category || "").toString().toLowerCase();

    const currId = (currentCategory?._id || "").toString().toLowerCase();

    // match by product's category path/text/id OR by id matching the resolved current category
    return (
      prodKey === paramKey ||
      prodId === paramKey ||
      (currId && prodId === currId)
    );
  });

  if (loading) {
    return (
      <div className="text-center py-20">
        Loading Products...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f6f7f1] px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">

        {/* HEADER */}
        <div className="mb-5 rounded-lg bg-white p-5 shadow-sm">
          <p className="text-sm font-bold text-green-600">
            Category Shelf
          </p>

          <div className="mt-2 flex flex-wrap items-end justify-between gap-3">
            <div>
              <h1 className="text-3xl font-black sm:text-4xl">
                {currentCategory?.text ||
                  category}
              </h1>

              <p className="mt-2 text-sm text-gray-500">
                {
                  filteredProducts.length
                }{" "}
                products available
              </p>
            </div>

            <button
              onClick={() =>
                navigate("/products")
              }
              className="rounded bg-green-600 px-4 py-2 text-white"
            >
              View All Products
            </button>
          </div>
        </div>

        {/* PRODUCTS */}
        {filteredProducts.length >
        0 ? (
          <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-5">

            {filteredProducts.map(
              (item) => {
                const actualPrice =
  item.variants?.[0]?.price || 0;

const offerPrice =
  item.variants?.[0]?.offerPrice || 0;

const discount =
  actualPrice > 0
    ? Math.round(
        ((actualPrice - offerPrice) /
          actualPrice) *
          100
      )
    : 0;

                return (
                  <Link
                    key={item._id}
                    to={`/products/${item._id}`}
                    className="group rounded-lg border bg-white p-3 shadow-sm hover:shadow-md"
                  >
                    <div className="relative flex aspect-square items-center justify-center bg-gray-50 rounded-lg">

                      <span className="absolute left-2 top-2 rounded bg-green-600 px-2 py-1 text-[11px] font-bold text-white">
                        {discount}% OFF
                      </span>

                      <img
                        src={
                          item.image?.[0]
                        }
                        alt={item.name}
                        className="h-32 w-32 object-contain"
                      />
                    </div>

                    <div className="pt-3">

                      <p className="text-xs text-gray-500">
                        {typeof item.category === "object"
                          ? item.category?.text || item.category?.path || item.category?._id
                          : item.category}
                      </p>

                      <h2 className="mt-1 min-h-[40px] text-sm font-bold line-clamp-2">
                        {item.name}
                      </h2>

                      <div className="mt-3 flex items-end justify-between">
                        <div>
                          <p className="font-bold">
                            ₹
                           ₹{offerPrice}
                          </p>

                          <p className="text-xs text-gray-400 line-through">
                           ₹{actualPrice}
                          </p>
                        </div>

                        <span className="rounded border border-green-600 px-3 py-1 text-xs font-bold text-green-600">
                          ADD
                        </span>
                      </div>

                    </div>
                  </Link>
                );
              }
            )}

          </div>
        ) : (
          <div className="rounded-lg bg-white py-20 text-center shadow-sm">
            <h2 className="text-2xl font-bold">
              No products found
            </h2>
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoryProducts;