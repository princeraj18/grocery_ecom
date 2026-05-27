import React, { useState, useEffect } from "react";
import axios from "axios";

import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

export default function AddProduct() {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category: "",
    stockQuantity: "",
  });

  const [images, setImages] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loadingCategories, setLoadingCategories] =
    useState(true);

  const [variants, setVariants] = useState([
    {
      size: "",
      price: "",
      offerPrice: "",
    },
  ]);

  // =========================
  // FETCH CATEGORIES
  // =========================
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoadingCategories(true);

        const res = await axios.get(
          "http://localhost:5000/api/categories"
        );

        setCategories(
          res.data.categories || []
        );
      } catch (error) {
        console.log(
          "CATEGORY FETCH ERROR:",
          error
        );
      } finally {
        setLoadingCategories(false);
      }
    };

    fetchCategories();
  }, []);

  // =========================
  // INPUT CHANGE
  // =========================
  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]:
        e.target.value,
    }));
  };

  // =========================
  // IMAGE CHANGE
  // =========================
  const handleImages = (e) => {
    setImages(
      Array.from(e.target.files)
    );
  };

  // =========================
  // VARIANT CHANGE
  // =========================
  const handleVariantChange = (
    index,
    field,
    value
  ) => {
    const updated = [...variants];

    updated[index][field] =
      value;

    setVariants(updated);
  };

  const addVariant = () => {
    setVariants([
      ...variants,
      {
        size: "",
        price: "",
        offerPrice: "",
      },
    ]);
  };

  const removeVariant = (
    index
  ) => {
    if (variants.length === 1)
      return;

    setVariants(
      variants.filter(
        (_, i) => i !== index
      )
    );
  };

  // =========================
  // SUBMIT
  // =========================
  const handleSubmit = async (
    e
  ) => {
    e.preventDefault();

    try {
      const token =
        localStorage.getItem(
          "vendorToken"
        );

      const data =
        new FormData();

      data.append(
        "name",
        formData.name
      );

      data.append(
        "description",
        formData.description
      );

      data.append(
        "category",
        formData.category
      );

      data.append(
        "stockQuantity",
        formData.stockQuantity
      );

      data.append(
        "variants",
        JSON.stringify(variants)
      );

      images.forEach((image) => {
        data.append(
          "images",
          image
        );
      });
console.log("SELECTED CATEGORY:", formData.category);
      const res =
        await axios.post(
          "http://localhost:5000/api/products",
          data,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type":
                "multipart/form-data",
            },
          }
        );

      alert(
        "Product Added Successfully"
      );

      console.log(res.data);

      setFormData({
        name: "",
        description: "",
        category: "",
        stockQuantity: "",
      });

      setVariants([
        {
          size: "",
          price: "",
          offerPrice: "",
        },
      ]);

      setImages([]);

      document.getElementById(
        "product-images"
      ).value = "";
    } catch (error) {
      console.log(error);

      alert(
        error.response?.data
          ?.message ||
          "Error adding product"
      );
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />

      <div className="flex-1">
        <Navbar />

        <div className="p-6">
          <div className="bg-white rounded-2xl shadow-lg p-8 max-w-5xl mx-auto">
            <h1 className="text-3xl font-bold mb-8 text-gray-800">
              Add Product
            </h1>

            <form
              onSubmit={
                handleSubmit
              }
              className="space-y-6"
            >
              {/* PRODUCT NAME */}
              <div>
                <label className="block mb-2 font-semibold">
                  Product Name
                </label>

                <input
                  type="text"
                  name="name"
                  value={
                    formData.name
                  }
                  onChange={
                    handleChange
                  }
                  placeholder="Enter Product Name"
                  className="border p-3 rounded-lg w-full"
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
                    formData.description
                  }
                  onChange={
                    handleChange
                  }
                  rows="4"
                  placeholder="Enter Product Description"
                  className="border p-3 rounded-lg w-full"
                  required
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
                    formData.category
                  }
                  onChange={
                    handleChange
                  }
                  className="border p-3 rounded-lg w-full"
                  required
                >
                  <option value="">
                    {loadingCategories
                      ? "Loading Categories..."
                      : "Select Category"}
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

                {variants.map(
                  (
                    variant,
                    index
                  ) => (
                    <div
                      key={
                        index
                      }
                      className="grid md:grid-cols-4 gap-3 mb-3 border rounded-lg p-4"
                    >
                      <select
                        value={
                          variant.size
                        }
                        onChange={(
                          e
                        ) =>
                          handleVariantChange(
                            index,
                            "size",
                            e.target
                              .value
                          )
                        }
                        className="border p-3 rounded"
                        required
                      >
                        <option value="">
                          Select Size
                        </option>

                        <option value="100ml">
                          100 ml
                        </option>

                        <option value="250ml">
                          250 ml
                        </option>

                        <option value="500ml">
                          500 ml
                        </option>

                        <option value="1L">
                          1 L
                        </option>

                        <option value="2L">
                          2 L
                        </option>

                        <option value="250g">
                          250 g
                        </option>

                        <option value="500g">
                          500 g
                        </option>

                        <option value="1kg">
                          1 Kg
                        </option>

                        <option value="2kg">
                          2 Kg
                        </option>

                        <option value="5kg">
                          5 Kg
                        </option>
                      </select>

                      <input
                        type="number"
                        placeholder="Price"
                        value={
                          variant.price
                        }
                        onChange={(
                          e
                        ) =>
                          handleVariantChange(
                            index,
                            "price",
                            e.target
                              .value
                          )
                        }
                        className="border p-3 rounded"
                        required
                      />

                      <input
                        type="number"
                        placeholder="Offer Price"
                        value={
                          variant.offerPrice
                        }
                        onChange={(
                          e
                        ) =>
                          handleVariantChange(
                            index,
                            "offerPrice",
                            e.target
                              .value
                          )
                        }
                        className="border p-3 rounded"
                        required
                      />

                      <button
                        type="button"
                        onClick={() =>
                          removeVariant(
                            index
                          )
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
                  onClick={
                    addVariant
                  }
                  className="bg-blue-600 text-white px-4 py-2 rounded"
                >
                  + Add Variant
                </button>
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
                    formData.stockQuantity
                  }
                  onChange={
                    handleChange
                  }
                  className="border p-3 rounded-lg w-full"
                  required
                />
              </div>

              {/* IMAGES */}
              <div>
                <label className="block mb-2 font-semibold">
                  Upload Images
                </label>

                <input
                  id="product-images"
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={
                    handleImages
                  }
                  className="border p-3 rounded-lg w-full"
                  required
                />
              </div>

              {/* IMAGE PREVIEW */}
              {images.length >
                0 && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {images.map(
                    (
                      img,
                      index
                    ) => (
                      <img
                        key={
                          index
                        }
                        src={URL.createObjectURL(
                          img
                        )}
                        alt="preview"
                        className="h-24 w-full object-cover rounded border"
                      />
                    )
                  )}
                </div>
              )}

              <button
                type="submit"
                className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-lg font-semibold"
              >
                Add Product
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}