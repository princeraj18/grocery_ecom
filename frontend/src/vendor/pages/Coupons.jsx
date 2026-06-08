import { useEffect, useState } from "react";
import api from "../api/api";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import { Menu, X, Trash2 } from "lucide-react";

export default function Coupon() {
  const [coupons, setCoupons] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [formData, setFormData] = useState({
    code: "",
    discountType: "percentage",
    discountValue: "",
    minOrderAmount: "",
    maxDiscount: "",
    expiryDate: "",
  });

  // ======================================
  // FETCH COUPONS
  // ======================================
  const fetchCoupons = async () => {
    try {
      const token = localStorage.getItem("vendorToken");
      const { data } = await api.get("/coupons", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setCoupons(data.coupons || []);
    } catch (error) {
      console.error("Error fetching coupons:", error);
    }
  };

  useEffect(() => {
    fetchCoupons();
  }, []);

  // ======================================
  // HANDLE CHANGE
  // ======================================
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // ======================================
  // CREATE COUPON
  // ======================================
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("vendorToken");
      await api.post("/coupons", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      alert("Coupon Created Successfully");
      setFormData({
        code: "",
        discountType: "percentage",
        discountValue: "",
        minOrderAmount: "",
        maxDiscount: "",
        expiryDate: "",
      });
      fetchCoupons();
    } catch (error) {
      console.error("Error creating coupon:", error);
      alert(error.response?.data?.message || "Failed to create coupon");
    }
  };

  // ======================================
  // DELETE COUPON
  // ======================================
  const deleteCoupon = async (id) => {
    const confirmDelete = window.confirm("Delete this coupon?");
    if (!confirmDelete) return;

    try {
      const token = localStorage.getItem("vendorToken");
      await api.delete(`/coupons/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      alert("Coupon Deleted Successfully");
      fetchCoupons();
    } catch (error) {
      console.error("Error deleting coupon:", error);
      alert(error.response?.data?.message || "Failed to delete coupon");
    }
  };

  return (
    <div className="flex h-screen w-screen bg-gray-100 overflow-hidden relative">
      {/* MOBILE OVERLAY */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden transition-opacity duration-300"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* SIDEBAR CONTAINER */}
      <div
        className={`fixed lg:static top-0 bottom-0 left-0 z-50 w-64 bg-white h-full shadow-lg lg:shadow-none transition-transform duration-300 ease-in-out ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <Sidebar />
      </div>

      {/* MAIN CONTENT AREA */}
      <div className="flex-1 flex flex-col h-full min-w-0 overflow-hidden">
        {/* TOP NAV */}
        <div className="sticky top-0 z-30 bg-white shadow-sm flex items-center h-16 px-2 lg:px-4">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="lg:hidden p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="Toggle Menu"
          >
            {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
          <div className="flex-1 min-w-0">
            <Navbar />
          </div>
        </div>

        {/* PAGE CONTENT CONTAINER */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-8">
          {/* HEADER */}
          <div className="mb-6">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Coupons</h1>
            <p className="text-gray-500 mt-1 text-sm md:text-base">
              Create and manage discount coupons
            </p>
          </div>

          {/* CREATE COUPON FORM */}
          <div className="bg-white rounded-2xl p-5 md:p-6 border border-gray-100 shadow-sm mb-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Create Coupon</h2>

            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* COUPON CODE */}
              <div>
                <label className="block mb-1.5 text-sm font-semibold text-gray-700">
                  Coupon Code
                </label>
                <input
                  type="text"
                  name="code"
                  placeholder="SAVE20"
                  value={formData.code}
                  onChange={handleChange}
                  className="border border-gray-300 px-4 py-2.5 rounded-xl w-full focus:outline-none focus:ring-2 focus:ring-black/5 focus:border-black text-gray-900 transition text-sm"
                  required
                />
              </div>

              {/* DISCOUNT TYPE */}
              <div>
                <label className="block mb-1.5 text-sm font-semibold text-gray-700">
                  Discount Type
                </label>
                <select
                  name="discountType"
                  value={formData.discountType}
                  onChange={handleChange}
                  className="border border-gray-300 px-4 py-2.5 rounded-xl w-full focus:outline-none focus:ring-2 focus:ring-black/5 focus:border-black text-gray-900 transition text-sm bg-white"
                >
                  <option value="percentage">Percentage (%)</option>
                  <option value="fixed">Fixed Amount (₹)</option>
                </select>
              </div>

              {/* DISCOUNT VALUE */}
              <div>
                <label className="block mb-1.5 text-sm font-semibold text-gray-700">
                  Discount Value
                </label>
                <input
                  type="number"
                  name="discountValue"
                  placeholder="20"
                  min="1"
                  value={formData.discountValue}
                  onChange={handleChange}
                  className="border border-gray-300 px-4 py-2.5 rounded-xl w-full focus:outline-none focus:ring-2 focus:ring-black/5 focus:border-black text-gray-900 transition text-sm"
                  required
                />
              </div>

              {/* MIN ORDER */}
              <div>
                <label className="block mb-1.5 text-sm font-semibold text-gray-700">
                  Minimum Order Amount
                </label>
                <input
                  type="number"
                  name="minOrderAmount"
                  placeholder="500"
                  min="0"
                  value={formData.minOrderAmount}
                  onChange={handleChange}
                  className="border border-gray-300 px-4 py-2.5 rounded-xl w-full focus:outline-none focus:ring-2 focus:ring-black/5 focus:border-black text-gray-900 transition text-sm"
                />
              </div>

              {/* MAX DISCOUNT */}
              <div>
                <label className="block mb-1.5 text-sm font-semibold text-gray-700">
                  Maximum Discount
                </label>
                <input
                  type="number"
                  name="maxDiscount"
                  placeholder="200"
                  min="0"
                  value={formData.maxDiscount}
                  onChange={handleChange}
                  className="border border-gray-300 px-4 py-2.5 rounded-xl w-full focus:outline-none focus:ring-2 focus:ring-black/5 focus:border-black text-gray-900 transition text-sm"
                  disabled={formData.discountType === "fixed"}
                />
              </div>

              {/* EXPIRY DATE */}
              <div>
                <label className="block mb-1.5 text-sm font-semibold text-gray-700">
                  Expiry Date
                </label>
                <input
                  type="date"
                  name="expiryDate"
                  value={formData.expiryDate}
                  onChange={handleChange}
                  className="border border-gray-300 px-4 py-2.5 rounded-xl w-full focus:outline-none focus:ring-2 focus:ring-black/5 focus:border-black text-gray-900 transition text-sm"
                  required
                />
              </div>

              {/* SUBMIT BUTTON */}
              <div className="md:col-span-2 pt-2">
                <button
                  type="submit"
                  className="bg-black hover:bg-gray-800 text-white py-3 px-6 rounded-xl font-semibold transition-all w-full md:w-auto text-sm shadow-sm active:scale-[0.99]"
                >
                  Create Coupon
                </button>
              </div>
            </form>
          </div>

          {/* COUPON LIST */}
          <div className="bg-white rounded-2xl p-5 md:p-6 border border-gray-100 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
              <h2 className="text-xl font-bold text-gray-800">All Coupons</h2>
              <span className="bg-gray-100 px-3 py-1.5 rounded-full text-xs sm:text-sm font-medium text-gray-600 w-fit border border-gray-200/50">
                {coupons.length} Coupons Available
              </span>
            </div>

            {/* DESKTOP TABLE VIEW */}
            <div className="hidden lg:block overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200 text-gray-600 text-sm">
                    <th className="p-4 text-left font-semibold rounded-l-xl">Code</th>
                    <th className="p-4 text-left font-semibold">Type</th>
                    <th className="p-4 text-left font-semibold">Discount</th>
                    <th className="p-4 text-left font-semibold">Expiry</th>
                    <th className="p-4 text-left font-semibold">Status</th>
                    <th className="p-4 text-left font-semibold rounded-r-xl">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-sm text-gray-700">
                  {coupons.map((coupon) => (
                    <tr key={coupon._id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="p-4 font-bold text-gray-900">{coupon.code}</td>
                      <td className="p-4 capitalize">{coupon.discountType}</td>
                      <td className="p-4 font-medium">
                        {coupon.discountType === "percentage"
                          ? `${coupon.discountValue}%`
                          : `₹${coupon.discountValue}`}
                      </td>
                      <td className="p-4">
                        {new Date(coupon.expiryDate).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </td>
                      <td className="p-4">
                        <span
                          className={`px-2.5 py-1 rounded-full text-xs font-medium border ${
                            coupon.isActive
                              ? "bg-green-50 text-green-700 border-green-100"
                              : "bg-red-50 text-red-700 border-red-100"
                          }`}
                        >
                          {coupon.isActive ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td className="p-4">
                        <button
                          onClick={() => deleteCoupon(coupon._id)}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50 p-2 rounded-lg transition-colors"
                          title="Delete Coupon"
                        >
                          <Trash2 size={18} />
                        </button>
                      </td>
                    </tr>
                  ))}
                  {coupons.length === 0 && (
                    <tr>
                      <td colSpan="6" className="text-center p-8 text-gray-500">
                        No coupons found. Create your first discount code above!
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* MOBILE CARD VIEW */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:hidden">
              {coupons.map((coupon) => (
                <div
                  key={coupon._id}
                  className="border border-gray-200 rounded-xl p-4 bg-gray-50/30 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-start justify-between gap-2 mb-3">
                      <h3 className="text-lg font-bold text-gray-900">{coupon.code}</h3>
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                          coupon.isActive
                            ? "bg-green-50 text-green-700 border-green-100"
                            : "bg-red-50 text-red-700 border-red-100"
                        }`}
                      >
                        {coupon.isActive ? "Active" : "Inactive"}
                      </span>
                    </div>

                    <div className="space-y-1.5 text-sm text-gray-600">
                      <p>
                        <span className="text-gray-400 font-medium">Type:</span>{" "}
                        <span className="capitalize">{coupon.discountType}</span>
                      </p>
                      <p>
                        <span className="text-gray-400 font-medium">Discount:</span>{" "}
                        <span className="font-semibold text-gray-800">
                          {coupon.discountType === "percentage"
                            ? `${coupon.discountValue}%`
                            : `₹${coupon.discountValue}`}
                        </span>
                      </p>
                      <p>
                        <span className="text-gray-400 font-medium">Expires:</span>{" "}
                        {new Date(coupon.expiryDate).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => deleteCoupon(coupon._id)}
                    className="mt-4 w-full border border-red-200 hover:border-red-300 text-red-600 hover:bg-red-50/50 py-2 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <Trash2 size={14} />
                    Delete Coupon
                  </button>
                </div>
              ))}
              {coupons.length === 0 && (
                <div className="text-center p-6 text-gray-500 sm:col-span-2">
                  No coupons found. Create your first discount code above!
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}