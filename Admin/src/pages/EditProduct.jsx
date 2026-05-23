/* eslint-disable react-hooks/set-state-in-effect, react-hooks/exhaustive-deps */
import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import AdminLayout from "../layout/AdminLayout"
import api from "../services/api"

const fileToDataUrl = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result)
    reader.onerror = reject
    reader.readAsDataURL(file)
  })

export default function EditProduct() {
  const { id } = useParams()
  const navigate = useNavigate()

  const [form, setForm] = useState({
    name: "",
    price: "",
    stock: "",
    description: "",
    category: "",
    subcategory: "",
  })

  const [sizes, setSizes] = useState([])
  const [existingImages, setExistingImages] = useState([])
  const [newImages, setNewImages] = useState([])
  const [newPreviews, setNewPreviews] = useState([])

  const availableSizes = ["S", "M", "L", "XL", "XXL"]

  // GET PRODUCT BY ID
  const fetchProduct = async () => {
    try {
      const res = await api.get(`/products/${id}`)
      const product = res.data?.product || {}

      setForm({
        name: product.name || "",
        price: product.price ?? "",
        stock: product.stock ?? "",
        description: product.description || "",
        category: product.category || "",
        subcategory: product.subCategory || "",
      })

      setSizes(product.sizes || [])
      setExistingImages(product.image || [])
    } catch (err) {
      console.log(err)
    }
  }

  useEffect(() => {
    fetchProduct()
  }, [])

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  // SIZE TOGGLE
  const handleSizeChange = (size) => {
    setSizes((prev) =>
      prev.includes(size)
        ? prev.filter((s) => s !== size)
        : [...prev, size]
    )
  }

  // NEW IMAGES
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files)

    setNewImages(files)

    const previews = files.map((file) =>
      URL.createObjectURL(file)
    )

    setNewPreviews(previews)
  }

  // REMOVE EXISTING IMAGE (frontend only)
  const removeExistingImage = (index) => {
    const updated = [...existingImages]
    updated.splice(index, 1)
    setExistingImages(updated)
  }

  // SUBMIT UPDATE
  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      const newImageData = await Promise.all(
        newImages.map((file) => fileToDataUrl(file))
      )

      await api.put(`/products/${id}`, {
        name: form.name,
        price: Number(form.price),
        stock: Number(form.stock),
        description: form.description,
        category: form.category,
        subCategory: form.subcategory,
        sizes,
        image: [...existingImages, ...newImageData],
      })

      alert("Product updated successfully")
      navigate("/admin/products")
    } catch (err) {
      console.log(err)
      alert("Update failed")
    }
  }

  return (
    <AdminLayout>
      <h1 className="text-2xl font-bold mb-6">
        Edit Product
      </h1>

      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 space-y-4 max-w-xl"
      >
        {/* NAME */}
        <input
          name="name"
          value={form.name}
          onChange={handleChange}
          className="border p-2 w-full"
          placeholder="Product Name"
        />

        {/* PRICE */}
        <input
          name="price"
          value={form.price}
          onChange={handleChange}
          className="border p-2 w-full"
          placeholder="Price"
        />

        {/* STOCK */}
        <input
          name="stock"
          value={form.stock}
          onChange={handleChange}
          className="border p-2 w-full"
          placeholder="Stock"
        />

        {/* CATEGORY */}
        <input
          name="category"
          value={form.category}
          onChange={handleChange}
          className="border p-2 w-full"
          placeholder="Category"
        />

        {/* SUBCATEGORY */}
        <input
          name="subcategory"
          value={form.subcategory}
          onChange={handleChange}
          className="border p-2 w-full"
          placeholder="Subcategory"
        />

        {/* DESCRIPTION */}
        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          className="border p-2 w-full"
          placeholder="Description"
        />

        {/* SIZES */}
        <div>
          <p className="font-medium mb-2">Sizes:</p>
          <div className="flex gap-2 flex-wrap">
            {availableSizes.map((size) => (
              <button
                type="button"
                key={size}
                onClick={() => handleSizeChange(size)}
                className={`px-3 py-1 border rounded ${
                  sizes.includes(size)
                    ? "bg-black text-white"
                    : ""
                }`}
              >
                {size}
              </button>
            ))}
          </div>
        </div>

        {/* EXISTING IMAGES */}
        <div>
          <p className="font-medium mb-2">Existing Images:</p>
          <div className="flex gap-2 flex-wrap">
            {existingImages.map((img, index) => (
              <div key={index} className="relative">
                <img
                  src={img}
                  className="w-20 h-20 object-cover rounded"
                />
                <button
                  type="button"
                  onClick={() =>
                    removeExistingImage(index)
                  }
                  className="absolute top-0 right-0 bg-red-500 text-white text-xs px-1"
                >
                  X
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* NEW IMAGES */}
        <input
          type="file"
          multiple
          accept="image/*"
          onChange={handleImageChange}
          className="border p-2 w-full"
        />

        {/* NEW PREVIEW */}
        <div className="flex gap-2 flex-wrap">
          {newPreviews.map((src, i) => (
            <img
              key={i}
              src={src}
              className="w-20 h-20 object-cover rounded"
            />
          ))}
        </div>

        {/* BUTTON */}
        <button className="bg-black text-white w-full py-2">
          Update Product
        </button>
      </form>
    </AdminLayout>
  )
}
