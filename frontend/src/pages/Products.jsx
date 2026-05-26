import React, {
  useState,
  useMemo,
  useContext,
  useEffect,
} from "react";

import axios from "axios";

import { Link } from "react-router-dom";

import {
  FaHeart,
  FaRegHeart,
} from "react-icons/fa";

import { ShopContext } from "../context/ShopContext";

import {
  dummyProducts,
  categories,
} from "../assets/greencart_assets/assets";

const Products = () => {

  const { products } =
    useContext(ShopContext);

  const [search, setSearch] =
    useState("");

  const [category, setCategory] =
    useState("All");

  const [sortPrice, setSortPrice] =
    useState("");

  const [wishlistIds, setWishlistIds] =
    useState([]);

  // ======================================
  // USER
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
  useEffect(() => {

    const fetchWishlist =
      async () => {

        try {

          const { data } =
            await axios.get(
              `http://localhost:5000/api/wishlist/${userId}`
            );

          const ids =
            data.wishlist.map(
              (item) =>
                item.product?._id
            );

          setWishlistIds(ids);

        } catch (error) {

          console.log(
            "WISHLIST ERROR:",
            error
          );
        }
      };

    if (userId) {

      fetchWishlist();
    }

  }, [userId]);

  // ======================================
  // ADD / REMOVE WISHLIST
  // ======================================
  const toggleWishlist =
    async (
      e,
      productId
    ) => {

      e.preventDefault();

      try {

        // REMOVE
        if (
          wishlistIds.includes(
            productId
          )
        ) {

          await axios.delete(
            "http://localhost:5000/api/wishlist/remove",
            {
              data: {
                userId,
                productId,
              },
            }
          );

          setWishlistIds(
            wishlistIds.filter(
              (id) =>
                id !== productId
            )
          );

        } else {

          // ADD
          await axios.post(
            "http://localhost:5000/api/wishlist/add",
            {
              userId,
              productId,
            }
          );

          setWishlistIds([
            ...wishlistIds,
            productId,
          ]);
        }

      } catch (error) {

        console.log(
          "WISHLIST TOGGLE ERROR:",
          error
        );
      }
    };

  // ======================================
  // FILTER PRODUCTS
  // ======================================
  const filteredProducts =
    useMemo(() => {

      // MERGE PRODUCTS
      const allProducts = [
        ...dummyProducts,
        ...products,
      ];

      let filtered = [
        ...allProducts,
      ];

      // SEARCH
      if (search.trim()) {

        const regex =
          new RegExp(
            search,
            "i"
          );

        filtered =
          filtered.filter(
            (product) =>
              regex.test(
                product.name
              ) ||
              regex.test(
                product.category
              )
          );
      }

      // CATEGORY
      if (
        category !== "All"
      ) {

        filtered =
          filtered.filter(
            (product) =>
              product.category ===
              category
          );
      }

      // SORT
      if (
        sortPrice ===
        "low-high"
      ) {

        filtered.sort(
          (a, b) =>
            a.offerPrice -
            b.offerPrice
        );
      }

      if (
        sortPrice ===
        "high-low"
      ) {

        filtered.sort(
          (a, b) =>
            b.offerPrice -
            a.offerPrice
        );
      }

      return filtered;

    }, [
      search,
      category,
      sortPrice,
      products,
    ]);

  return (

    <div className="min-h-screen bg-gray-50 px-6 py-10">

      <div className="max-w-7xl mx-auto">

        {/* HEADING */}
        <h1 className="text-4xl font-bold mb-8">
          Fresh Groceries
        </h1>

        {/* FILTERS */}
        <div className="bg-white rounded-2xl shadow-md p-5 mb-8">

          <div className="grid md:grid-cols-3 gap-4">

            {/* SEARCH */}
            <input
              type="text"
              placeholder="Search groceries..."
              value={search}
              onChange={(e) =>
                setSearch(
                  e.target.value
                )
              }
              className="border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500"
            />

            {/* CATEGORY */}
            <select
              value={category}
              onChange={(e) =>
                setCategory(
                  e.target.value
                )
              }
              className="border rounded-lg px-4 py-3"
            >

              <option value="All">
                All Categories
              </option>

              {
                categories.map(
                  (
                    cat,
                    index
                  ) => (

                    <option
                      key={index}
                      value={
                        cat.path
                      }
                    >
                      {
                        cat.text
                      }
                    </option>
                  )
                )
              }

            </select>

            {/* SORT */}
            <select
              value={sortPrice}
              onChange={(e) =>
                setSortPrice(
                  e.target.value
                )
              }
              className="border rounded-lg px-4 py-3"
            >

              <option value="">
                Sort By Price
              </option>

              <option value="low-high">
                Low → High
              </option>

              <option value="high-low">
                High → Low
              </option>

            </select>

          </div>

        </div>

        {/* RESULT COUNT */}
        <div className="mb-6">

          <p className="text-gray-600">

            Showing{" "}

            <span className="font-semibold">

              {
                filteredProducts.length
              }

            </span>{" "}

            products

          </p>

        </div>

        {/* PRODUCTS */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">

          {
            filteredProducts.map(
              (item) => (

                <Link
                  key={item._id}
                  to={`/products/${item._id}`}
                  className="bg-white rounded-2xl shadow-md hover:shadow-2xl transition-all duration-300 overflow-hidden group border relative"
                >

                  {/* WISHLIST BUTTON */}
                  <button
                    onClick={(e) =>
                      toggleWishlist(
                        e,
                        item._id
                      )
                    }
                    className="absolute top-3 right-3 z-10 bg-white p-3 rounded-full shadow-md hover:scale-110 transition"
                  >

                    {
                      wishlistIds.includes(
                        item._id
                      ) ? (

                        <FaHeart className="text-red-500 text-xl" />

                      ) : (

                        <FaRegHeart className="text-gray-600 text-xl" />

                      )
                    }

                  </button>

                  {/* IMAGE */}
                  <div className="overflow-hidden">

                    <img
                      src={
                        item.image?.[0]
                      }
                      alt={
                        item.name
                      }
                      className="w-full h-64 object-cover group-hover:scale-105 transition duration-300"
                    />

                  </div>

                  {/* INFO */}
                  <div className="p-4">

                    <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">

                      {
                        item.category
                      }

                    </span>

                    <h3 className="font-semibold text-gray-800 mt-3 line-clamp-2">

                      {
                        item.name
                      }

                    </h3>

                    {/* PRICE */}
                    <div className="flex items-center gap-2 mt-3">

                      <p className="text-green-600 font-bold text-lg">

                        ₹
                        {
                          item.offerPrice
                        }

                      </p>

                      <p className="text-gray-400 line-through text-sm">

                        ₹
                        {
                          item.price
                        }

                      </p>

                    </div>

                    {/* STOCK */}
                    <p
                      className={`text-sm mt-2 ${
                        item.inStock
                          ? "text-green-600"
                          : "text-red-500"
                      }`}
                    >

                      {
                        item.inStock
                          ? "In Stock"
                          : "Out of Stock"
                      }

                    </p>

                    {/* BUTTON */}
                    <button className="w-full mt-4 bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg transition">

                      Add To Cart

                    </button>

                  </div>

                </Link>
              )
            )
          }

        </div>

        {/* NO PRODUCTS */}
        {
          filteredProducts.length ===
            0 && (

            <div className="text-center py-20">

              <h2 className="text-2xl font-semibold text-gray-700">
                No Products Found
              </h2>

              <p className="text-gray-500 mt-2">
                Try changing your filters.
              </p>

            </div>
          )
        }

      </div>

    </div>
  );
};

export default Products;