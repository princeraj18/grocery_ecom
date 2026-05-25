import React, {
  useEffect,
  useState,
} from "react";

import axios from "axios";

import {
  useNavigate,
  useParams,
} from "react-router-dom";

import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

export default function EditProduct() {

  const { id } = useParams();

  const navigate = useNavigate();

  const [loading, setLoading] =
    useState(true);

  const [productData, setProductData] =
    useState({
      name: "",
      description: "",
      category: "",
      price: "",
      offerPrice: "",
      stockQuantity: "",
      inStock: true,
    });

  const [images, setImages] =
    useState([]);

  // ===================================
  // FETCH PRODUCT
  // ===================================
  const fetchProduct =
    async () => {

      try {

        const token =
          localStorage.getItem(
            "vendorToken"
          );

        const { data } =
          await axios.get(
            `http://localhost:5000/api/products/${id}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

        const product =
          data.product;

        setProductData({
          name: product.name,
          description:
            product.description?.[0] || "",
          category:
            product.category,
          price: product.price,
          offerPrice:
            product.offerPrice,
          stockQuantity:
            product.stockQuantity,
          inStock:
            product.inStock,
        });

      } catch (error) {

        console.log(error);

        alert(
          error.response?.data
            ?.message ||
            "Failed to load product"
        );

      } finally {

        setLoading(false);
      }
    };

  // ===================================
  // HANDLE CHANGE
  // ===================================
  const handleChange = (e) => {

    const {
      name,
      value,
      type,
      checked,
    } = e.target;

    setProductData({
      ...productData,
      [name]:
        type === "checkbox"
          ? checked
          : value,
    });
  };

  // ===================================
  // UPDATE PRODUCT
  // ===================================
  const handleSubmit =
    async (e) => {

      e.preventDefault();

      try {

        const token =
          localStorage.getItem(
            "vendorToken"
          );

        const formData =
          new FormData();

        formData.append(
          "name",
          productData.name
        );

        formData.append(
          "description",
          productData.description
        );

        formData.append(
          "category",
          productData.category
        );

        formData.append(
          "price",
          productData.price
        );

        formData.append(
          "offerPrice",
          productData.offerPrice
        );

        formData.append(
          "stockQuantity",
          productData.stockQuantity
        );

        formData.append(
          "inStock",
          productData.inStock
        );

        // IMAGES
        for (
          let i = 0;
          i < images.length;
          i++
        ) {

          formData.append(
            "images",
            images[i]
          );
        }

        await axios.put(
          `http://localhost:5000/api/products/${id}`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type":
                "multipart/form-data",
            },
          }
        );

        alert(
          "Product updated successfully"
        );

        navigate("/vendor/products");

      } catch (error) {

        console.log(error);

        alert(
          error.response?.data
            ?.message ||
            "Update failed"
        );
      }
    };

  useEffect(() => {

    fetchProduct();

  }, []);

  if (loading) {

    return (
      <div className="text-center mt-10 text-2xl">
        Loading...
      </div>
    );
  }

  return (

    <div className="flex min-h-screen bg-gray-100">

      <Sidebar />

      <div className="flex-1">

        <Navbar />

        <div className="p-6">

          <div className="bg-white p-8 rounded-xl shadow max-w-3xl">

            <h1 className="text-3xl font-bold mb-6">
              Edit Product
            </h1>

            <form
              onSubmit={handleSubmit}
              className="space-y-5"
            >

              {/* NAME */}
              <div>

                <label className="block mb-2 font-semibold">
                  Product Name
                </label>

                <input
                  type="text"
                  name="name"
                  value={
                    productData.name
                  }
                  onChange={
                    handleChange
                  }
                  className="w-full border p-3 rounded-lg"
                  required
                />

              </div>

              {/* DESCRIPTION */}
              <div>

                <label className="block mb-2 font-semibold">
                  Description
                </label>

                <textarea
                  name="description"
                  value={
                    productData.description
                  }
                  onChange={
                    handleChange
                  }
                  className="w-full border p-3 rounded-lg"
                  rows="4"
                />

              </div>

              {/* CATEGORY */}
              <div>

                <label className="block mb-2 font-semibold">
                  Category
                </label>

                <select
                  name="category"
                  value={
                    productData.category
                  }
                  onChange={
                    handleChange
                  }
                  className="w-full border p-3 rounded-lg"
                >

                  <option value="">
                    Select
                  </option>

                  <option value="Vegetables">
                    Vegetables
                  </option>

                  <option value="Fruits">
                    Fruits
                  </option>

                  <option value="Drinks">
                    Drinks
                  </option>

                  <option value="Instant">
                    Instant
                  </option>

                  <option value="Dairy">
                    Dairy
                  </option>

                  <option value="Bakery">
                    Bakery
                  </option>

                  <option value="Grains">
                    Grains
                  </option>

                </select>

              </div>

              {/* PRICE */}
              <div className="grid grid-cols-2 gap-5">

                <div>

                  <label className="block mb-2 font-semibold">
                    Price
                  </label>

                  <input
                    type="number"
                    name="price"
                    value={
                      productData.price
                    }
                    onChange={
                      handleChange
                    }
                    className="w-full border p-3 rounded-lg"
                  />

                </div>

                <div>

                  <label className="block mb-2 font-semibold">
                    Offer Price
                  </label>

                  <input
                    type="number"
                    name="offerPrice"
                    value={
                      productData.offerPrice
                    }
                    onChange={
                      handleChange
                    }
                    className="w-full border p-3 rounded-lg"
                  />

                </div>

              </div>

              {/* STOCK */}
              <div>

                <label className="block mb-2 font-semibold">
                  Stock Quantity
                </label>

                <input
                  type="number"
                  name="stockQuantity"
                  value={
                    productData.stockQuantity
                  }
                  onChange={
                    handleChange
                  }
                  className="w-full border p-3 rounded-lg"
                />

              </div>

              {/* IMAGES */}
              <div>

                <label className="block mb-2 font-semibold">
                  Upload New Images
                </label>

                <input
                  type="file"
                  multiple
                  onChange={(e) =>
                    setImages(
                      e.target.files
                    )
                  }
                  className="w-full"
                />

              </div>

              {/* IN STOCK */}
              <div className="flex items-center gap-3">

                <input
                  type="checkbox"
                  name="inStock"
                  checked={
                    productData.inStock
                  }
                  onChange={
                    handleChange
                  }
                />

                <label>
                  In Stock
                </label>

              </div>

              {/* BUTTON */}
              <button
                type="submit"
                className="bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800"
              >
                Update Product
              </button>

            </form>

          </div>

        </div>

      </div>

    </div>
  );
}