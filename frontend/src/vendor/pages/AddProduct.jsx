import React, { useState, useEffect } from "react";
import axios from "axios";
import { 
  Menu, 
  X, 
  PackagePlus, 
  Layers, 
  FileText, 
  Plus, 
  Trash2, 
  Upload, 
  Image as ImageIcon,
  CheckCircle,
  Loader2
} from "lucide-react";

import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

export default function AddProduct() {
  // =========================
  // SIDEBAR STATE
  // =========================
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [variantOptions, setVariantOptions] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // =========================
  // FORM DATA & MEDIA
  // =========================
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category: "",
  });
  const [images, setImages] = useState([]);
  const [categories, setCategories] = useState([]);
  const [variants, setVariants] = useState([
    {
      size: "",
      price: "",
      offerPrice: "",
      stockQuantity: "",
    },
  ]);

  // =========================
  // DATA INGESTION
  // =========================
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoadingCategories(true);
        const res = await axios.get("http://localhost:5000/api/categories");
        setCategories(res.data.categories || []);
      } catch (error) {
        console.error("CATEGORY FETCH ERROR:", error);
      } finally {
        setLoadingCategories(false);
      }
    };

    const fetchVariants = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/variants");
        setVariantOptions(res.data.variants || []);
      } catch (error) {
        console.error("VARIANT FETCH ERROR:", error);
      }
    };

    fetchCategories();
    fetchVariants();
  }, []);

  // =========================
  // HANDLERS
  // =========================
  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleImages = (e) => {
    setImages(Array.from(e.target.files));
  };

  const handleVariantChange = (index, field, value) => {
    const updated = [...variants];
    updated[index][field] =
      field === "price" || field === "offerPrice" || field === "stockQuantity"
        ? Number(value)
        : value;
    setVariants(updated);
  };

  const addVariant = () => {
    setVariants([
      ...variants,
      { size: "", price: "", offerPrice: "", stockQuantity: "" },
    ]);
  };

  const removeVariant = (index) => {
    if (variants.length === 1) return;
    setVariants(variants.filter((_, i) => i !== index));
  };

  // =========================
  // SUBMIT DATA PROFILE
  // =========================
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;

    try {
      setIsSubmitting(true);
      const token = localStorage.getItem("vendorToken");
      const data = new FormData();

      data.append("name", formData.name);
      data.append("description", formData.description);
      data.append("category", formData.category);
      data.append("variants", JSON.stringify(variants));

      images.forEach((image) => {
        data.append("images", image);
      });

      await axios.post("http://localhost:5000/api/products", data, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      alert("Product Created Successfully");

      // Reset Pipeline
      setFormData({ name: "", description: "", category: "" });
      setVariants([{ size: "", price: "", offerPrice: "", stockQuantity: "" }]);
      setImages([]);
      document.getElementById("product-images").value = "";
    } catch (error) {
      console.error("ADD PRODUCT ERROR:", error);
      alert(error.response?.data?.message || "Error adding product");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-50 text-slate-800 font-sans overflow-hidden">
      
      {/* MOBILE BACKDROP OVERLAY */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40 lg:hidden transition-opacity"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* SIDEBAR CONTEXT WRAPPER */}
      <div
        className={`
          fixed lg:static top-0 left-0 z-50 h-full transition-transform duration-300 ease-in-out
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
        `}
      >
        <Sidebar />
      </div>

      {/* CORE FRAME LAYOUT */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-y-auto">
        
        {/* UPPER APPLICATION GLOBAL NAV */}
        <div className="sticky top-0 z-30 bg-white border-b border-slate-100 shadow-sm flex items-center">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="lg:hidden p-4 text-slate-500 hover:text-slate-900 transition-colors"
          >
            {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
          <div className="flex-1">
            <Navbar />
          </div>
        </div>

        {/* COMPONENT SCROLLABLE RUNWAY */}
        <div className="p-4 sm:p-6 md:p-8 max-w-5xl w-full mx-auto">
          
          {/* ACTION HEADER */}
          <div className="mb-6 hidden lg:block">
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-slate-900">
              Create Dynamic Listing
            </h1>
            <p className="text-slate-500 text-sm mt-0.5">
              Deploy a new retail inventory master entry, append variations, and map asset galleries.
            </p>
          </div>

          {/* MAIN DATA FORM BLOCK */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 sm:p-6 md:p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              
              {/* LAYOUT GRID: NAME & CATEGORY */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* PRODUCT NAME */}
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-2">
                    <PackagePlus size={14} className="text-slate-400" /> Product Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="e.g. Vintage Denim Trucker Jacket"
                    className="w-full bg-slate-50/50 focus:bg-white border border-slate-200 focus:border-indigo-500 rounded-xl px-4 py-3 text-sm font-medium outline-none transition"
                    required
                  />
                </div>

                {/* CATEGORY MAPPING */}
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-2">
                    <Layers size={14} className="text-slate-400" /> Catalog Category
                  </label>
                  <div className="relative">
                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleChange}
                      className="w-full bg-slate-50/50 focus:bg-white border border-slate-200 focus:border-indigo-500 rounded-xl px-4 py-3 text-sm font-medium outline-none transition cursor-pointer appearance-none"
                      required
                    >
                      <option value="">
                        {loadingCategories ? "Loading options ledger..." : "Select structural category..."}
                      </option>
                      {categories.map((cat) => (
                        <option key={cat._id} value={cat._id}>
                          {cat.text || cat.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* NARRATIVE DESCRIPTION */}
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-2">
                  <FileText size={14} className="text-slate-400" /> Description / Content Copy
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows="4"
                  placeholder="Elaborate on styling points, design material composition, fit guides, etc..."
                  className="w-full bg-slate-50/50 focus:bg-white border border-slate-200 focus:border-indigo-500 rounded-xl px-4 py-3 text-sm font-medium outline-none transition resize-none"
                  required
                />
              </div>

              {/* VARIANTS ARCHITECTURE */}
              <div className="space-y-4 pt-4 border-t border-slate-100">
                <div>
                  <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900">
                    Product Variants
                  </h3>
                  <p className="text-slate-400 text-xs mt-0.5">
                    Map individual item matrices like size parameters, specific pricing updates, and active warehouse stock counts.
                  </p>
                </div>

                <div className="space-y-3">
                  {variants.map((variant, index) => (
                    <div
                      key={index}
                      className="grid grid-cols-2 md:grid-cols-5 items-end gap-3 bg-slate-50/50 p-4 border border-slate-100 rounded-xl relative"
                    >
                      {/* SIZE ASSIGNMENT */}
                      <div className="space-y-1.5 col-span-2 md:col-span-1">
                        <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wide">
                          Variant Scale
                        </label>
                        <select
                          value={variant.size}
                          onChange={(e) => handleVariantChange(index, "size", e.target.value)}
                          className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs font-semibold outline-none focus:border-indigo-500 transition cursor-pointer"
                          required
                        >
                          <option value="">Select Scale</option>
                          {variantOptions.map((item) => (
                            <option key={item._id} value={item.size}>
                              {item.size}
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* RETAIL BASE PRICE */}
                      <div className="space-y-1.5">
                        <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wide">
                          Retail Base (₹)
                        </label>
                        <input
                          type="number"
                          placeholder="0.00"
                          value={variant.price}
                          onChange={(e) => handleVariantChange(index, "price", e.target.value)}
                          className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs font-semibold outline-none focus:border-indigo-500 transition"
                          required
                        />
                      </div>

                      {/* SPECIAL OFFER PRICE */}
                      <div className="space-y-1.5">
                        <label className="text-[11px] font-bold text-emerald-600 uppercase tracking-wide">
                          Offer Value (₹)
                        </label>
                        <input
                          type="number"
                          placeholder="0.00"
                          value={variant.offerPrice}
                          onChange={(e) => handleVariantChange(index, "offerPrice", e.target.value)}
                          className="w-full bg-white border border-slate-200 text-emerald-600 rounded-lg px-3 py-2 text-xs font-semibold outline-none focus:border-indigo-500 transition"
                          required
                        />
                      </div>

                      {/* PHYSICAL STOCK UNITS */}
                      <div className="space-y-1.5">
                        <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wide">
                          Stock Vault
                        </label>
                        <input
                          type="number"
                          placeholder="Units"
                          value={variant.stockQuantity}
                          onChange={(e) => handleVariantChange(index, "stockQuantity", e.target.value)}
                          className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs font-semibold outline-none focus:border-indigo-500 transition"
                          required
                        />
                      </div>

                      {/* EXTRACT VARIANT ENTRY */}
                      <button
                        type="button"
                        onClick={() => removeVariant(index)}
                        disabled={variants.length === 1}
                        className="h-[38px] flex items-center justify-center bg-white border border-slate-200 hover:border-rose-200 text-slate-400 hover:text-rose-600 disabled:opacity-40 disabled:hover:text-slate-400 disabled:hover:border-slate-200 rounded-lg transition px-2 col-span-2 md:col-span-1"
                      >
                        <Trash2 size={15} />
                        <span className="md:hidden text-xs font-medium ml-1.5">Delete Variation Matrix</span>
                      </button>
                    </div>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={addVariant}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-600 hover:text-indigo-700 bg-indigo-50 hover:bg-indigo-100/80 px-3 py-2 rounded-lg transition"
                >
                  <Plus size={14} /> Append Variations Model
                </button>
              </div>

              {/* MEDIA DRAG AND OVERVIEW COMPONENT */}
              <div className="space-y-4 pt-4 border-t border-slate-100">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-2">
                  <Upload size={14} className="text-slate-400" /> Digital Showcase Media Assets
                </label>

                <div className="border-2 border-dashed border-slate-200 hover:border-indigo-400 rounded-2xl bg-slate-50/40 p-6 text-center relative group transition-colors">
                  <input
                    id="product-images"
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleImages}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                    required
                  />
                  <ImageIcon size={24} className="mx-auto text-slate-400 group-hover:text-indigo-500 mb-2 transition-colors" />
                  <span className="block text-xs font-semibold text-slate-700">
                    {images.length > 0 ? `Captured ${images.length} item files` : "Click here or slide files to anchor photography frames"}
                  </span>
                  <span className="block text-[10px] text-slate-400 mt-0.5">PNG, JPEG, and WEBP formats supported</span>
                </div>
              </div>

              {/* LIVE IMAGE PREVIEWS */}
              {images.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3 bg-slate-50 p-3 rounded-xl border border-slate-100">
                  {images.map((img, index) => (
                    <div key={index} className="relative aspect-square bg-white rounded-lg overflow-hidden border border-slate-200 p-1">
                      <img
                        src={URL.createObjectURL(img)}
                        alt="Upload Asset Frame Preview"
                        className="w-full h-full object-cover rounded-md"
                        onLoad={(e) => URL.revokeObjectURL(e.target.src)} // Avoid active object cache leaks
                      />
                    </div>
                  ))}
                </div>
              )}

              {/* ACTION TRIGGER BUTTONS */}
              <div className="pt-5 border-t border-slate-100">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm px-8 py-3 rounded-xl transition-all shadow-sm disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 size={16} className="animate-spin" /> Inserting Master Record...
                    </>
                  ) : (
                    <>
                      <CheckCircle size={16} /> Deploy Product
                    </>
                  )}
                </button>
              </div>

            </form>
          </div>
        </div>
      </div>
    </div>
  );
}