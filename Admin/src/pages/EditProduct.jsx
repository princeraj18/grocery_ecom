/* eslint-disable react-hooks/exhaustive-deps */

import {
  useEffect,
  useState,
} from "react";

import {
  useParams,
  useNavigate,
} from "react-router-dom";

import api from "../services/api";

export default function EditProduct() {

  const { id } =
    useParams();

  const navigate =
    useNavigate();

  const [form, setForm] =
    useState({
      name: "",
      price: "",
      stock: "",
      description: "",
      category: "",
      subcategory: "",
    });

  // FETCH PRODUCT
  const fetchProduct =
    async () => {

      try {

        const res =
          await api.get(
            `/products/${id}`
          );

        const product =
          res.data.product;

        setForm({
          name:
            product.name || "",
          price:
            product.price || "",
          stock:
            product.stock || "",
          description:
            product.description || "",
          category:
            product.category || "",
          subcategory:
            product.subCategory || "",
        });

      } catch (err) {

        console.log(err);
      }
    };

  useEffect(() => {

    fetchProduct();

  }, []);

  const handleChange = (e) => {

    setForm({
      ...form,
      [e.target.name]:
        e.target.value,
    });
  };

  // UPDATE PRODUCT
  const handleSubmit =
    async (e) => {

      e.preventDefault();

      try {

        await api.put(
          `/products/${id}`,
          {
            ...form,
          }
        );

        alert(
          "Product updated successfully"
        );

        navigate(
          "/admin/products"
        );

      } catch (err) {

        console.log(err);

        alert(
          "Update failed"
        );
      }
    };

  return (
    <div>

      <h1 className="text-2xl font-bold mb-6">
        Edit Product
      </h1>

      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded shadow space-y-4"
      >

        <input
          name="name"
          value={form.name}
          onChange={handleChange}
          className="w-full border p-3 rounded"
          placeholder="Product Name"
        />

        <input
          name="price"
          value={form.price}
          onChange={handleChange}
          className="w-full border p-3 rounded"
          placeholder="Price"
        />

        <input
          name="stock"
          value={form.stock}
          onChange={handleChange}
          className="w-full border p-3 rounded"
          placeholder="Stock"
        />

        <input
          name="category"
          value={form.category}
          onChange={handleChange}
          className="w-full border p-3 rounded"
          placeholder="Category"
        />

        <input
          name="subcategory"
          value={form.subcategory}
          onChange={handleChange}
          className="w-full border p-3 rounded"
          placeholder="Subcategory"
        />

        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          className="w-full border p-3 rounded"
          placeholder="Description"
        />

        <button
          className="bg-black text-white px-4 py-2 rounded"
        >
          Update Product
        </button>

      </form>

    </div>
  );
}