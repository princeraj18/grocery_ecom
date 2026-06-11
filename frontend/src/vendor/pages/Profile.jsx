import React, { useEffect, useState } from "react";
import api from "../api/api"; // Centralized Axios instance for environmental routing consistency
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import { Menu, X, CheckCircle2, AlertCircle, Camera } from "lucide-react";

export default function Profile() {
  const [vendorId, setVendorId] = useState("");
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [logoPreview, setLogoPreview] = useState("");
  const [logo, setLogo] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [formData, setFormData] = useState({
    shopName: "",
    ownerName: "",
    email: "",
    phone: "",
    address: "",
    isVerified: false,
  });

  // ==========================================
  // FETCH PROFILE DATA
  // ==========================================
  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem("vendorToken");
      const { data } = await api.get("/vendors/profile", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setVendorId(data._id);
      setFormData({
        shopName: data.shopName || "",
        ownerName: data.ownerName || "",
        email: data.email || "",
        phone: data.phone || "",
        address: data.address || "",
        isVerified: data.isVerified || false,
      });
      setLogoPreview(data.logo || "");
    } catch (error) {
      console.error("Error loading profile:", error);
      alert(error.response?.data?.message || "Failed to load profile");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleLogo = (e) => {
    const file = e.target.files[0];
    if (file) {
      setLogo(file);
      setLogoPreview(URL.createObjectURL(file));
    }
  };

  // ==========================================
  // UPDATE PROFILE DISPATCH
  // ==========================================
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setUpdating(true);
      const token = localStorage.getItem("vendorToken");
      const data = new FormData();

      data.append("shopName", formData.shopName);
      data.append("ownerName", formData.ownerName);
      data.append("phone", formData.phone);
      data.append("address", formData.address);

      if (logo) {
        data.append("logo", logo);
      }

      const res = await api.put(`/vendors/${vendorId}`, data, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      alert(res.data.message || "Profile updated successfully!");
      fetchProfile();
    } catch (error) {
      console.error("Update failed:", error);
      alert(error.response?.data?.message || "Update failed");
    } finally {
      setUpdating(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  return (
    <div className="flex h-screen w-screen bg-gray-50 dark:bg-slate-950 overflow-hidden relative text-gray-900 dark:text-white font-sans">
      
      {/* MOBILE SIDEBAR OVERLAY */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden transition-opacity duration-300"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* SIDEBAR HOUSING */}
      <aside
        className={`fixed lg:static top-0 bottom-0 left-0 z-50 w-64 bg-white dark:bg-slate-900 h-full border-r border-gray-200 dark:border-slate-800 transition-transform duration-300 ease-in-out ${ sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0" }`}
      >
        <Sidebar />
      </aside>

      {/* MAIN VIEWPORT LAYOUT */}
      <div className="flex-1 flex flex-col h-full min-w-0 overflow-hidden">
        
        {/* TOP COMPONENT NAVBAR */}
        <header className="sticky top-0 z-30 bg-white dark:bg-slate-900 border-b border-gray-200 dark:border-slate-800 flex items-center h-16 px-4 flex-shrink-0">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="lg:hidden p-2 text-gray-600 dark:text-slate-400 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-lg transition-colors mr-2"
            aria-label="Toggle Navigation Menu"
          >
            {sidebarOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
          
          <div className="flex-1 min-w-0">
            <Navbar />
          </div>
        </header>

        {/* SCROLLABLE MAIN FORM VIEW */}
        <main className="flex-1 overflow-y-auto bg-gray-50/50 dark:bg-slate-950 p-4 sm:p-6 lg:p-8">
          <div className="max-w-4xl mx-auto">
            
            {/* SCREEN HEADER TITLE */}
            <div className="mb-8">
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                Vendor Profile
              </h1>
              <p className="text-gray-500 dark:text-slate-400 mt-1 text-xs sm:text-sm">
                Manage your store details, location parameters, and identity settings.
              </p>
            </div>

            {loading ? (
              /* PROFESSIONAL SKELETON PRELOADER */
              <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-xl p-6 sm:p-8 space-y-8 animate-pulse shadow-sm">
                <div className="flex flex-col items-center space-y-3">
                  <div className="w-32 h-32 rounded-full bg-gray-200 dark:bg-slate-800" />
                  <div className="h-4 w-28 bg-gray-200 dark:bg-slate-800 rounded" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="space-y-2">
                      <div className="h-3 w-20 bg-gray-200 dark:bg-slate-800 rounded" />
                      <div className="h-11 w-full bg-gray-100 dark:bg-slate-950 rounded-xl" />
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              /* MASTER FORM COMPONENT */
              <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-xl shadow-sm overflow-hidden">
                <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-8">
                  
                  {/* AVATAR LOGO UPLOADER SECTION */}
                  <div className="flex flex-col items-center">
                    <div className="relative group">
                      <div className="w-32 h-32 rounded-full overflow-hidden border-2 border-gray-200 dark:border-slate-800 shadow-inner bg-gray-50 dark:bg-slate-950">
                        <img
                          src={logoPreview || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150"}
                          alt="Vendor Business Logo"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <label className="absolute inset-0 bg-black/50 rounded-full flex flex-col items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200 cursor-pointer">
                        <Camera size={20} className="mb-1" />
                        <span className="text-[10px] font-medium tracking-wide uppercase">Change Logo</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleLogo}
                          className="hidden"
                        />
                      </label>
                    </div>
                    <p className="text-[11px] text-gray-400 dark:text-slate-500 mt-2">JPG, PNG, or WEBP. Max 2MB.</p>
                  </div>

                  {/* ACCOUNT DATA FORM CONTAINER */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    
                    {/* SHOP NAME ENTRY */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-gray-700 dark:text-slate-300 tracking-wide uppercase">
                        Shop Name
                      </label>
                      <input
                        type="text"
                        name="shopName"
                        value={formData.shopName}
                        onChange={handleChange}
                        required
                        className="w-full text-sm border border-gray-200 dark:border-slate-800 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500/20 focus:border-slate-600 dark:focus:border-slate-400 bg-white dark:bg-slate-900 text-gray-900 dark:text-slate-100 transition-all placeholder:text-gray-400"
                        placeholder="e.g., Apex Tech Labs"
                      />
                    </div>

                    {/* OWNER LEGAL NAME ENTRY */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-gray-700 dark:text-slate-300 tracking-wide uppercase">
                        Owner Name
                      </label>
                      <input
                        type="text"
                        name="ownerName"
                        value={formData.ownerName}
                        onChange={handleChange}
                        required
                        className="w-full text-sm border border-gray-200 dark:border-slate-800 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500/20 focus:border-slate-600 dark:focus:border-slate-400 bg-white dark:bg-slate-900 text-gray-900 dark:text-slate-100 transition-all placeholder:text-gray-400"
                        placeholder="John Doe"
                      />
                    </div>

                    {/* VENDOR REGISTERED EMAIL (STATIC IMMUTABLE RECORD) */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-gray-400 dark:text-slate-500 tracking-wide uppercase">
                        Email Address
                      </label>
                      <input
                        type="email"
                        value={formData.email}
                        disabled
                        className="w-full text-sm border border-gray-200 dark:border-slate-800 p-3 rounded-lg bg-gray-50 dark:bg-slate-950/40 text-gray-400 dark:text-slate-500 cursor-not-allowed select-none"
                      />
                    </div>

                    {/* ACCOUNT CONTACT PHONE */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-gray-700 dark:text-slate-300 tracking-wide uppercase">
                        Phone Number
                      </label>
                      <input
                        type="text"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className="w-full text-sm border border-gray-200 dark:border-slate-800 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500/20 focus:border-slate-600 dark:focus:border-slate-400 bg-white dark:bg-slate-900 text-gray-900 dark:text-slate-100 transition-all placeholder:text-gray-400"
                        placeholder="+91 XXXXX XXXXX"
                      />
                    </div>
                  </div>

                  {/* BUSINESS PHYSICAL OPERATIONS ADDRESS AREA */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-gray-700 dark:text-slate-300 tracking-wide uppercase">
                      Physical Store Address
                    </label>
                    <textarea
                      name="address"
                      rows="3"
                      value={formData.address}
                      onChange={handleChange}
                      className="w-full text-sm border border-gray-200 dark:border-slate-800 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500/20 focus:border-slate-600 dark:focus:border-slate-400 bg-white dark:bg-slate-900 text-gray-900 dark:text-slate-100 transition-all resize-none placeholder:text-gray-400"
                      placeholder="Enter complete storefront or warehousing location details..."
                    />
                  </div>

                  {/* BADGE IDENTITY ASSURANCE SYSTEM METRIC */}
                  <div className="pt-6 border-t border-gray-100 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="space-y-0.5">
                      <h4 className="text-xs font-semibold text-gray-800 dark:text-slate-200 tracking-wide uppercase">Verification Profile</h4>
                      <p className="text-[11px] text-gray-400 dark:text-slate-500">Verified vendors receive special priority badges in catalog marketplaces.</p>
                    </div>
                    
                    <div
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border ${ formData.isVerified ? "bg-emerald-50 border-emerald-200/60 text-emerald-700 dark:bg-emerald-950/20 dark:border-emerald-900/50 dark:text-emerald-400" : "bg-amber-50 border-amber-200/60 text-amber-700 dark:bg-amber-950/20 dark:border-amber-900/50 dark:text-amber-400" }`}
                    >
                      {formData.isVerified ? (
                        <>
                          <CheckCircle2 size={14} className="text-emerald-600 dark:text-emerald-400" />
                          <span>Verified Storefront</span>
                        </>
                      ) : (
                        <>
                          <AlertCircle size={14} className="text-amber-600 dark:text-amber-400" />
                          <span>Pending Verification</span>
                        </>
                      )}
                    </div>
                  </div>

                  {/* ACTION FORM DISPATCH ACTIONS */}
                  <div className="pt-6 border-t border-gray-100 dark:border-slate-800 flex justify-end">
                    <button
                      type="submit"
                      disabled={updating}
                      className="w-full sm:w-auto bg-slate-900 hover:bg-black dark:bg-slate-100 dark:hover:bg-white dark:text-slate-900 disabled:bg-gray-400 dark:disabled:bg-slate-700 dark:disabled:text-slate-400 text-white text-xs font-semibold tracking-wider uppercase px-6 py-3 rounded-lg transition-all active:scale-[0.98] shadow-sm flex items-center justify-center"
                    >
                      {updating ? "Saving Changes..." : "Update Details"}
                    </button>
                  </div>

                </form>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}