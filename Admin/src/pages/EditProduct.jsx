import React, {
  useEffect,
  useState,
} from "react";

import {
  useNavigate,
  useParams,
} from "react-router-dom";

import api from "../services/api";

export default function EditProduct() {

  const { id } = useParams();

  const navigate = useNavigate();

  const [loading, setLoading] =
    useState(true);

  const [productData, setProductData] =
    useState({
      name: "",
      category: "",
      price: "",
      offerPrice: "",
      stockQuantity: "",
      description: "",
      inStock: true,
    });

  const [images, setImages] =
    useState([]);

  const [previewImages, setPreviewImages] =
    useState([]);

  // =========================
  // FETCH PRODUCT DETAILS
  // =========================
  useEffect(() => {

    const fetchProduct =
      async () => {

        try {

          const { data } =
            await api.get(
              `/products/${id}`
            );

          const product =
            data.product;

          setProductData({
            name: product.name || "",
            category:
              product.category || "",
            price: product.price || "",
            offerPrice:
              product.offerPrice || "",
            stockQuantity:
              product.stockQuantity || "",
            description:
              product.description?.join(", ") ||
              "",
            inStock:
              product.inStock,
          });

          setPreviewImages(
            product.image || []
          );

          setLoading(false);

        } catch (error) {

          console.log(error);

          alert("Failed to load product");
        }
      };

    fetchProduct();

  }, [id]);

  // =========================
  // HANDLE INPUT CHANGE
  // =========================
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

  // =========================
  // HANDLE IMAGE CHANGE
  // =========================
  const handleImageChange = (e) => {

    const files =
      Array.from(e.target.files);

    setImages(files);

    const previewUrls =
      files.map((file) =>
        URL.createObjectURL(file)
      );

    setPreviewImages(previewUrls);
  };

  // =========================
  // UPDATE PRODUCT
  // =========================
  const handleSubmit =
    async (e) => {

      e.preventDefault();

      try {

        const formData =
          new FormData();

        formData.append(
          "name",
          productData.name
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

        formData.append(
          "description",
          JSON.stringify(
            productData.description
              .split(",")
              .map((item) =>
                item.trim()
              )
          )
        );

        // ADD NEW IMAGES
        images.forEach((image) => {

          formData.append(
            "image",
            image
          );
        });

        await api.put(
          `/products/${id}`,
          formData,
          {
            headers: {
              "Content-Type":
                "multipart/form-data",
            },
          }
        );

        alert(
          "Product Updated Successfully"
        );

        navigate("/admin/products");

      } catch (error) {

        console.log(error);

        alert(
          "Failed To Update Product"
        );
      }
    };

  if (loading) {

    return (
      <div className="p-10 text-xl">
        Loading...
      </div>
    );
  }

  return (

    <div className="max-w-4xl mx-auto p-10">

      <h1 className="text-3xl font-bold mb-8">
        Edit Product
      </h1>

      <form
        onSubmit={handleSubmit}
        className="space-y-6 bg-white dark:bg-slate-900 p-8 rounded-2xl shadow"
      >

        {/* PRODUCT NAME */}
        <div>

          <label className="font-semibold">
            Product Name
          </label>

          <input
            type="text"
            name="name"
            value={productData.name}
            onChange={handleChange}
            className="w-full border p-3 rounded-lg mt-2"
          />

        </div>

        {/* CATEGORY */}
        <div>

          <label className="font-semibold">
            Category
          </label>

          <input
            type="text"
            name="category"
            value={productData.category}
            onChange={handleChange}
            className="w-full border p-3 rounded-lg mt-2"
          />

        </div>

        {/* PRICE */}
        <div className="grid grid-cols-2 gap-4">

          <div>

            <label className="font-semibold">
              Original Price
            </label>

            <input
              type="number"
              name="price"
              value={productData.price}
              onChange={handleChange}
              className="w-full border p-3 rounded-lg mt-2"
            />

          </div>

          <div>

            <label className="font-semibold">
              Offer Price
            </label>

            <input
              type="number"
              name="offerPrice"
              value={productData.offerPrice}
              onChange={handleChange}
              className="w-full border p-3 rounded-lg mt-2"
            />

          </div>

        </div>

        {/* STOCK */}
        <div>

          <label className="font-semibold">
            Stock Quantity
          </label>

          <input
            type="number"
            name="stockQuantity"
            value={
              productData.stockQuantity
            }
            onChange={handleChange}
            className="w-full border p-3 rounded-lg mt-2"
          />

        </div>

        {/* DESCRIPTION */}
        <div>

          <label className="font-semibold">
            Description
          </label>

          <textarea
            rows="4"
            name="description"
            value={
              productData.description
            }
            onChange={handleChange}
            className="w-full border p-3 rounded-lg mt-2"
          />

          <p className="text-sm text-gray-500 dark:text-slate-400 mt-1">
            Separate using commas
          </p>

        </div>

        {/* IN STOCK */}
        <div className="flex items-center gap-3">

          <input
            type="checkbox"
            name="inStock"
            checked={
              productData.inStock
            }
            onChange={handleChange}
          />

          <label className="font-semibold">
            In Stock
          </label>

        </div>

        {/* EXISTING / NEW IMAGES */}
        <div>

          <label className="font-semibold">
            Product Images
          </label>

          <input
            type="file"
            multiple
            onChange={
              handleImageChange
            }
            className="w-full border p-3 rounded-lg mt-2"
          />

          {/* IMAGE PREVIEW */}
          <div className="flex gap-4 mt-4 flex-wrap">

            {previewImages.map(
              (img, index) => (

                <img
                  key={index}
                  src={img}
                  alt=""
                  className="w-28 h-28 object-cover rounded-lg border"
                />
              )
            )}

          </div>

        </div>

        {/* SUBMIT BUTTON */}
        <button
          type="submit"
          className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-lg"
        >
          Update Product
        </button>

      </form>

    </div>
  );
}