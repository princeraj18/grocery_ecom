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
import ProductReview from "../components/ProductReview";

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const {
    addToCart,
    fetchWishlist,
  } = useContext(ShopContext);

  const [product, setProduct] =
    useState(null);

  const [relatedProducts, setRelatedProducts] =
    useState([]);

  const [mainImage, setMainImage] =
    useState(0);

  const [selectedVariant, setSelectedVariant] =
    useState(null);

  const [isWishlisted, setIsWishlisted] =
    useState(false);

  const user =
    JSON.parse(
      localStorage.getItem("user")
    ) || null;

  const userId = user?._id;

  // =====================================
  // FETCH PRODUCT
  // =====================================
  useEffect(() => {
    const fetchProduct =
      async () => {
        try {
          const { data } =
            await axios.get(
              `http://localhost:5000/api/products/${id}`
            );

          const productData =
            data.product;

          setProduct(productData);

          if (
            productData.variants &&
            productData.variants.length > 0
          ) {
            setSelectedVariant(
              productData.variants[0]
            );
          }

          const allProductsRes =
            await axios.get(
              "http://localhost:5000/api/products"
            );

          const allProducts =
            allProductsRes.data.products ||
            [];

          const related =
            allProducts
              .filter(
                (item) =>
                  item._id !==
                    productData._id &&
                  item.category?._id ===
                    productData.category?._id
              )
              .slice(0, 4);

          setRelatedProducts(
            related
          );
        } catch (error) {
          console.log(
            "PRODUCT FETCH ERROR:",
            error
          );
        }
      };

    fetchProduct();
  }, [id]);

  // =====================================
  // CHECK WISHLIST
  // =====================================
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
            "Wishlist Error:",
            error
          );
        }
      };

    checkWishlist();
  }, [userId, product]);

  // =====================================
  // TOGGLE WISHLIST
  // =====================================
  const toggleWishlist =
    async () => {
      try {
        if (!userId) {
          alert(
            "Please login first"
          );
          return;
        }

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

          await fetchWishlist();

          alert(
            "Removed from wishlist"
          );
        } else {
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

          await fetchWishlist();

          alert(
            "Added to wishlist"
          );
        }
      } catch (error) {
        console.log(
          "Wishlist Error:",
          error
        );
      }
    };

  // =====================================
  // ADD TO CART
  // =====================================
  const handleAddToCart =
    () => {
      addToCart({
        ...product,
        offerPrice:
          selectedVariant?.offerPrice,
        price:
          selectedVariant?.price,
        selectedSize:
          selectedVariant?.size,
      });
    };

  if (!product) {
    return (
      <div className="text-center py-20">
        <h1 className="text-3xl font-bold">
          Loading Product...
        </h1>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto py-10 px-6">
      {/* PRODUCT SECTION */}
      <div className="grid md:grid-cols-2 gap-10">

        {/* IMAGES */}
        <div>
          <div className="relative">
            <img
              src={
                product.image?.[
                  mainImage
                ]
              }
              alt={product.name}
              className="w-full h-[500px] object-cover rounded-2xl border"
            />

            <button
              onClick={
                toggleWishlist
              }
              className="absolute top-5 right-5 bg-white p-4 rounded-full shadow-lg"
            >
              {isWishlisted ? (
                <FaHeart className="text-red-500 text-2xl" />
              ) : (
                <FaRegHeart className="text-gray-600 text-2xl" />
              )}
            </button>
          </div>

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
                  className={`w-24 h-24 object-cover rounded-lg border cursor-pointer ${
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

        {/* DETAILS */}
        <div>
          <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm">
            {product.category?.text}
          </span>

          <h1 className="text-4xl font-bold mt-4">
            {product.name}
          </h1>

          {/* VENDOR */}
          <div className="flex items-center gap-3 mt-3">
            <span className="text-gray-600">
              Sold by:
              <span className="font-semibold ml-1">
                {
                  product.vendor
                    ?.shopName
                }
              </span>
            </span>

            {product.vendor
              ?.isVerified ? (
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
                selectedVariant?.offerPrice
              }
            </p>

            <p className="text-xl text-gray-400 line-through">
              ₹
              {
                selectedVariant?.price
              }
            </p>
          </div>

          {/* SIZE SELECTOR */}
          <div className="mt-6">
            <h3 className="font-semibold mb-3">
              Available Sizes
            </h3>

            <div className="flex gap-3 flex-wrap">
              {product.variants?.map(
                (
                  variant,
                  index
                ) => (
                  <button
                    key={index}
                    onClick={() =>
                      setSelectedVariant(
                        variant
                      )
                    }
                    className={`px-4 py-2 border rounded-lg ${
                      selectedVariant?.size ===
                      variant.size
                        ? "bg-green-600 text-white border-green-600"
                        : ""
                    }`}
                  >
                    {variant.size}
                  </button>
                )
              )}
            </div>
          </div>

          {/* STOCK */}
          <p
            className={`mt-5 font-medium ${
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
              {Array.isArray(
                product.description
              ) ? (
                product.description.map(
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
                )
              ) : (
                <li>
                  {
                    product.description
                  }
                </li>
              )}
            </ul>
          </div>

          {/* BUTTONS */}
          <div className="flex gap-4 mt-10">
            <button
              onClick={
                handleAddToCart
              }
              className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-lg"
            >
              Add To Cart
            </button>

            <button
              onClick={() =>
                navigate(
                  "/products"
                )
              }
              className="border px-8 py-3 rounded-lg"
            >
              Continue Shopping
            </button>
          </div>
        </div>
      </div>

      {/* REVIEWS */}
      <div className="mt-20">
        <ProductReview
          productId={
            product._id
          }
          userId={userId}
        />
      </div>

      {/* RELATED PRODUCTS */}
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
                className="bg-white rounded-2xl shadow-md border overflow-hidden"
              >
                <img
                  src={
                    item.image?.[0]
                  }
                  alt={
                    item.name
                  }
                  className="w-full h-52 object-cover"
                />

                <div className="p-4">
                  <h3 className="font-semibold">
                    {item.name}
                  </h3>

                  <p className="text-green-600 font-bold mt-2">
                    ₹
                    {
                      item
                        .variants?.[0]
                        ?.offerPrice
                    }
                  </p>

                  <button
                    onClick={() =>
                      navigate(
                        `/products/${item._id}`
                      )
                    }
                    className="w-full mt-4 bg-green-600 text-white py-2 rounded-lg"
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