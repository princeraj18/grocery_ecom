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

import { ShopContext } from "../context/ShopContext";

import {
  dummyProducts,
} from "../assets/greencart_assets/assets";

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

  // =========================
  // FETCH PRODUCTS
  // =========================
  useEffect(() => {

    const fetchProducts = async () => {

      try {

        const response = await axios.get(
          "http://localhost:5000/api/products"
        );

        console.log("API RESPONSE:", response.data);

        // IMPORTANT FIX
        // GET PRODUCTS ARRAY SAFELY
        const apiProducts =
          Array.isArray(response.data)
            ? response.data
            : response.data.products || [];

        // STORE DATABASE PRODUCTS
        setDbProducts(apiProducts);

        // MERGE ALL PRODUCTS
        const allProducts = [
          ...dummyProducts,
          ...apiProducts,
        ];

        // FIND PRODUCT
        const foundProduct =
          allProducts.find(
            (item) => item._id === id
          );

        setProduct(foundProduct);

      } catch (error) {

        console.log(
          "API Error:",
          error
        );

        // FALLBACK TO DUMMY PRODUCTS
        const foundProduct =
          dummyProducts.find(
            (item) => item._id === id
          );

        setProduct(foundProduct);

        setDbProducts([]);
      }
    };

    fetchProducts();

  }, [id]);

  // =========================
  // LOADING
  // =========================
  if (!product) {

    return (
      <div className="text-center py-20">

        <h1 className="text-3xl font-bold">
          Loading Product...
        </h1>

      </div>
    );
  }

  // =========================
  // MERGE PRODUCTS
  // =========================
  const allProducts = [
    ...dummyProducts,
    ...(Array.isArray(dbProducts)
      ? dbProducts
      : []),
  ];

  // =========================
  // RELATED PRODUCTS
  // =========================
  const relatedProducts =
    allProducts
      .filter(
        (item) =>
          item.category ===
            product.category &&
          item._id !== product._id
      )
      .slice(0, 4);

  // =========================
  // ADD TO CART
  // =========================
  const handleAddToCart = () => {

    addToCart(product);

    alert("Product Added To Cart");
  };

  return (

    <div className="max-w-7xl mx-auto py-10 px-6">

      <div className="grid md:grid-cols-2 gap-10">

        {/* PRODUCT IMAGES */}
        <div>

          <img
            src={product.image?.[mainImage]}
            alt={product.name}
            className="w-full h-[500px] object-cover rounded-2xl border"
          />

          {/* THUMBNAILS */}
          <div className="flex gap-3 mt-4 flex-wrap">

            {product.image?.map(
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

          <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm">

            {product.category}

          </span>

          <h1 className="text-4xl font-bold mt-4">

            {product.name}

          </h1>

          <div className="flex items-center gap-4 mt-5">

            <p className="text-3xl font-bold text-green-600">

              ₹{product.offerPrice}

            </p>

            <p className="text-xl text-gray-400 line-through">

              ₹{product.price}

            </p>

          </div>

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
                (desc, index) => (

                  <li key={index}>
                    {desc}
                  </li>
                )
              )}

            </ul>

          </div>

          {/* BUTTONS */}
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

      {/* RELATED PRODUCTS */}
      <div className="mt-16">

        <h2 className="text-3xl font-bold mb-8">
          Related Products
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">

          {relatedProducts.map((item) => (

            <div
              key={item._id}
              className="bg-white rounded-2xl shadow-md hover:shadow-xl transition overflow-hidden border"
            >

              <img
                src={item.image?.[0]}
                alt={item.name}
                className="w-full h-52 object-cover"
              />

              <div className="p-4">

                <h3 className="font-semibold text-lg line-clamp-2">

                  {item.name}

                </h3>

                <div className="flex items-center gap-2 mt-2">

                  <p className="text-green-600 font-bold text-lg">

                    ₹{item.offerPrice}

                  </p>

                  <p className="text-gray-400 line-through text-sm">

                    ₹{item.price}

                  </p>

                </div>

                <button
                  onClick={() =>
                    navigate(
                      `/products/${item._id}`
                    )
                  }
                  className="w-full mt-4 bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg"
                >

                  View Product

                </button>

              </div>

            </div>
          ))}

        </div>

      </div>

    </div>
  );
};

export default ProductDetails;