import React, {
  useContext,
  useState,
} from "react";

import {
  useNavigate,
  useParams,
} from "react-router-dom";

import {
  dummyProducts,
} from "../assets/greencart_assets/assets";

import { ShopContext } from "../context/ShopContext";

const ProductDetails = () => {
  const { id } = useParams();

  const navigate = useNavigate();

  const { addToCart } =
    useContext(ShopContext);

  const [mainImage, setMainImage] =
    useState(0);

  // Find Product
  const product = dummyProducts.find(
    (item) => item._id === id
  );

  // Product Not Found
  if (!product) {
    return (
      <div className="text-center py-20">
        <h1 className="text-3xl font-bold">
          Product Not Found
        </h1>
      </div>
    );
  }

  // Add To Cart
  const handleAddToCart = () => {
    addToCart(product);

    alert("Product Added To Cart");
  };

  return (
    <div className="max-w-7xl mx-auto py-10 px-6">
      <div className="grid md:grid-cols-2 gap-10">
        {/* Product Images */}
        <div>
          <img
            src={product.image[mainImage]}
            alt={product.name}
            className="w-full h-[500px] object-cover rounded-2xl border"
          />

          {/* Thumbnail Images */}
          <div className="flex gap-3 mt-4">
            {product.image.map(
              (img, index) => (
                <img
                  key={index}
                  src={img}
                  alt=""
                  onClick={() =>
                    setMainImage(index)
                  }
                  className={`w-24 h-24 object-cover rounded-lg border cursor-pointer ${
                    mainImage === index
                      ? "border-green-600"
                      : ""
                  }`}
                />
              )
            )}
          </div>
        </div>

        {/* Product Details */}
        <div>
          {/* Category */}
          <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm">
            {product.category}
          </span>

          {/* Name */}
          <h1 className="text-4xl font-bold mt-4">
            {product.name}
          </h1>

          {/* Price */}
          <div className="flex items-center gap-4 mt-5">
            <p className="text-3xl font-bold text-green-600">
              ₹{product.offerPrice}
            </p>

            <p className="text-xl text-gray-400 line-through">
              ₹{product.price}
            </p>
          </div>

          {/* Stock */}
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

          {/* Description */}
          <div className="mt-6">
            <h3 className="font-semibold text-lg mb-3">
              Product Details
            </h3>

            <ul className="list-disc pl-5 text-gray-600 space-y-2">
              {product.description.map(
                (desc, index) => (
                  <li key={index}>
                    {desc}
                  </li>
                )
              )}
            </ul>
          </div>

          {/* Buttons */}
          <div className="flex gap-4 mt-10">
            <button
              onClick={handleAddToCart}
              className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-lg transition"
            >
              Add To Cart
            </button>

            <button
              onClick={() =>
                navigate("/products")
              }
              className="border border-gray-400 px-8 py-3 rounded-lg hover:bg-gray-100 transition"
            >
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;