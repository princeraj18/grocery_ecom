import React, {
  useContext,
  useEffect,
  useState,
} from "react";

import axios from "axios";

import {
  useNavigate,
  useParams,
} from "react-router-dom";

import {
  FaHeart,
  FaRegHeart,
  FaCheckCircle,
} from "react-icons/fa";

import { ShopContext } from "../context/ShopContext";

import {
  dummyProducts,
} from "../assets/greencart_assets/assets";

import ProductReview from "../components/ProductReview";

const ProductDetails = () => {

  const { id } = useParams();

  const navigate = useNavigate();

  const { addToCart } =
    useContext(ShopContext);

  const [product, setProduct] =
    useState(null);

  const [dbProducts, setDbProducts] =
    useState([]);

  const [mainImage, setMainImage] =
    useState(0);

  const [isWishlisted, setIsWishlisted] =
    useState(false);

  // =========================================
  // USER
  // =========================================
  const user =
    JSON.parse(
      localStorage.getItem("user")
    );

  const userId =
    user?._id;

  // =========================================
  // FETCH PRODUCTS
  // =========================================
  useEffect(() => {

    const fetchProducts =
      async () => {

        try {

          const response =
            await axios.get(
              "http://localhost:5000/api/products"
            );

          const apiProducts =
            Array.isArray(
              response.data
            )
              ? response.data
              : response.data
                  .products || [];

          setDbProducts(
            apiProducts
          );

          const allProducts = [
            ...dummyProducts,
            ...apiProducts,
          ];

          const foundProduct =
            allProducts.find(
              (item) =>
                item._id === id
            );

          setProduct(
            foundProduct
          );

        } catch (error) {

          console.log(
            "API ERROR:",
            error
          );

          const foundProduct =
            dummyProducts.find(
              (item) =>
                item._id === id
            );

          setProduct(
            foundProduct
          );

          setDbProducts([]);
        }
      };

    fetchProducts();

  }, [id]);

  // =========================================
  // CHECK WISHLIST
  // =========================================
  useEffect(() => {

    const checkWishlist =
      async () => {

        try {

          if (
            !userId ||
            !product?._id
          )
            return;

          const { data } =
            await axios.get(
              `http://localhost:5000/api/wishlist/${userId}`
            );

          const exists =
            data.wishlist.some(
              (item) =>
                item.product?._id ===
                product._id
            );

          setIsWishlisted(
            exists
          );

        } catch (error) {

          console.log(
            "CHECK WISHLIST ERROR:",
            error
          );
        }
      };

    checkWishlist();

  }, [
    userId,
    product,
  ]);

  // =========================================
  // TOGGLE WISHLIST
  // =========================================
  const toggleWishlist =
    async (e) => {

      e.stopPropagation();

      try {

        if (!userId) {

          alert(
            "Please login first"
          );

          return;
        }

        // REMOVE FROM WISHLIST
        if (
          isWishlisted
        ) {

          await axios.delete(
            "http://localhost:5000/api/wishlist/remove",
            {
              data: {
                userId,
                productId:
                  product._id,
              },
            }
          );

          setIsWishlisted(
            false
          );

          alert(
            "Removed from wishlist"
          );

        } else {

          // ADD TO WISHLIST
          await axios.post(
            "http://localhost:5000/api/wishlist/add",
            {
              userId,
              productId:
                product._id,
            }
          );

          setIsWishlisted(
            true
          );

          alert(
            "Added to wishlist"
          );
        }

      } catch (error) {

        console.log(
          "WISHLIST ERROR:",
          error
        );

        alert(
          "Wishlist action failed"
        );
      }
    };

  // =========================================
  // LOADING
  // =========================================
  if (!product) {

    return (

      <div className="text-center py-20">

        <h1 className="text-3xl font-bold">
          Loading Product...
        </h1>

      </div>
    );
  }

  // =========================================
  // ALL PRODUCTS
  // =========================================
  const allProducts = [
    ...dummyProducts,
    ...(Array.isArray(
      dbProducts
    )
      ? dbProducts
      : []),
  ];

  // =========================================
  // RELATED PRODUCTS
  // =========================================
  const relatedProducts =
    allProducts
      .filter(
        (item) =>
          item.category ===
            product.category &&
          item._id !==
            product._id
      )
      .slice(0, 4);

  // =========================================
  // ADD TO CART
  // =========================================
  const handleAddToCart =
    () => {

      addToCart(product);

     
    };

  return (

    <div className="max-w-7xl mx-auto py-10 px-6">

      {/* ========================================= */}
      {/* PRODUCT SECTION */}
      {/* ========================================= */}
      <div className="grid md:grid-cols-2 gap-10">

        {/* PRODUCT IMAGES */}
        <div>

          <div className="relative">

            <img
              src={
                product.image?.[
                  mainImage
                ]
              }
              alt={
                product.name
              }
              className="w-full h-[500px] object-cover rounded-2xl border"
            />

            {/* WISHLIST BUTTON */}
            <button
              onClick={(e) =>
                toggleWishlist(e)
              }
              className="absolute top-5 right-5 bg-white p-4 rounded-full shadow-lg hover:scale-110 transition duration-300 z-50"
            >

              {isWishlisted ? (

                <FaHeart className="text-red-500 text-2xl cursor-pointer" />

              ) : (

                <FaRegHeart className="text-gray-600 hover:text-red-500 text-2xl cursor-pointer transition" />

              )}

            </button>

          </div>

          {/* THUMBNAILS */}
          <div className="flex gap-3 mt-4 flex-wrap">

            {product.image?.map(
              (
                img,
                index
              ) => (

                <img
                  key={index}
                  src={img}
                  alt=""
                  onClick={() =>
                    setMainImage(
                      index
                    )
                  }
                  className={`w-24 h-24 object-cover rounded-lg border cursor-pointer transition ${
                    mainImage ===
                    index
                      ? "border-green-600 border-2"
                      : ""
                  }`}
                />
              )
            )}

          </div>

        </div>

        {/* PRODUCT DETAILS */}
        <div>

          {/* CATEGORY */}
          <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm">

            {
              product.category
            }

          </span>

          {/* NAME */}
          <h1 className="text-4xl font-bold mt-4">

            {product.name}

          </h1>
          <div className="flex items-center gap-3 mt-3">
  <span className="text-gray-600">
    Sold by:
    <span className="font-semibold ml-1">
      {product.vendor?.shopName}
    </span>
  </span>

  {product.vendor?.isVerified ? (
    <span className="flex items-center gap-1 bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm">
      <FaCheckCircle />
      Verified Vendor
    </span>
  ) : (
    <span className="bg-red-100 text-red-600 px-3 py-1 rounded-full text-sm">
      Unverified Vendor
    </span>
  )}
</div>

          {/* PRICE */}
          <div className="flex items-center gap-4 mt-5">

            <p className="text-3xl font-bold text-green-600">

              ₹
              {
                product.offerPrice
              }

            </p>

            <p className="text-xl text-gray-400 line-through">

              ₹
              {
                product.price
              }

            </p>

          </div>

          {/* STOCK */}
          <p
            className={`mt-4 font-medium ${
              product.inStock
                ? "text-green-600"
                : "text-red-500"
            }`}
          >

            {product.inStock
              ? "In Stock"
              : "Out of Stock"}

          </p>

          {/* DESCRIPTION */}
          <div className="mt-6">

            <h3 className="font-semibold text-lg mb-3">

              Product Details

            </h3>

            <ul className="list-disc pl-5 text-gray-600 space-y-2">

              {product.description?.map(
                (
                  desc,
                  index
                ) => (

                  <li
                    key={index}
                  >
                    {desc}
                  </li>
                )
              )}

            </ul>

          </div>

          {/* BUTTONS */}
          <div className="flex gap-4 mt-10">

            <button
              onClick={
                handleAddToCart
              }
              className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-lg transition"
            >

              Add To Cart

            </button>

            <button
              onClick={() =>
                navigate(
                  "/products"
                )
              }
              className="border border-gray-400 px-8 py-3 rounded-lg hover:bg-gray-100 transition"
            >

              Continue Shopping

            </button>

          </div>

        </div>

      </div>

      {/* ========================================= */}
      {/* PRODUCT REVIEW SECTION */}
      {/* ========================================= */}
      <div className="mt-20">

        <ProductReview
          productId={
            product._id
          }
          userId={userId}
        />

      </div>

      {/* ========================================= */}
      {/* RELATED PRODUCTS */}
      {/* ========================================= */}
      <div className="mt-20">

        <h2 className="text-3xl font-bold mb-8">

          Related Products

        </h2>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">

          {relatedProducts.map(
            (item) => (

              <div
                key={
                  item._id
                }
                className="bg-white rounded-2xl shadow-md hover:shadow-xl transition overflow-hidden border"
              >

                <img
                  src={
                    item.image?.[0]
                  }
                  alt={item.name}
                  className="w-full h-52 object-cover"
                />

                <div className="p-4">

                  <h3 className="font-semibold text-lg line-clamp-2">

                    {item.name}

                  </h3>

                  <div className="flex items-center gap-2 mt-2">

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

                  <button
                    onClick={() =>
                      navigate(
                        `/products/${item._id}`
                      )
                    }
                    className="w-full mt-4 bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg transition"
                  >

                    View Product

                  </button>

                </div>

              </div>
            )
          )}

        </div>

      </div>

    </div>
  );
};

export default ProductDetails;