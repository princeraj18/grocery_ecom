import React, { useState } from "react";
import { 
  Menu, 
  X, 
  FolderPlus, 
  Image as ImageIcon, 
  Palette, 
  Loader2, 
  Eye 
} from "lucide-react";

import api from "../services/api";
// import Sidebar from "../components/Sidebar";
// import Navbar from "../components/Navbar";

const AddCategory = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [formData, setFormData] = useState({
    text: "",
    path: "",
    bgColor: "#FEF6DA",
  });

  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!image) {
      return alert("Please select an image");
    }

    try {
      setLoading(true);
      const categoryData = new FormData();

      categoryData.append("text", formData.text);
      categoryData.append("path", formData.path);
      categoryData.append("bgColor", formData.bgColor);
      categoryData.append("image", image);

      const { data } = await api.post("/categories/create", categoryData);
      alert(data.message || "Category created successfully");

      setFormData({
        text: "",
        path: "",
        bgColor: "#FEF6DA",
      });
      setImage(null);
      setPreview("");
      e.target.reset();
    } catch (error) {
      console.log("CATEGORY ERROR:", error);
      alert(error?.response?.data?.message || "Failed To Add Category");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-50 text-slate-800 font-poppins overflow-hidden">
      
      {/* MOBILE OVERLAY */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-slate-900/40 z-40 lg:hidden backdrop-blur-xs"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* SIDEBAR */}
      {/* <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} /> */}

      {/* MAIN CONTENT BLOCK CONTAINER */}
      <div className="flex-1 flex flex-col overflow-hidden">
        
        {/* NAVBAR */}
        {/* <Navbar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} /> */}

        {/* PAGE CONTENT SCROLL WRAPPER */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
          <div className="max-w-3xl mx-auto bg-white rounded-2xl border border-slate-200 shadow-sm p-5 md:p-8 space-y-6">
            
            {/* COMPONENT HEADER */}
            <div className="border-b border-slate-100 pb-5">
              <div className="flex items-center gap-2.5">
                <FolderPlus className="text-indigo-600" size={26} />
                <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-wide uppercase">
                  Add Category
                </h1>
              </div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mt-1">
                Establish primary catalog taxonomies and layout routing parameters
              </p>
            </div>

            {/* FORM */}
            <form onSubmit={handleSubmit} className="space-y-5">
              
              {/* CATEGORY NAME */}
              <div className="space-y-1.5">
                <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-500">
                  Category Display Title
                </label>
                <input
                  type="text"
                  name="text"
                  value={formData.text}
                  onChange={handleChange}
                  placeholder="Ex: Organic Veggies, Fresh Fruits"
                  className="w-full border border-slate-200 bg-slate-50/50 rounded-xl p-3 text-sm font-semibold outline-none focus:border-indigo-600 focus:bg-white transition"
                  required
                />
              </div>

              {/* CATEGORY PATH */}
              <div className="space-y-1.5">
                <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-500">
                  System URL Endpoint Route Path
                </label>
                <input
                  type="text"
                  name="path"
                  value={formData.path}
                  onChange={handleChange}
                  placeholder="Ex: organic-vegetables"
                  className="w-full border border-slate-200 bg-slate-50/50 rounded-xl p-3 text-sm font-semibold outline-none focus:border-indigo-600 focus:bg-white transition"
                  required
                />
              </div>

              {/* TWO COLUMN GRID FOR IMAGE & COLOR PICKER */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                
                {/* CATEGORY IMAGE FIELD */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                    <ImageIcon size={14} />
                    Category Core Asset Image
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="w-full border border-slate-200 bg-slate-50/50 text-slate-500 file:mr-4 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-bold file:bg-slate-200 file:text-slate-700 hover:file:bg-slate-300 rounded-xl p-2 text-sm font-medium focus:outline-none transition"
                    required={!image}
                  />
                  {preview && (
                    <div className="mt-3 relative inline-block group">
                      <img
                        src={preview}
                        alt="Preview"
                        className="w-40 h-28 object-cover rounded-xl border border-slate-200 shadow-xs"
                      />
                    </div>
                  )}
                </div>

                {/* BACKGROUND COLOR ACCENT FIELD */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                    <Palette size={14} />
                    Accent Background Tint Color
                  </label>
                  <div className="flex items-center gap-3">
                    <input
                      type="color"
                      name="bgColor"
                      value={formData.bgColor}
                      onChange={handleChange}
                      className="w-16 h-12 border border-slate-200 rounded-xl cursor-pointer p-1 bg-white"
                    />
                    <input
                      type="text"
                      value={formData.bgColor}
                      disabled
                      className="border border-slate-200 bg-slate-100 rounded-xl p-3 text-xs font-mono font-bold text-slate-500 flex-1 uppercase tracking-wider"
                    />
                  </div>
                </div>

              </div>

              {/* REALTIME VISUAL CARD PREVIEW CONTEXT */}
              <div className="border border-slate-200 bg-slate-50/50 rounded-2xl p-4 md:p-5">
                <h3 className="text-xs font-black uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-1.5">
                  <Eye size={14} />
                  Live Front-End Display Preview
                </h3>

                <div
                  className="rounded-xl p-4 flex items-center gap-4 border border-slate-200/40 shadow-xs max-w-sm transition-all duration-300"
                  style={{ backgroundColor: formData.bgColor }}
                >
                  {preview ? (
                    <img
                      src={preview}
                      alt="Category Visual Asset"
                      className="w-14 h-14 md:w-16 md:h-16 object-cover rounded-xl border border-white bg-white/20 shadow-xs shrink-0"
                    />
                  ) : (
                    <div className="w-14 h-14 md:w-16 md:h-16 bg-slate-200/50 border border-dashed border-slate-300 rounded-xl flex items-center justify-center text-slate-400 shrink-0">
                      <ImageIcon size={20} />
                    </div>
                  )}

                  <div className="truncate">
                    <h4 className="font-extrabold text-base text-slate-900 truncate">
                      {formData.text || "New Category Title"}
                    </h4>
                    <p className="text-xs font-semibold text-slate-500 tracking-wide font-mono truncate mt-0.5">
                      /{formData.path || "unassigned-route"}
                    </p>
                  </div>
                </div>
              </div>

              {/* SUBMIT BUTTON FOOTER */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 rounded-xl text-sm font-bold transition shadow-md shadow-indigo-600/10 flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {loading ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      <span>Saving Parameters...</span>
                    </>
                  ) : (
                    <span>Add Category</span>
                  )}
                </button>
              </div>

            </form>

          </div>
        </div>

      </div>
    </div>
  );
};

export default AddCategory;