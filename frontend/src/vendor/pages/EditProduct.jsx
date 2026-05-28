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

  const [categories, setCategories] =
    useState([]);

  const [images, setImages] =
    useState([]);

  const [productData, setProductData] =
    useState({
      name: "",
      description: "",
      category: "",
      variants: [],
      inStock: true,
    });

  // ===================================
  // FETCH CATEGORIES
  // ===================================
  const fetchCategories =
    async () => {

      try {

        const res =
          await axios.get(
            "http://localhost:5000/api/categories"
          );

        setCategories(
          res.data.categories || []
        );

      } catch (error) {

        console.log(
          "CATEGORY ERROR:",
          error
        );
      }
    };

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
          name: product.name || "",
          description:
            product.description || "",
          category:
            product.category?._id || "",
          variants:
            product.variants || [],
          inStock:
            product.inStock ?? true,
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
  // HANDLE INPUT CHANGE
  // ===================================
  const handleChange = (e) => {

    const {
      name,
      value,
      type,
      checked,
    } = e.target;

    setProductData((prev) => ({
      ...prev,
      [name]:
        type === "checkbox"
          ? checked
          : value,
    }));
  };

  // ===================================
  // HANDLE VARIANT CHANGE
  // ===================================
  const handleVariantChange = (
    index,
    field,
    value
  ) => {

    const updated = [
      ...productData.variants,
    ];

    updated[index][field] =
      field === "price" ||
      field === "offerPrice" ||
      field === "stockQuantity"
        ? Number(value)
        : value;

    setProductData({
      ...productData,
      variants: updated,
    });
  };

  // ===================================
  // ADD VARIANT
  // ===================================
  const addVariant = () => {

    setProductData({
      ...productData,
      variants: [
        ...productData.variants,
        {
          size: "",
          price: "",
          offerPrice: "",
          stockQuantity: "",
        },
      ],
    });
  };

  // ===================================
  // REMOVE VARIANT
  // ===================================
  const removeVariant = (
    index
  ) => {

    if (
      productData.variants.length === 1
    )
      return;

    setProductData({
      ...productData,
      variants:
        productData.variants.filter(
          (_, i) => i !== index
        ),
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
          "variants",
          JSON.stringify(
            productData.variants
          )
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

        navigate(
          "/vendor/products"
        );

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

    fetchCategories();

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

          <div className="bg-white p-8 rounded-xl shadow max-w-5xl">

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
                    Select Category
                  </option>

                  {categories.map(
                    (cat) => (

                      <option
                        key={cat._id}
                        value={cat._id}
                      >
                        {cat.text}
                      </option>
                    )
                  )}

                </select>

              </div>

              {/* VARIANTS */}
              <div>

                <label className="block mb-3 font-semibold">
                  Product Variants
                </label>

                {productData.variants.map(
                  (
                    variant,
                    index
                  ) => (

                    <div
                      key={index}
                      className="grid md:grid-cols-5 gap-3 mb-3 border rounded-lg p-4"
                    >

                      <input
                        type="text"
                        placeholder="Size"
                        value={variant.size}
                        onChange={(e) =>
                          handleVariantChange(
                            index,
                            "size",
                            e.target.value
                          )
                        }
                        className="border p-3 rounded"
                      />

                      <input
                        type="number"
                        placeholder="Price"
                        value={variant.price}
                        onChange={(e) =>
                          handleVariantChange(
                            index,
                            "price",
                            e.target.value
                          )
                        }
                        className="border p-3 rounded"
                      />

                      <input
                        type="number"
                        placeholder="Offer Price"
                        value={
                          variant.offerPrice
                        }
                        onChange={(e) =>
                          handleVariantChange(
                            index,
                            "offerPrice",
                            e.target.value
                          )
                        }
                        className="border p-3 rounded"
                      />

                      <input
                        type="number"
                        placeholder="Stock"
                        value={
                          variant.stockQuantity
                        }
                        onChange={(e) =>
                          handleVariantChange(
                            index,
                            "stockQuantity",
                            e.target.value
                          )
                        }
                        className="border p-3 rounded"
                      />

                      <button
                        type="button"
                        onClick={() =>
                          removeVariant(index)
                        }
                        className="bg-red-500 text-white rounded px-4"
                      >
                        Remove
                      </button>

                    </div>
                  )
                )}

                <button
                  type="button"
                  onClick={addVariant}
                  className="bg-blue-600 text-white px-4 py-2 rounded"
                >
                  + Add Variant
                </button>

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