import React, {
  useState,
  useEffect,
} from "react";

import axios from "axios";

import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

export default function AddProduct() {

  // =========================
  // FORM DATA
  // =========================
  const [formData, setFormData] =
    useState({
      name: "",
      description: "",
      category: "",
    });

  // =========================
  // IMAGES
  // =========================
  const [images, setImages] =
    useState([]);

  // =========================
  // CATEGORIES
  // =========================
  const [categories, setCategories] =
    useState([]);

  const [
    loadingCategories,
    setLoadingCategories,
  ] = useState(true);

  // =========================
  // VARIANTS
  // =========================
  const [variants, setVariants] =
    useState([
      {
        size: "",
        price: "",
        offerPrice: "",
        stockQuantity: "",
      },
    ]);

  // =========================
  // FETCH CATEGORIES
  // =========================
  useEffect(() => {

    const fetchCategories =
      async () => {

        try {

          setLoadingCategories(true);

          const res =
            await axios.get(
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
  // HANDLE INPUT CHANGE
  // =========================
  const handleChange = (e) => {

    setFormData((prev) => ({
      ...prev,
      [e.target.name]:
        e.target.value,
    }));
  };

  // =========================
  // HANDLE IMAGE CHANGE
  // =========================
  const handleImages = (e) => {

    setImages(
      Array.from(e.target.files)
    );
  };

  // =========================
  // HANDLE VARIANT CHANGE
  // =========================
  const handleVariantChange = (
    index,
    field,
    value
  ) => {

    const updated = [...variants];

    updated[index][field] =
      field === "price" ||
      field === "offerPrice" ||
      field === "stockQuantity"
        ? Number(value)
        : value;

    setVariants(updated);
  };

  // =========================
  // ADD VARIANT
  // =========================
  const addVariant = () => {

    setVariants([
      ...variants,
      {
        size: "",
        price: "",
        offerPrice: "",
        stockQuantity: "",
      },
    ]);
  };

  // =========================
  // REMOVE VARIANT
  // =========================
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
  // SUBMIT PRODUCT
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

      // BASIC INFO
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

      // VARIANTS
      data.append(
        "variants",
        JSON.stringify(variants)
      );

      // IMAGES
      images.forEach((image) => {

        data.append(
          "images",
          image
        );
      });

      // API CALL
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

      console.log(
        "PRODUCT ADDED:",
        res.data
      );

      alert(
        "Product Added Successfully"
      );

      // RESET FORM
      setFormData({
        name: "",
        description: "",
        category: "",
      });

      setVariants([
        {
          size: "",
          price: "",
          offerPrice: "",
          stockQuantity: "",
        },
      ]);

      setImages([]);

      document.getElementById(
        "product-images"
      ).value = "";

    } catch (error) {

      console.log(
        "ADD PRODUCT ERROR:",
        error
      );

      alert(
        error.response?.data
          ?.message ||
          "Error adding product"
      );
    }
  };

  return (

    <div className="flex min-h-screen bg-gray-100">

      {/* SIDEBAR */}
      <Sidebar />

      {/* MAIN */}
      <div className="flex-1">

        <Navbar />

        <div className="p-6">

          <div className="bg-white rounded-2xl shadow-lg p-8 max-w-5xl mx-auto">

            <h1 className="text-3xl font-bold mb-8 text-gray-800">
              Add Product
            </h1>

            <form
              onSubmit={handleSubmit}
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
                  value={formData.name}
                  onChange={handleChange}
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
                  onChange={handleChange}
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
                  onChange={handleChange}
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
                      key={index}
                      className="grid md:grid-cols-5 gap-3 mb-4 border rounded-lg p-4"
                    >

                      {/* SIZE */}
                      <select
                        value={variant.size}
                        onChange={(e) =>
                          handleVariantChange(
                            index,
                            "size",
                            e.target.value
                          )
                        }
                        className="border p-3 rounded"
                        required
                      >

                        <option value="">
                          Select Size
                        </option>

                        <option value="1pc">
                          1 pc
                        </option>

                        <option value="2pc">
                          2 pcs
                        </option>

                        <option value="3pc">
                          3 pcs
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

                      {/* PRICE */}
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
                        required
                      />

                      {/* OFFER PRICE */}
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
                        required
                      />

                      {/* STOCK */}
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
                        required
                      />

                      {/* REMOVE */}
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

                {/* ADD VARIANT */}
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
                  Upload Images
                </label>

                <input
                  id="product-images"
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImages}
                  className="border p-3 rounded-lg w-full"
                  required
                />

              </div>

              {/* IMAGE PREVIEW */}
              {images.length > 0 && (

                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">

                  {images.map(
                    (
                      img,
                      index
                    ) => (

                      <img
                        key={index}
                        src={URL.createObjectURL(img)}
                        alt="preview"
                        className="h-24 w-full object-cover rounded border"
                      />
                    )
                  )}

                </div>
              )}

              {/* SUBMIT */}
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