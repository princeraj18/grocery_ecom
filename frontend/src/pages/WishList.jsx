import React, {
  useEffect,
  useState,
} from "react";

import axios from "axios";

import {
  useNavigate,
} from "react-router-dom";

import Navbar from "../components/Navbar";

// import Sidebar from "../components/Sidebar";

const WishList = () => {

  const navigate =
    useNavigate();

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

        {/* <Sidebar /> */}

        <div className="flex-1">

          <Navbar />

          <div className="p-10 text-2xl font-bold">
            Loading Wishlist...
          </div>

        </div>

      </div>
    );
  }

  return (

    <div className="flex bg-gray-100 min-h-screen">

      {/* SIDEBAR */}
      {/* <Sidebar /> */}

      {/* MAIN */}
      <div className="flex-1">

        {/* <Navbar /> */}

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

              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">

                {
                  wishlist.map(
                    (item) => {

                      const product =
                        item.product;

                      return (

                        <div
                          key={item._id}
                          className="bg-white rounded-3xl shadow-md overflow-hidden hover:shadow-xl transition"
                        >

                          {/* IMAGE */}
                          <img
                            src={
                              Array.isArray(
                                product?.image
                              )
                                ? product
                                    ?.image[0]
                                : product?.image
                            }
                            alt={
                              product?.name
                            }
                            className="w-full h-64 object-cover"
                          />

                          {/* CONTENT */}
                          <div className="p-5">

                            <div className="flex items-center justify-between mb-3">

                              <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm">

                                {
                                  product?.category
                                }

                              </span>

                              <span
                                className={`text-sm font-semibold ${
                                  product?.inStock
                                    ? "text-green-600"
                                    : "text-red-500"
                                }`}
                              >

                                {
                                  product?.inStock
                                    ? "In Stock"
                                    : "Out Of Stock"
                                }

                              </span>

                            </div>

                            <h2 className="text-xl font-bold text-gray-800 line-clamp-2">

                              {
                                product?.name
                              }

                            </h2>

                            {/* PRICE */}
                            <div className="flex items-center gap-3 mt-4">

                              <p className="text-2xl font-bold text-green-600">

                                ₹
                                {
                                  product?.offerPrice
                                }

                              </p>

                              <p className="line-through text-gray-400">

                                ₹
                                {
                                  product?.price
                                }

                              </p>

                            </div>

                            {/* BUTTONS */}
                            <div className="flex gap-3 mt-6">

                              <button
                                onClick={() =>
                                  navigate(
                                    `/products/${product?._id}`
                                  )
                                }
                                className="flex-1 bg-black text-white py-3 rounded-xl hover:bg-gray-800 transition"
                              >
                                View Product
                              </button>

                              <button
                                onClick={() =>
                                  removeItem(
                                    product?._id
                                  )
                                }
                                className="flex-1 bg-red-500 text-white py-3 rounded-xl hover:bg-red-600 transition"
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