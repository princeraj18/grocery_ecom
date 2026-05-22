import React from "react";

import {
  useParams,
  Link,
} from "react-router-dom";

import {
  dummyProducts,
  categories,
} from "../assets/greencart_assets/assets";

const CategoryProducts = () => {
  const { category } =
    useParams();

  // Find category details
  const currentCategory =
    categories.find(
      (cat) =>
        cat.path.toLowerCase() ===
        category.toLowerCase()
    );

  // Filter products
  const filteredProducts =
    dummyProducts.filter(
      (product) =>
        product.category.toLowerCase() ===
        category.toLowerCase()
    );

  return (
    <div className="min-h-screen bg-gray-50 px-6 py-10">

      <div className="max-w-7xl mx-auto">

        {/* Title */}
        <h1 className="text-4xl font-bold mb-8">
          {currentCategory?.text ||
            category}
        </h1>

        {/* Products */}
        {filteredProducts.length >
        0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">

            {filteredProducts.map(
              (item) => (
                <Link
                  key={item._id}
                  to={`/products/${item._id}`}
                  className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all overflow-hidden"
                >

                  <img
                    src={item.image[0]}
                    alt={item.name}
                    className="w-full h-64 object-cover"
                  />

                  <div className="p-4">

                    <h2 className="font-semibold text-lg">
                      {item.name}
                    </h2>

                    <p className="text-green-600 font-bold mt-2">
                      ₹
                      {
                        item.offerPrice
                      }
                    </p>

                    <p className="line-through text-sm text-gray-400">
                      ₹{item.price}
                    </p>

                  </div>
                </Link>
              )
            )}

          </div>
        ) : (
          <div className="text-center py-20">
            <h2 className="text-2xl font-semibold">
              No Products Found
            </h2>
          </div>
        )}

      </div>
    </div>
  );
};

export default CategoryProducts;