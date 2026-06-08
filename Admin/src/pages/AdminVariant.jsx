import React, { useEffect, useState } from "react";
import { 
  Layers, 
  Trash2, 
  PlusCircle, 
  Inbox,
  Loader2 
} from "lucide-react";
import api from "../services/api";

export default function AdminVariant() {
  // =========================
  // STATES
  // =========================
  const [variants, setVariants] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [size, setSize] = useState("");

  // =========================
  // FETCH VARIANTS
  // =========================
  const fetchVariants = async () => {
    try {
      setFetchLoading(true);
      const res = await api.get("/variants");
      setVariants(res.data.variants || []);
    } catch (error) {
      console.log("FETCH VARIANTS ERROR:", error);
    } finally {
      setFetchLoading(false);
    }
  };

  useEffect(() => {
    fetchVariants();
  }, []);

  // =========================
  // CREATE VARIANT
  // =========================
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);

      const payload = {
        size: size.trim(),
      };

      const res = await api.post("/variants", payload);
      alert(res.data.message || "Variant created successfully");

      // RESET FORM FIELD
      setSize("");
      
      // REFRESH LIST
      fetchVariants();
    } catch (error) {
      console.log("CREATE VARIANT ERROR:", error);
      alert(error.response?.data?.message || "Failed to create variant");
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // DELETE VARIANT
  // =========================
  const deleteVariant = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this variant?"
    );
    if (!confirmDelete) return;

    try {
      await api.delete(`/variants/${id}`);
      alert("Variant deleted successfully");
      fetchVariants();
    } catch (error) {
      console.log("DELETE VARIANT ERROR:", error);
      alert(error.response?.data?.message || "Failed to delete variant");
    }
  };

  return (
    <div className="p-4 md:p-8 bg-slate-50 min-h-screen text-slate-800 font-poppins space-y-6">
      
      {/* HEADER SECTION */}
      <div className="border-b border-slate-200 pb-5">
        <div className="flex items-center gap-2.5">
          <Layers className="text-indigo-600" size={26} />
          <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-wide uppercase">
            Manage Variants
          </h1>
        </div>
        <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mt-1">
          Create and manage custom attribute options for your items
        </p>
      </div>

      {/* STREAMLINED FORM SECTION */}
      <div className="bg-white border border-slate-200 shadow-sm rounded-2xl p-5 md:p-6 max-w-2xl">
        <h2 className="text-sm font-black text-slate-900 uppercase tracking-wider mb-4 flex items-center gap-2">
          <PlusCircle size={16} className="text-indigo-600" />
          Add New Variant Name
        </h2>
        
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 items-end">
          {/* VARIANT NAME INPUT */}
          <div className="space-y-1.5 flex-1 w-full">
            <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-500">
              Variant Name / Size
            </label>
            <input
              type="text"
              name="size"
              placeholder="Ex: 1kg, 500ml, XL, Red"
              value={size}
              onChange={(e) => setSize(e.target.value)}
              className="border border-slate-200 bg-slate-50/50 p-2.5 rounded-xl w-full text-sm font-semibold outline-none focus:border-indigo-600 focus:bg-white transition"
              required
            />
          </div>

          {/* ACTION BUTTON */}
          <div className="w-full sm:w-auto">
            <button
              type="submit"
              disabled={loading}
              className="bg-indigo-600 hover:bg-indigo-700 text-white w-full sm:w-44 py-2.5 rounded-xl text-sm font-bold transition shadow-md shadow-indigo-600/10 flex items-center justify-center gap-2 disabled:opacity-50 whitespace-nowrap"
            >
              {loading ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  <span>Processing...</span>
                </>
              ) : (
                <span>Add Variant</span>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* SAVED VARIANTS MATRIX DISPLAY */}
      <div>
        <h2 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">
          Saved Variants ({variants.length})
        </h2>

        {fetchLoading ? (
          <div className="bg-white border border-slate-200 p-12 rounded-2xl text-center shadow-sm flex flex-col items-center justify-center gap-3 max-w-2xl">
            <Loader2 className="animate-spin text-indigo-600" size={28} />
            <span className="text-xs font-extrabold uppercase tracking-widest text-slate-400">Syncing Matrix...</span>
          </div>
        ) : variants.length === 0 ? (
          <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center text-slate-400 max-w-2xl">
            <Inbox className="mx-auto text-slate-300 mb-2" size={36} />
            <p className="text-xs font-extrabold uppercase tracking-widest">No Active Variants Configured</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {variants.map((variant) => (
              <div
                key={variant._id}
                className="bg-white rounded-2xl shadow-sm border border-slate-200 p-4 flex items-center justify-between hover:border-slate-300 transition-all"
              >
                {/* Variant Label Metric */}
                <span className="text-sm font-extrabold text-slate-900 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-100 truncate max-w-[70%]">
                  {variant.size}
                </span>

                {/* Trash Delete Control */}
                <button
                  onClick={() => deleteVariant(variant._id)}
                  title="Delete Variant"
                  className="h-8 w-8 rounded-xl bg-slate-50 hover:bg-rose-50 text-slate-400 hover:text-rose-600 flex items-center justify-center transition border border-slate-100 hover:border-rose-100 shrink-0"
                >
                  <Trash2 size={15} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}