import React from "react";
import { Link, useNavigate } from "react-router-dom";

import {
  dummyProducts,
  categories,
  assets,
} from "../assets/greencart_assets/assets";

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Hero Section */}
      <section className="min-h-[80vh] flex flex-col-reverse lg:flex-row items-center justify-between px-6 lg:px-20 py-10 bg-gradient-to-r from-green-500 to-emerald-700 text-white">
        <div className="max-w-xl">
          <h1 className="text-4xl lg:text-6xl font-bold leading-tight">
            Fresh Groceries Delivered To Your Doorstep
          </h1>

          <p className="mt-6 text-lg text-green-100">
            Shop fresh vegetables, fruits, dairy products, bakery items,
            beverages and more at affordable prices.
          </p>

          <div className="mt-8 flex gap-4">
            <button
              onClick={() => navigate("/products")}
              className="bg-white text-green-700 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition"
            >
              Shop Now
            </button>
          </div>
        </div>

        <div className="mb-10 lg:mb-0">
          <img
            src={assets.main_banner_bg}
            alt="grocery-banner"
            className="w-[500px] rounded-3xl shadow-2xl"
          />
        </div>
      </section>

      {/* Categories */}
      <section className="py-16 px-6 lg:px-20">
        <h2 className="text-3xl font-bold text-center mb-12">
          Shop By Category
        </h2>

       <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-6">

  {categories.map((category) => (
    <Link
      key={category.path}
      to={`/category/${category.path}`}
      className="bg-white rounded-2xl shadow-md hover:shadow-xl transition p-5 text-center"
    >

      <img
        src={category.image}
        alt={category.text}
        className="w-28 h-28 object-contain mx-auto"
      />

      <h3 className="mt-4 text-lg font-semibold">
        {category.text}
      </h3>

    </Link>
  ))}

</div>
      </section>

      {/* Best Seller Products */}
      <section className="py-16 px-6 lg:px-20 bg-white">
        <h2 className="text-3xl font-bold text-center mb-12">
          Best Seller Products
        </h2>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {dummyProducts.slice(0, 8).map((product) => (
            <Link
              key={product._id}
              to={`/products/${product._id}`}
              className="bg-white rounded-2xl shadow-md hover:shadow-2xl transition overflow-hidden border"
            >
              <img
                src={product.image[0]}
                alt={product.name}
                className="h-56 w-full object-cover"
              />

              <div className="p-5">
                <h3 className="font-semibold text-lg">
                  {product.name}
                </h3>

                <div className="flex items-center gap-2 mt-2">
                  <p className="text-green-600 font-bold text-lg">
                    ₹{product.offerPrice}
                  </p>

                  <p className="text-gray-400 line-through text-sm">
                    ₹{product.price}
                  </p>
                </div>

                <button className="w-full mt-4 bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg transition">
                  Add To Cart
                </button>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Offer Banner */}
      <section className="py-16 px-6 lg:px-20">
        <div className="bg-gradient-to-r from-orange-400 to-red-500 rounded-3xl p-10 text-white text-center">
          <h2 className="text-4xl font-bold">
            Fresh Grocery Deals Up To 50% OFF
          </h2>

          <p className="mt-4 text-lg">
            Save big on daily essentials and fresh products.
          </p>

          <button
            onClick={() => navigate("/products")}
            className="mt-6 bg-white text-orange-500 px-8 py-3 rounded-lg font-semibold"
          >
            Shop Deals
          </button>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 px-6 lg:px-20">
        <div className="grid md:grid-cols-4 gap-8">
          <div className="bg-white p-8 rounded-2xl shadow text-center">
            <h3 className="font-bold text-xl">
              🚚 Fast Delivery
            </h3>

            <p className="text-gray-600 mt-2">
              Groceries delivered within 30 minutes.
            </p>
          </div>

          <div className="bg-white p-8 rounded-2xl shadow text-center">
            <h3 className="font-bold text-xl">
              🥬 Fresh Products
            </h3>

            <p className="text-gray-600 mt-2">
              Fresh vegetables and fruits directly from farms.
            </p>
          </div>

          <div className="bg-white p-8 rounded-2xl shadow text-center">
            <h3 className="font-bold text-xl">
              💳 Secure Payments
            </h3>

            <p className="text-gray-600 mt-2">
              Safe and secure online payment methods.
            </p>
          </div>

          <div className="bg-white p-8 rounded-2xl shadow text-center">
            <h3 className="font-bold text-xl">
              💰 Best Prices
            </h3>

            <p className="text-gray-600 mt-2">
              Affordable grocery prices every day.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;