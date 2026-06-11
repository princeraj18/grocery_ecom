import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { 
  ArrowLeft,
  Loader2, 
  Layers, 
  Trash2, 
  Plus, 
  Upload, 
  Package, 
  FileText,
  DollarSign
} from "lucide-react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

export default function EditProduct() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);
  const [images, setImages] = useState([]);
  const [existingImages, setExistingImages] = useState([]);
  const [productData, setProductData] = useState({
    name: "",
    description: "",
    category: "",
    variants: [],
    inStock: true,
  });

  // ===================================
  // FETCH CATEGORIES
  // ===================================
  const fetchCategories = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/categories");
      setCategories(res.data.categories || []);
    } catch (error) {
      console.error("CATEGORY ERROR:", error);
    }
  };

  // ===================================
  // FETCH PRODUCT
  // ===================================
  const fetchProduct = async () => {
    try {
      const token = localStorage.getItem("vendorToken");
      const { data } = await axios.get(
        `http://localhost:5000/api/products/${id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const product = data.product;
      setProductData({
        name: product.name || "",
        description: product.description || "",
        category: product.category?._id || "",
        variants: product.variants || [],
        inStock: product.inStock ?? true,
      });
      setExistingImages(product.image || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // ===================================
  // HANDLE INPUT CHANGE
  // ===================================
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setProductData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // ===================================
  // HANDLE VARIANT CHANGE
  // ===================================
  const handleVariantChange = (index, field, value) => {
    const updated = [...productData.variants];
    updated[index][field] =
      field === "price" || field === "offerPrice" || field === "stockQuantity"
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
        { size: "", price: "", offerPrice: "", stockQuantity: "" },
      ],
    });
  };

  // ===================================
  // REMOVE VARIANT
  // ===================================
  const removeVariant = (index) => {
    if (productData.variants.length === 1) return;
    setProductData({
      ...productData,
      variants: productData.variants.filter((_, i) => i !== index),
    });
  };

  // ===================================
  // UPDATE PRODUCT
  // ===================================
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("vendorToken");
      const formData = new FormData();

      formData.append("name", productData.name);
      formData.append("description", productData.description);
      formData.append("category", productData.category);
      formData.append("variants", JSON.stringify(productData.variants));
      formData.append("inStock", productData.inStock);

      for (let i = 0; i < images.length; i++) {
        formData.append("images", images[i]);
      }

      await axios.put(`http://localhost:5000/api/products/${id}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      navigate("/vendor/products");
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchCategories();
    fetchProduct();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50 dark:bg-slate-900 gap-3">
        <Loader2 className="w-10 h-10 text-indigo-600 animate-spin" />
        <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">Loading details...</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-100 font-sans">
      {/* SIDEBAR */}
      <Sidebar />

      {/* MAIN LAYOUT WRAPPER */}
      <div className="flex-1 flex flex-col min-w-0">
        <Navbar />

        {/* CONTAINER WITH TIMELINE/FORM */}
        <div className="p-4 md:p-6 lg:p-8 max-w-5xl w-full mx-auto">
          {/* BACK BUTTON AND HEADER */}
          <div className="mb-6">
            <button
              onClick={() => navigate("/vendor/products")}
              className="inline-flex items-center gap-2 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:text-white font-medium text-sm transition mb-3 group"
            >
              <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
              Back to Catalog
            </button>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
              Edit Listing Profile
            </h1>
            <p className="text-slate-500 dark:text-slate-400 text-sm mt-0.5">
              Refine parameters, pricing variants, or replace active photography.
            </p>
          </div>

          {/* FORM CARD */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm p-6 md:p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              
              {/* LAYOUT GRID FOR OVERVIEW */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* NAME */}
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-2">
                    <Package size={14} className="text-slate-400" /> Product Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={productData.name}
                    onChange={handleChange}
                    className="w-full bg-slate-50 dark:bg-slate-900/50 focus:bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 focus:border-indigo-500 rounded-xl px-4 py-3 text-sm font-medium outline-none transition"
                    placeholder="e.g. Premium Cotton Oversized Tee"
                    required
                  />
                </div>

                {/* CATEGORY */}
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-2">
                    <Layers size={14} className="text-slate-400" /> Market Category
                  </label>
                  <select
                    name="category"
                    value={productData.category}
                    onChange={handleChange}
                    className="w-full bg-slate-50 dark:bg-slate-900/50 focus:bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 focus:border-indigo-500 rounded-xl px-4 py-3 text-sm font-medium outline-none transition cursor-pointer appearance-none"
                  >
                    <option value="">Choose category mapping</option>
                    {categories.map((cat) => (
                      <option key={cat._id} value={cat._id}>
                        {cat.text || cat.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* DESCRIPTION */}
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-2">
                  <FileText size={14} className="text-slate-400" /> Product Narrative / Specifications
                </label>
                <textarea
                  name="description"
                  value={productData.description}
                  onChange={handleChange}
                  className="w-full bg-slate-50 dark:bg-slate-900/50 focus:bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 focus:border-indigo-500 rounded-xl px-4 py-3 text-sm font-medium outline-none transition"
                  rows="4"
                  placeholder="Detail materials, fit parameters, and vendor unique identifiers..."
                />
              </div>

              {/* VARIANTS CONFIGURATION BOX */}
              <div className="space-y-4 pt-4 border-t border-slate-100 dark:border-slate-800">
                <div>
                  <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-white">
                    Product Variants
                  </h3>
                  <p className="text-slate-400 text-xs mt-0.5">
                    Configure dimensional tiers, retail units, and active tracking inventory counts.
                  </p>
                </div>

                <div className="space-y-3">
                  {productData.variants.map((variant, index) => (
                    <div
                      key={index}
                      className="grid grid-cols-2 md:grid-cols-5 items-end gap-3 bg-slate-50 dark:bg-slate-900/60 p-4 border border-slate-100 dark:border-slate-800 rounded-xl relative"
                    >
                      {/* SIZE */}
                      <div className="space-y-1.5 col-span-2 md:col-span-1">
                        <label className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase">Size/Type</label>
                        <input
                          type="text"
                          placeholder="M, XL, 8, Blue"
                          value={variant.size}
                          onChange={(e) => handleVariantChange(index, "size", e.target.value)}
                          className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg px-3 py-2 text-xs font-semibold outline-none focus:border-indigo-500 transition"
                          required
                        />
                      </div>

                      {/* BASE PRICE */}
                      <div className="space-y-1.5">
                        <label className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase flex items-center gap-0.5">
                           Retail (₹)
                        </label>
                        <input
                          type="number"
                          placeholder="0.00"
                          value={variant.price}
                          onChange={(e) => handleVariantChange(index, "price", e.target.value)}
                          className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg px-3 py-2 text-xs font-semibold outline-none focus:border-indigo-500 transition"
                          required
                        />
                      </div>

                      {/* OFFER PRICE */}
                      <div className="space-y-1.5">
                        <label className="text-[11px] font-bold text-emerald-600 uppercase">Offer (₹)</label>
                        <input
                          type="number"
                          placeholder="0.00"
                          value={variant.offerPrice}
                          onChange={(e) => handleVariantChange(index, "offerPrice", e.target.value)}
                          className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg px-3 py-2 text-xs font-semibold text-emerald-600 outline-none focus:border-indigo-500 transition"
                          required
                        />
                      </div>

                      {/* STOCK */}
                      <div className="space-y-1.5">
                        <label className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase">Available Units</label>
                        <input
                          type="number"
                          placeholder="Units"
                          value={variant.stockQuantity}
                          onChange={(e) => handleVariantChange(index, "stockQuantity", e.target.value)}
                          className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg px-3 py-2 text-xs font-semibold outline-none focus:border-indigo-500 transition"
                          required
                        />
                      </div>

                      {/* REMOVE BUTTON */}
                      <button
                        type="button"
                        onClick={() => removeVariant(index)}
                        disabled={productData.variants.length === 1}
                        className="h-[38px] flex items-center justify-center bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-rose-200 text-slate-400 hover:text-rose-600 disabled:opacity-40 disabled:hover:text-slate-400 disabled:hover:border-slate-200 rounded-lg transition px-2 col-span-2 md:col-span-1"
                      >
                        <Trash2 size={15} />
                        <span className="md:hidden text-xs font-medium ml-1.5">Remove Configuration</span>
                      </button>
                    </div>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={addVariant}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-600 hover:text-indigo-700 bg-indigo-50 hover:bg-indigo-100/80 px-3 py-2 rounded-lg transition"
                >
                  <Plus size={14} /> Add Scale Variant
                </button>
              </div>

              {/* MEDIA CAPTURE */}
              <div className="space-y-4 pt-4 border-t border-slate-100 dark:border-slate-800">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-2">
                  <Upload size={14} className="text-slate-400" /> Digital Product Showcase Photography
                </label>

                {/* CURRENT GALLERY PREVIEW */}
                {existingImages.length > 0 && (
                  <div className="space-y-1.5">
                    <span className="text-[11px] text-slate-400 font-medium">Currently Displayed Media Assets</span>
                    <div className="flex flex-wrap gap-2">
                      {existingImages.map((img, idx) => (
                        <img
                          key={idx}
                          src={img}
                          alt="Current Product Preview"
                          className="w-14 h-14 object-cover rounded-xl border border-slate-200 dark:border-slate-800 p-0.5 bg-slate-50 dark:bg-slate-900"
                        />
                      ))}
                    </div>
                  </div>
                )}

                {/* DRAG AND DROP FIELD CHANNELS */}
                <div className="border-2 border-dashed border-slate-200 dark:border-slate-800 hover:border-indigo-400 rounded-2xl bg-slate-50 dark:bg-slate-900/40 p-6 text-center relative group transition-colors">
                  <input
                    type="file"
                    multiple
                    onChange={(e) => setImages(e.target.files)}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  <Upload size={24} className="mx-auto text-slate-400 group-hover:text-indigo-500 mb-2 transition-colors" />
                  <span className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                    {images.length > 0 ? `Selected ${images.length} new replacements files` : "Click here or Drop items to replace catalog frames"}
                  </span>
                  <span className="block text-[10px] text-slate-400 mt-0.5">Supports PNG, JPEG, WEBP assets up to 5MB</span>
                </div>
              </div>

              {/* TOGGLES / METRICS SETUP */}
              <div className="flex items-center gap-3 bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800 p-4 rounded-xl">
                <div className="relative flex items-center h-5">
                  <input
                    id="inStock"
                    type="checkbox"
                    name="inStock"
                    checked={productData.inStock}
                    onChange={handleChange}
                    className="w-4 h-4 text-indigo-600 border-slate-300 rounded focus:ring-indigo-500 cursor-pointer"
                  />
                </div>
                <div className="text-sm">
                  <label htmlFor="inStock" className="font-semibold text-slate-900 dark:text-white cursor-pointer">
                    Publish Availability Flag
                  </label>
                  <p className="text-xs text-slate-400">If unchecked, customers cannot select or request purchase orders for this model.</p>
                </div>
              </div>

              {/* ACTION EXECUTION TRIGGER */}
              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => navigate("/vendor/products")}
                  className="px-5 py-2.5 rounded-xl text-slate-600 dark:text-slate-400 hover:bg-slate-100 text-sm font-medium transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-slate-900 hover:bg-slate-800 text-white px-6 py-2.5 rounded-xl text-sm font-semibold transition shadow-sm shadow-slate-200"
                >
                  Update Catalog Item
                </button>
              </div>

            </form>
          </div>
        </div>
      </div>
    </div>
  );
}