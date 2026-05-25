import React, {
  useState,
} from "react";

import axios from "axios";

export default function AddProduct() {

  const [formData, setFormData] =
    useState({
      name: "",
      description: "",
      category: "",
      price: "",
      offerPrice: "",
      stockQuantity: "",
    });

  const [images, setImages] =
    useState([]);

  const handleChange = (e) => {

    setFormData({
      ...formData,
      [e.target.name]:
        e.target.value,
    });
  };

  const handleImages = (e) => {

    setImages(e.target.files);
  };

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
        "price",
        formData.price
      );

      data.append(
        "offerPrice",
        formData.offerPrice
      );

      data.append(
        "stockQuantity",
        formData.stockQuantity
      );

      // APPEND IMAGES
      for (
        let i = 0;
        i < images.length;
        i++
      ) {

        data.append(
          "images",
          images[i]
        );
      }

      const res =
        await axios.post(
          "http://localhost:5000/api/products",
          data,
          {
            headers: {
              Authorization:
                `Bearer ${token}`,
              "Content-Type":
                "multipart/form-data",
            },
          }
        );

      alert(
        "Product Added Successfully"
      );

      console.log(res.data);

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
    <div className="p-6">

      <h1 className="text-2xl font-bold mb-6">
        Add Product
      </h1>

      <form
        onSubmit={handleSubmit}
        className="space-y-4"
      >

        <input
          type="text"
          name="name"
          placeholder="Product Name"
          onChange={handleChange}
          className="border p-3 w-full"
        />

        <textarea
          name="description"
          placeholder="Description"
          onChange={handleChange}
          className="border p-3 w-full"
        />

        <select
          name="category"
          onChange={handleChange}
          className="border p-3 w-full"
        >

          <option value="">
            Select Category
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

        <input
          type="number"
          name="price"
          placeholder="Price"
          onChange={handleChange}
          className="border p-3 w-full"
        />

        <input
          type="number"
          name="offerPrice"
          placeholder="Offer Price"
          onChange={handleChange}
          className="border p-3 w-full"
        />

        <input
          type="number"
          name="stockQuantity"
          placeholder="Stock Quantity"
          onChange={handleChange}
          className="border p-3 w-full"
        />

        <input
          type="file"
          multiple
          onChange={handleImages}
          className="border p-3 w-full"
        />

        <button
          type="submit"
          className="bg-green-600 text-white px-6 py-3 rounded"
        >
          Add Product
        </button>

      </form>

    </div>
  );
}