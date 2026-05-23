import React, {
  useContext,
} from "react";

import { Link } from "react-router-dom";

import { ShopContext } from "../context/ShopContext";

const RelatedProducts = ({
  category,
  productId,
}) => {
  const { products } =
    useContext(ShopContext);

  const relatedProducts =
    products
      .filter(
        (item) =>
          item.category === category &&
          item._id !== productId
      )
      .slice(0, 4);

  if (relatedProducts.length === 0) {
    return null;
  }

  return (
    <div className="mt-16">

      <h2 className="text-3xl font-bold mb-8">
        Related Products
      </h2>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">

        {relatedProducts.map((item) => (
          <Link
            key={item._id}
            to={`/products/${item._id}`}
            className="bg-white rounded-2xl shadow-md hover:shadow-xl transition overflow-hidden border"
          >

            {/* IMAGE */}
            <img
              src={item.image[0]}
              alt={item.name}
              className="w-full h-52 object-cover"
            />

            {/* INFO */}
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

              <button className="w-full mt-4 bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg">
                View Product
              </button>

            </div>

          </Link>
        ))}

      </div>
    </div>
  );
};

export default RelatedProducts;