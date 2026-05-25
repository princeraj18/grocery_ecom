import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";

export default function Product() {

  const [products, setProducts] =
    useState([]);

  // =========================
  // FETCH PRODUCTS
  // =========================
  const fetchProducts =
    async () => {

      try {

        const { data } =
          await api.get("/products");

        setProducts(
          data.products || []
        );

      } catch (error) {

        console.log(error);
      }
    };

  // =========================
  // DELETE PRODUCT
  // =========================
  const deleteProduct =
    async (id) => {

      const confirmDelete =
        window.confirm(
          "Are you sure you want to delete this product?"
        );

      if (!confirmDelete) return;

      try {

        await api.delete(
          `/products/${id}`
        );

        // REMOVE PRODUCT FROM UI
        setProducts((prev) =>
          prev.filter(
            (item) => item._id !== id
          )
        );

        alert("Product Deleted Successfully");

      } catch (error) {

        console.log(error);

        alert("Failed To Delete Product");
      }
    };

  useEffect(() => {

    fetchProducts();

  }, []);

  return (

    <div className="p-10">

      {/* TOP HEADER */}
      <div className="flex items-center justify-between mb-6">

        <h1 className="text-3xl font-bold">
          Products
        </h1>

        {/* removed Create Product button per request */}

      </div>

      {/* PRODUCTS GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">

        {
          products.length > 0 ? (

            products.map((product) => (

              <div
                key={product._id}
                className="border rounded-xl p-4 shadow hover:shadow-lg transition bg-white"
              >

                {/* PRODUCT IMAGE */}
                <img
                  src={product.image?.[0]}
                  alt={product.name}
                  className="w-full h-52 object-cover rounded-lg"
                />

                {/* PRODUCT NAME */}
                <h2 className="font-bold text-lg mt-4">
                  {product.name}
                </h2>

                {/* CATEGORY */}
                <p className="text-gray-500 text-sm mt-1">
                  {product.category}
                </p>

                {/* PRICE */}
                <div className="mt-3 flex items-center gap-3">

                  <p className="text-xl font-bold text-green-600">
                    ₹{product.offerPrice}
                  </p>

                  <p className="line-through text-gray-400">
                    ₹{product.price}
                  </p>

                </div>

                {/* STOCK */}
                <p className="mt-2 text-sm">
                  Stock:
                  <span className="font-semibold ml-1">
                    {product.stockQuantity}
                  </span>
                </p>

                {/* STATUS */}
                <p
                  className={`mt-2 text-sm font-semibold ${
                    product.inStock
                      ? "text-green-600"
                      : "text-red-500"
                  }`}
                >
                  {
                    product.inStock
                      ? "In Stock"
                      : "Out of Stock"
                  }
                </p>

                {/* ACTION BUTTONS */}
                <div className="flex gap-3 mt-5">

                  {/* EDIT BUTTON */}
                  <Link
                    to={`/admin/products/edit/${product._id}`}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg text-center transition"
                  >
                    Edit
                  </Link>

                  {/* DELETE BUTTON */}
                  <button
                    onClick={() =>
                      deleteProduct(product._id)
                    }
                    className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 rounded-lg transition"
                  >
                    Delete
                  </button>

                </div>

              </div>
            ))

          ) : (

            <div className="col-span-full text-center text-gray-500 text-lg">
              No Products Found
            </div>
          )
        }

      </div>

    </div>
  );
}