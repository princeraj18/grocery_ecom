import React, {
  useContext,
  useEffect,
  useState,
} from "react";

import api from "../api/Axios";

import {
  useNavigate,
} from "react-router-dom";

import {
  ShopContext,
} from "../context/ShopContext";

const WishList = () => {

  const navigate =
    useNavigate();

  const {
    fetchWishlist:
      refreshNavbarWishlist,
    removeFromWishlist,
  } = useContext(ShopContext);

  const [wishlist, setWishlist] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  // ======================================
  // GET USER
  // ======================================
  const user =
    JSON.parse(
      localStorage.getItem("user")
    );

  const userId =
    user?._id;

  // ======================================
  // NORMALIZE WISHLIST
  // ======================================
  const normalizeWishlist =
    (wishlistData) => {

      if (
        Array.isArray(
          wishlistData?.items
        )
      ) {
        return wishlistData.items;
      }

      if (
        Array.isArray(
          wishlistData
        )
      ) {
        return wishlistData;
      }

      return [];
    };

  // ======================================
  // FETCH WISHLIST
  // ======================================
  const fetchWishlist =
    async () => {

      try {

        const { data } =
          await api.get(
            `/wishlist/${userId}`
          );

        setWishlist(
          normalizeWishlist(
            data.wishlist
          )
        );

      } catch (error) {

        console.log(
          "WISHLIST ERROR:",
          error
        );

      } finally {

        setLoading(false);
      }
    };

  // ======================================
  // REMOVE ITEM
  // ======================================
  const removeItem =
    async (productId) => {

      try {

        await removeFromWishlist(
          productId
        );

        setWishlist(
          (prev) =>
            prev.filter(
              (item) =>
                item.product?._id !==
                productId
            )
        );

        await refreshNavbarWishlist();

      } catch (error) {

        console.log(
          "REMOVE ERROR:",
          error
        );
      }
    };

  // ======================================
  // LOAD
  // ======================================
  useEffect(() => {

    if (userId) {

      fetchWishlist();

    } else {

      setLoading(false);
    }

  }, [userId]);

  // ======================================
  // LOADING
  // ======================================
  if (loading) {

    return (

      <div className="flex justify-center items-center min-h-screen">

        <h2 className="text-2xl font-bold">
          Loading Wishlist...
        </h2>

      </div>
    );
  }

  return (

    <div className="bg-gray-100 min-h-screen">

      <div className="max-w-7xl mx-auto p-6">

        {/* HEADER */}
        <div className="mb-8">

          <h1 className="text-3xl font-bold">
            My Wishlist
          </h1>

          <p className="text-gray-500 mt-2">
            Products you saved
          </p>

        </div>

        {/* EMPTY */}
        {
          wishlist.length === 0 ? (

            <div className="bg-white rounded-2xl shadow p-10 text-center">

              <h2 className="text-2xl font-bold mb-3">
                Wishlist Empty
              </h2>

              <p className="text-gray-500 mb-6">
                You have not added any products yet.
              </p>

              <button
                onClick={() =>
                  navigate("/products")
                }
                className="bg-black text-white px-6 py-3 rounded-xl"
              >
                Browse Products
              </button>

            </div>

          ) : (

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">

              {
                wishlist.map(
                  (item) => {

                    const product =
                      item.product;

                    if (!product) {
                      return null;
                    }

                    // ======================================
                    // SAFE VARIANTS
                    // ======================================
                    const variants =
                      Array.isArray(
                        product?.variants
                      )
                        ? product.variants
                        : [];

                    // ======================================
                    // FIRST VARIANT
                    // ======================================
                    const firstVariant =
                      variants[0] || {};

                    // ======================================
                    // TOTAL STOCK (fallback to product.stockQuantity)
                    // ======================================
                    const totalStock =
                      variants.length > 0
                        ? variants.reduce(
                            (total, variant) =>
                              total +
                              Number(
                                variant.stockQuantity ||
                                  variant.stock ||
                                  0
                              ),
                            0
                          )
                        : Number(
                            product?.stockQuantity ||
                              product?.stock ||
                              0
                          );

                    return (

                      <div
                        key={item._id}
                        className="bg-white rounded-2xl shadow-sm hover:shadow-lg transition overflow-hidden border"
                      >

                        {/* IMAGE */}
                        <div className="relative">

                          <img
                            src={
                              Array.isArray(
                                product?.image
                              )
                                ? product.image[0]
                                : product?.image
                            }
                            alt={product?.name}
                            className="w-full h-40 object-cover"
                          />

                          <span
                            className={`absolute top-2 right-2 text-xs px-2 py-1 rounded-full font-medium ${
                              totalStock > 0
                                ? "bg-green-100 text-green-700"
                                : "bg-red-100 text-red-600"
                            }`}
                          >
                            {
                              totalStock > 0
                                ? "In Stock"
                                : "Out of Stock"
                            }
                          </span>

                        </div>

                        {/* CONTENT */}
                        <div className="p-3">

                          {/* CATEGORY */}
                          <p className="text-xs text-gray-500 mb-1">

                            {
                              product?.category
                                ?.text ||
                              product?.category
                            }

                          </p>

                          {/* NAME */}
                          <h2 className="font-semibold text-sm text-gray-800 line-clamp-2 min-h-[40px]">

                            {product?.name}

                          </h2>

                          {/* PRICE */}
                          <div className="flex items-center gap-2 mt-2">

                            <span className="text-lg font-bold text-green-600">

                              Rs.
                              {
                                firstVariant?.offerPrice ??
                                firstVariant?.price ??
                                0
                              }

                            </span>

                            {
                              firstVariant?.price && (
                                <span className="text-xs text-gray-400 line-through">

                                  Rs.
                                  {
                                    firstVariant?.price
                                  }

                                </span>
                              )
                            }

                          </div>

                          {/* STOCK */}
                          <p className="text-xs text-gray-500 mt-1">

                            Stock:

                            <span className="font-semibold ml-1">

                              {totalStock}

                            </span>

                          </p>

                          {/* SIZES */}
                          <div className="flex flex-wrap gap-1 mt-2">

                            {
                              variants.length > 0 ? (

                                variants.map(
                                  (
                                    variant,
                                    index
                                  ) => (

                                    <span
                                      key={index}
                                      className="bg-gray-100 text-xs px-2 py-1 rounded-full"
                                    >
                                      {
                                        variant.size ||
                                        "N/A"
                                      }
                                    </span>

                                  )
                                )

                              ) : (

                                <span className="text-xs text-gray-400">
                                  No variants
                                </span>
                              )
                            }

                          </div>

                          {/* BUTTONS */}
                          <div className="flex gap-2 mt-3">

                            <button
                              onClick={() =>
                                navigate(
                                  `/products/${product?._id}`
                                )
                              }
                              className="flex-1 bg-black text-white text-xs py-2 rounded-lg hover:bg-gray-800"
                            >
                              View
                            </button>

                            <button
                              onClick={() =>
                                removeItem(
                                  product?._id
                                )
                              }
                              className="flex-1 bg-red-500 text-white text-xs py-2 rounded-lg hover:bg-red-600"
                            >
                              Remove
                            </button>

                          </div>

                        </div>

                      </div>
                    );
                  }
                )
              }

            </div>
          )
        }

      </div>

    </div>
  );
};

export default WishList;