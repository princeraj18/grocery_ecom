import { useState } from "react";

import api from "../services/api";

import { useNavigate } from "react-router-dom";

export default function CreateProduct() {

  const navigate = useNavigate();

  const [loading, setLoading] =
    useState(false);

  const [preview, setPreview] =
    useState([]);

  const [formData, setFormData] =
    useState({
      name: "",
      description: "",
      category: "Vegetables",
      price: "",
      offerPrice: "",
      stockQuantity: "",
    });

  const [images, setImages] =
    useState([]);

  // =========================
  // HANDLE INPUT
  // =========================
  const handleChange = (e) => {

    setFormData({
      ...formData,
      [e.target.name]:
        e.target.value,
    });
  };

  // =========================
  // HANDLE IMAGE
  // =========================
  const handleImageChange = (
    e
  ) => {

    const files =
      Array.from(e.target.files);

    setImages(files);

    // IMAGE PREVIEW
    const imagePreview =
      files.map((file) =>
        URL.createObjectURL(file)
      );

    setPreview(imagePreview);

    console.log(
      "SELECTED FILES:",
      files
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

      setLoading(true);

      // VALIDATION
      if (images.length === 0) {

        alert(
          "Please select at least one image"
        );

        return;
      }

      // FORMDATA
      const productData =
        new FormData();

      // TEXT FIELDS
      productData.append(
        "name",
        formData.name
      );

      productData.append(
        "description",
        formData.description
      );

      productData.append(
        "category",
        formData.category
      );

      productData.append(
        "price",
        formData.price
      );

      productData.append(
        "offerPrice",
        formData.offerPrice
      );

      productData.append(
        "stockQuantity",
        formData.stockQuantity
      );

      // IMAGES
      images.forEach((image) => {

        productData.append(
          "images",
          image
        );
      });

      // DEBUG
      console.log(
        "SENDING PRODUCT..."
      );

      // API CALL
      const response =
        await api.post(
          "/products",
          productData,
          {
            headers: {
              "Content-Type":
                "multipart/form-data",
            },

            timeout: 60000,
          }
        );

      console.log(
        "SUCCESS:",
        response.data
      );

      alert(
        "Product Created Successfully"
      );

      // RESET
      setFormData({
        name: "",
        description: "",
        category:
          "Vegetables",
        price: "",
        offerPrice: "",
        stockQuantity: "",
      });

      setImages([]);

      setPreview([]);

      navigate(
        "/admin/products"
      );

    } catch (error) {

      console.log(
        "CREATE PRODUCT ERROR:",
        error
      );

      console.log(
        "SERVER RESPONSE:",
        error.response?.data
      );

      alert(
        error.response?.data
          ?.message ||
          error.message ||
          "Product creation failed"
      );

    } finally {

      setLoading(false);
    }
  };

  return (

    <div className="p-10">

      <h1 className="text-3xl font-bold mb-6">
        Create Product
      </h1>

      <form
        onSubmit={handleSubmit}
        encType="multipart/form-data"
        className="space-y-4 max-w-xl"
      >

        {/* NAME */}
        <input
          type="text"
          name="name"
          placeholder="Product Name"
          value={formData.name}
          onChange={handleChange}
          className="border p-3 w-full rounded"
          required
        />

        {/* DESCRIPTION */}
        <textarea
          name="description"
          placeholder="Description"
          value={formData.description}
          onChange={handleChange}
          className="border p-3 w-full rounded"
          required
        />

        {/* CATEGORY */}
        <select
          name="category"
          value={formData.category}
          onChange={handleChange}
          className="border p-3 w-full rounded"
        >

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

        {/* PRICE */}
        <input
          type="number"
          name="price"
          placeholder="Price"
          value={formData.price}
          onChange={handleChange}
          className="border p-3 w-full rounded"
          required
        />

        {/* OFFER PRICE */}
        <input
          type="number"
          name="offerPrice"
          placeholder="Offer Price"
          value={formData.offerPrice}
          onChange={handleChange}
          className="border p-3 w-full rounded"
          required
        />

        {/* STOCK */}
        <input
          type="number"
          name="stockQuantity"
          placeholder="Stock Quantity"
          value={formData.stockQuantity}
          onChange={handleChange}
          className="border p-3 w-full rounded"
          required
        />

        {/* IMAGE */}
        <input
          type="file"
          name="images"
          multiple
          accept="image/*"
          onChange={
            handleImageChange
          }
          className="border p-3 w-full rounded"
          required
        />

        {/* PREVIEW */}
        <div className="flex gap-4 flex-wrap">

          {
            preview.map(
              (img, index) => (

                <img
                  key={index}
                  src={img}
                  alt="preview"
                  className="w-24 h-24 object-cover rounded border"
                />
              )
            )
          }

        </div>

        {/* BUTTON */}
        <button
          type="submit"
          disabled={loading}
          className="bg-black text-white px-5 py-3 rounded w-full"
        >

          {
            loading
              ? "Creating Product..."
              : "Create Product"
          }

        </button>

      </form>

    </div>
  );
}