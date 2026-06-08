import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { 
  Menu, 
  X, 
  Plus, 
  Edit2, 
  Trash2, 
  Layers, 
  Package, 
  Tag, 
  IndianRupee, 
  AlertCircle,
  Loader2
} from "lucide-react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

export default function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();

  // =========================
  // FETCH PRODUCTS
  // =========================
  const fetchProducts = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("vendorToken");
      const { data } = await axios.get(
        "http://localhost:5000/api/products/vendor",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setProducts(data.products || []);
    } catch (error) {
      console.error("FETCH PRODUCT ERROR:", error);
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // DELETE PRODUCT
  // =========================
  const deleteProduct = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to permanently delete this product?"
    );
    if (!confirmDelete) return;

    try {
      const token = localStorage.getItem("vendorToken");
      await axios.delete(`http://localhost:5000/api/products/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      fetchProducts();
    } catch (error) {
      console.error("DELETE ERROR:", error);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <div className="flex min-h-screen bg-slate-50 text-slate-800 font-sans overflow-hidden">
      {/* MOBILE SIDEBAR OVERLAY */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* SIDEBAR */}
      <div
        className={`fixed lg:static top-0 left-0 z-50 h-full transition-transform duration-300 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <Sidebar />
      </div>

      {/* MAIN CONTENT AREA */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* TOPBAR */}
        <div className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-slate-100 shadow-sm">
          <div className="flex items-center justify-between px-4 lg:px-6">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden p-3 text-slate-600 hover:bg-slate-100 rounded-xl transition mt-2"
            >
              {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
            </button>

            <div className="flex-1">
              <Navbar />
            </div>
          </div>
        </div>

        {/* PAGE BODY */}
        <div className="p-4 md:p-6 lg:p-8 overflow-x-hidden flex-1">
          
          {/* HEADER SECTION */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-slate-900">
                My Products
              </h1>
              <p className="text-slate-500 text-sm mt-1">
                Manage your catalog, stock details, and pricing models.
              </p>
            </div>
            <button
              onClick={() => navigate("/vendor/products/create")}
              className="inline-flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white px-5 py-3 rounded-xl font-semibold shadow-sm shadow-indigo-100 transition-all w-full sm:w-auto self-start sm:self-center text-sm"
            >
              <Plus size={18} />
              Add Product
            </button>
          </div>

          {/* LOADING STATE */}
          {loading ? (
            <div className="flex flex-col items-center justify-center py-32 gap-3">
              <Loader2 className="w-10 h-10 text-indigo-600 animate-spin" />
              <p className="text-slate-500 text-sm font-medium">Loading inventory...</p>
            </div>
          ) : products.length === 0 ? (
            /* EMPTY STATE */
            <div className="bg-white border border-slate-100 rounded-2xl p-12 text-center max-w-xl mx-auto shadow-sm mt-10">
              <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mx-auto mb-4 text-slate-400 border border-slate-100">
                <Package size={28} />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-1">No Products Found</h3>
              <p className="text-slate-500 text-sm max-w-xs mx-auto mb-6">
                Your store inventory is currently empty. Start by adding your first product variant.
              </p>
              <button
                onClick={() => navigate("/vendor/products/create")}
                className="inline-flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white px-4 py-2.5 rounded-xl font-medium text-sm transition"
              >
                <Plus size={16} /> Create First Listing
              </button>
            </div>
          ) : (
            <>
              {/* DESKTOP DATA TABLE */}
              <div className="hidden xl:block bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[1100px] border-collapse text-left">
                    <thead className="bg-slate-50/70 border-b border-slate-100 text-slate-600 font-semibold text-xs tracking-wider uppercase">
                      <tr>
                        <th className="p-4 pl-6">Details</th>
                        <th className="p-4">Category</th>
                        <th className="p-4">Base Price</th>
                        <th className="p-4">Offer Price</th>
                        <th className="p-4">Availability</th>
                        <th className="p-4">Variants</th>
                        <th className="p-4 pr-6 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-sm">
                      {products.map((product) => {
                        const categoryName =
                          product.category?.text ||
                          product.category?.name ||
                          product.category ||
                          "Uncategorized";

                        const firstVariant = product.variants?.[0];
                        const totalStock =
                          product.variants?.reduce((total, v) => total + (parseInt(v.stockQuantity) || 0), 0) || 0;

                        return (
                          <tr key={product._id} className="hover:bg-slate-50/50 transition-colors">
                            {/* IMAGE & TITLE */}
                            <td className="p-4 pl-6">
                              <div className="flex items-center gap-4">
                                <img
                                  src={product.image?.[0]}
                                  alt={product.name}
                                  className="w-14 h-14 object-cover rounded-xl border border-slate-100 bg-slate-50 flex-shrink-0"
                                />
                                <div className="max-w-[240px]">
                                  <div className="font-semibold text-slate-900 truncate">{product.name}</div>
                                  <div className="text-xs text-slate-400 mt-0.5 truncate">ID: {product._id}</div>
                                </div>
                              </div>
                            </td>

                            {/* CATEGORY */}
                            <td className="p-4">
                              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-100 text-slate-700 font-medium text-xs">
                                <Layers size={12} className="text-slate-400" />
                                {categoryName}
                              </span>
                            </td>

                            {/* PRICE */}
                            <td className="p-4 font-medium text-slate-600">
                              <div className="flex items-center text-xs text-slate-400 line-through">
                                <IndianRupee size={12} />
                                {firstVariant?.price || 0}
                              </div>
                            </td>

                            {/* OFFER PRICE */}
                            <td className="p-4">
                              <div className="flex items-center font-bold text-emerald-600 text-base">
                                <IndianRupee size={14} className="mt-0.5" />
                                {firstVariant?.offerPrice || 0}
                              </div>
                            </td>

                            {/* STOCK */}
                            <td className="p-4">
                              {totalStock > 0 ? (
                                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 font-semibold text-xs">
                                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                  {totalStock} in stock
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-rose-50 text-rose-700 font-semibold text-xs">
                                  <AlertCircle size={12} />
                                  Out of Stock
                                </span>
                              )}
                            </td>

                            {/* VARIANTS */}
                            <td className="p-4">
                              <div className="flex flex-wrap gap-1 max-w-[180px]">
                                {product.variants?.map((v, i) => (
                                  <span
                                    key={i}
                                    className="bg-white border border-slate-200 text-slate-600 font-medium px-2 py-0.5 rounded text-xs"
                                  >
                                    {v.size}
                                  </span>
                                ))}
                              </div>
                            </td>

                            {/* ACTIONS */}
                            <td className="p-4 pr-6 text-right">
                              <div className="flex items-center justify-end gap-1">
                                <button
                                  onClick={() => navigate(`/vendor/products/edit/${product._id}`)}
                                  className="p-2 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition"
                                  title="Edit Product"
                                >
                                  <Edit2 size={16} />
                                </button>
                                <button
                                  onClick={() => deleteProduct(product._id)}
                                  className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
                                  title="Delete Product"
                                >
                                  <Trash2 size={16} />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* MOBILE + TABLET GRID RESPONSIVE CARDS */}
              <div className="grid grid-cols-1 md:grid-cols-2 xl:hidden gap-4">
                {products.map((product) => {
                  const categoryName =
                    product.category?.text ||
                    product.category?.name ||
                    product.category ||
                    "Uncategorized";

                  const firstVariant = product.variants?.[0];
                  const totalStock =
                    product.variants?.reduce((total, v) => total + (parseInt(v.stockQuantity) || 0), 0) || 0;

                  return (
                    <div
                      key={product._id}
                      className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm hover:shadow-md transition flex flex-col justify-between"
                    >
                      <div>
                        {/* CARD CONTENT TOP */}
                        <div className="flex gap-4">
                          <img
                            src={product.image?.[0]}
                            alt={product.name}
                            className="w-20 h-20 md:w-24 md:h-24 object-cover rounded-xl border border-slate-100 bg-slate-50 flex-shrink-0"
                          />
                          <div className="flex-1 min-w-0">
                            <span className="inline-block text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-slate-100 text-slate-500 mb-1">
                              {categoryName}
                            </span>
                            <h2 className="font-bold text-slate-900 text-base truncate">
                              {product.name}
                            </h2>
                            
                            <div className="mt-2 space-y-0.5">
                              <div className="flex items-center gap-2">
                                <span className="text-slate-400 text-xs line-through flex items-center">
                                  ₹{firstVariant?.price || 0}
                                </span>
                                <span className="text-emerald-600 font-extrabold text-sm flex items-center">
                                  ₹{firstVariant?.offerPrice || 0}
                                </span>
                              </div>
                              
                              <div className="pt-1">
                                {totalStock > 0 ? (
                                  <span className="text-xs text-slate-500 font-medium">
                                    Stock Level: <strong className="text-slate-800">{totalStock} units</strong>
                                  </span>
                                ) : (
                                  <span className="text-xs text-rose-600 font-semibold flex items-center gap-1">
                                    <AlertCircle size={12} /> Out of Stock
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* MOBILE VARIANT PILLS */}
                        <div className="flex flex-wrap gap-1 mt-4 border-t border-slate-50 pt-3">
                          {product.variants?.map((v, i) => (
                            <span
                              key={i}
                              className="bg-slate-50 border border-slate-100 text-slate-500 font-medium px-2 py-0.5 rounded text-[11px]"
                            >
                              {v.size}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* CARD INTERACTION ACTION BUTTONS */}
                      <div className="flex gap-2 mt-5 border-t border-slate-100 pt-4">
                        <button
                          onClick={() => navigate(`/vendor/products/edit/${product._id}`)}
                          className="flex-1 inline-flex justify-center items-center gap-2 bg-slate-100 hover:bg-indigo-50 text-slate-700 hover:text-indigo-600 py-2.5 rounded-xl font-semibold text-xs transition"
                        >
                          <Edit2 size={14} /> Edit
                        </button>
                        <button
                          onClick={() => deleteProduct(product._id)}
                          className="flex-1 inline-flex justify-center items-center gap-2 bg-slate-50 hover:bg-rose-50 text-slate-400 hover:text-rose-600 py-2.5 rounded-xl font-medium text-xs transition"
                        >
                          <Trash2 size={14} /> Remove
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}