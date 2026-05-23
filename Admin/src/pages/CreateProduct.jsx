import { useNavigate } from "react-router-dom"
import { useState } from "react"
import AdminLayout from "../layout/AdminLayout"
import api from "../services/api"

const fileToDataUrl = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result)
    reader.onerror = reject
    reader.readAsDataURL(file)
  })

export default function CreateProduct() {
  const navigate = useNavigate()
  const [form, setForm] = useState({
    name: "",
    price: "",
    description: "",
    stock: "",
    category: "",
    subcategory: "",
  })

  const [sizes, setSizes] = useState([])

  const [images, setImages] = useState([])
  const [previews, setPreviews] = useState([])

  const availableSizes = ["S", "M", "L", "XL", "XXL"]

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    })
  }

  // SIZE TOGGLE
  const handleSizeChange = (size) => {
    setSizes((prev) =>
      prev.includes(size)
        ? prev.filter((s) => s !== size)
        : [...prev, size]
    )
  }

  // IMAGES
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files)
    setImages(files)

    const previewUrls = files.map((file) =>
      URL.createObjectURL(file)
    )
    setPreviews(previewUrls)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      const imageData = await Promise.all(
        images.map((file) => fileToDataUrl(file))
      )

      await api.post("/products", {
        name: form.name,
        price: Number(form.price),
        stock: Number(form.stock),
        description: form.description,
        category: form.category,
        subCategory: form.subcategory,
        sizes,
        bestseller: false,
        image: imageData,
      })

      alert("Product created successfully")
      navigate("/admin/products")

      // RESET
      setForm({
        name: "",
        price: "",
        description: "",
        stock: "",
        category: "",
        subcategory: "",
      })

      setSizes([])
      setImages([])
      setPreviews([])
    } catch (err) {
      console.log(err)
      alert("Failed to create product")
    }
  }

  return (
    <AdminLayout>
      <h1 className="text-2xl font-bold mb-6">
        Create Product
      </h1>

      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded shadow max-w-lg space-y-4"
      >
        {/* NAME */}
        <input
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="Product Name"
          className="w-full border p-3 rounded"
        />

        {/* PRICE */}
        <input
          name="price"
          value={form.price}
          onChange={handleChange}
          placeholder="Price"
          type="number"
          className="w-full border p-3 rounded"
        />

        {/* STOCK */}
        <input
          name="stock"
          value={form.stock}
          onChange={handleChange}
          placeholder="Stock"
          type="number"
          className="w-full border p-3 rounded"
        />

        {/* CATEGORY */}
        <input
          name="category"
          value={form.category}
          onChange={handleChange}
          placeholder="Category (e.g. Men, Women)"
          className="w-full border p-3 rounded"
        />

        {/* SUBCATEGORY */}
        <input
          name="subcategory"
          value={form.subcategory}
          onChange={handleChange}
          placeholder="Subcategory (e.g. T-Shirt, Jeans)"
          className="w-full border p-3 rounded"
        />

        {/* DESCRIPTION */}
        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          placeholder="Description"
          className="w-full border p-3 rounded"
        />

        {/* SIZES */}
        <div>
          <p className="font-medium mb-2">Select Sizes:</p>
          <div className="flex gap-2 flex-wrap">
            {availableSizes.map((size) => (
              <button
                type="button"
                key={size}
                onClick={() => handleSizeChange(size)}
                className={`px-3 py-1 border rounded ${
                  sizes.includes(size)
                    ? "bg-black text-white"
                    : "bg-white"
                }`}
              >
                {size}
              </button>
            ))}
          </div>
        </div>

        {/* IMAGES */}
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={handleImageChange}
          className="w-full border p-3 rounded"
        />

        {/* PREVIEW */}
        {previews.length > 0 && (
          <div className="flex gap-2 flex-wrap">
            {previews.map((src, index) => (
              <img
                key={index}
                src={src}
                alt="preview"
                className="w-24 h-24 object-cover rounded border"
              />
            ))}
          </div>
        )}

        {/* SUBMIT */}
        <button
          type="submit"
          className="bg-black text-white px-4 py-2 rounded w-full"
        >
          Create Product
        </button>
      </form>
    </AdminLayout>
  )
}
