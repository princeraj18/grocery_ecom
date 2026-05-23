import { useEffect, useState } from "react";
import api from "../services/api";

export default function Product() {

  const [products, setProducts] =
    useState([]);

  useEffect(() => {

    fetchProducts();

  }, []);

  const fetchProducts =
    async () => {

      try {

        const { data } =
          await api.get(
            "/products"
          );

        setProducts(
          data.products
        );

      } catch (error) {

        console.log(error);
      }
    };

  return (
    <div className="p-10">

      <h1 className="text-3xl font-bold mb-6">
        Products
      </h1>

      <div className="grid grid-cols-4 gap-5">

        {
          products.map((product) => (

            <div
              key={product._id}
              className="border rounded-lg p-4"
            >

              <img
                src={product.image[0]}
                alt={product.name}
                className="w-full h-52 object-cover rounded"
              />

              <h2 className="font-bold mt-3">
                {product.name}
              </h2>

              <p>
                ₹{product.price}
              </p>

              <p>
                Stock:
                {
                  product.stockQuantity
                }
              </p>

            </div>
          ))
        }

      </div>

    </div>
  );
}