import { useState } from "react";
import api from "../services/api";

export default function CreateProduct() {

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

  // =============================
  // CONVERT FILE TO BASE64
  // =============================
  const fileToBase64 = (file) =>
    new Promise((resolve, reject) => {

      const reader =
        new FileReader();

      reader.readAsDataURL(file);

      reader.onload = () =>
        resolve(reader.result);

      reader.onerror = reject;
    });

  // =============================
  // INPUT CHANGE
  // =============================
  const handleChange = (e) => {

    setFormData({
      ...formData,
      [e.target.name]:
        e.target.value,
    });
  };

  // =============================
  // IMAGE CHANGE
  // =============================
  const handleImageChange = (
    e
  ) => {

    setImages(
      Array.from(e.target.files)
    );
  };

  // =============================
  // SUBMIT
  // =============================
  const handleSubmit = async (
    e
  ) => {

    e.preventDefault();

    try {

      // convert images to base64
      const imageBase64 =
        await Promise.all(
          images.map((img) =>
            fileToBase64(img)
          )
        );

      const payload = {
        ...formData,
        images: imageBase64,
        inStock: true,
        bestseller: false,
      };

      const { data } =
        await api.post(
          "/products",
          payload
        );

      alert(
        "Product Created Successfully"
      );

      console.log(data);

    } catch (error) {

      console.log(error);

      alert(
        "Product creation failed"
      );
    }
  };

  return (
    <div className="p-10">

      <form
        onSubmit={handleSubmit}
        className="space-y-4 max-w-xl"
      >

        <input
          type="text"
          name="name"
          placeholder="Name"
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

          <option>
            Vegetables
          </option>

          <option>
            Fruits
          </option>

          <option>
            Drinks
          </option>

          <option>
            Instant
          </option>

          <option>
            Dairy
          </option>

          <option>
            Bakery
          </option>

          <option>
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

        {/* IMAGE */}
        <input
          type="file"
          multiple
          accept="image/*"
          onChange={
            handleImageChange
          }
          className="border p-3 w-full"
        />

        <button
          type="submit"
          className="bg-black text-white px-5 py-3 rounded"
        >
          Create Product
        </button>

      </form>

    </div>
  );
}