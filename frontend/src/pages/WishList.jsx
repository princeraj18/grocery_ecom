import React, {
  useContext,
  useEffect,
  useState,
} from "react";

import axios from "axios";

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
  // FETCH WISHLIST
  // ======================================
  const fetchWishlist =
    async () => {

      try {

        const { data } =
          await axios.get(
            `http://localhost:5000/api/wishlist/${userId}`
          );

        setWishlist(
          data.wishlist || []
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

        await axios.delete(
          "http://localhost:5000/api/wishlist/remove",
          {
            data: {
              userId,
              productId,
            },
          }
        );

        fetchWishlist();

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
    }

  }, [userId]);

  // ======================================
  // LOADING
  // ======================================
  if (loading) {

    return (

      <div className="flex">

        <div className="flex-1">

          <div className="p-10 text-2xl font-bold">
            Loading Wishlist...
          </div>

        </div>

      </div>
    );
  }

  return (

    <div className="flex bg-gray-100 min-h-screen">

      {/* MAIN */}
      <div className="flex-1">

        <div className="p-6">

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

                      // ======================================
                      // GET FIRST VARIANT
                      // ======================================
                      const firstVariant =
                        product?.variants?.[0];

                      // ======================================
                      // TOTAL STOCK
                      // ======================================
                      const totalStock =
                        product?.variants?.reduce(
                          (
                            total,
                            variant
                          ) =>
                            total +
                            Number(
                              variant.stockQuantity || 0
                            ),
                          0
                        ) || 0;

                      return (

                        <div
                          key={item._id}
                          className="bg-white rounded-2xl shadow-sm hover:shadow-lg transition overflow-hidden border"
                        >

                          {/* IMAGE */}
                          <div className="relative">

                            <img
                              src={
                                Array.isArray(product?.image)
                                  ? product?.image[0]
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
                              {totalStock > 0
                                ? "In Stock"
                                : "Out of Stock"}
                            </span>

                          </div>

                          {/* CONTENT */}
                          <div className="p-3">

                            

                            {/* NAME */}
                            <h2 className="font-semibold text-sm text-gray-800 line-clamp-2 min-h-[40px]">

                              {product?.name}

                            </h2>

                            {/* PRICE */}
                            <div className="flex items-center gap-2 mt-2">

                              <span className="text-lg font-bold text-green-600">

                                ₹
                                {
                                  firstVariant?.offerPrice || 0
                                }

                              </span>

                              <span className="text-xs text-gray-400 line-through">

                                ₹
                                {
                                  firstVariant?.price || 0
                                }

                              </span>

                            </div>

                            {/* STOCK */}
                            <p className="text-xs text-gray-500 mt-1">

                              Stock:
                              <span className="font-semibold ml-1">
                                {totalStock}
                              </span>

                            </p>

                            {/* SIZE */}
                            <div className="flex flex-wrap gap-1 mt-2">

                              {product?.variants?.map(
                                (
                                  variant,
                                  index
                                ) => (

                                  <span
                                    key={index}
                                    className="bg-gray-100 text-xs px-2 py-1 rounded-full"
                                  >
                                    {variant.size}
                                  </span>

                                )
                              )}

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

    </div>
  );
};

export default WishList;