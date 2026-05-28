import {
  useEffect,
  useState,
} from "react";

import api from "../api/api";

import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

import {
  Menu,
  X,
} from "lucide-react";

export default function Coupon() {

  const [coupons, setCoupons] =
    useState([]);

  const [sidebarOpen, setSidebarOpen] =
    useState(false);

  const [formData, setFormData] =
    useState({
      code: "",
      discountType:
        "percentage",
      discountValue: "",
      minOrderAmount: "",
      maxDiscount: "",
      expiryDate: "",
    });

  // ======================================
  // FETCH COUPONS
  // ======================================
  const fetchCoupons =
    async () => {

      try {

        const token =
          localStorage.getItem(
            "vendorToken"
          );

        const { data } =
          await api.get(
            "/coupons",
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

        setCoupons(
          data.coupons || []
        );

      } catch (error) {

        console.log(error);
      }
    };

  useEffect(() => {

    fetchCoupons();

  }, []);

  // ======================================
  // HANDLE CHANGE
  // ======================================
  const handleChange = (
    e
  ) => {

    setFormData({
      ...formData,
      [e.target.name]:
        e.target.value,
    });
  };

  // ======================================
  // CREATE COUPON
  // ======================================
  const handleSubmit =
    async (e) => {

      e.preventDefault();

      try {

        const token =
          localStorage.getItem(
            "vendorToken"
          );

        await api.post(
          "/coupons",
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        alert(
          "Coupon Created Successfully"
        );

        setFormData({
          code: "",
          discountType:
            "percentage",
          discountValue: "",
          minOrderAmount: "",
          maxDiscount: "",
          expiryDate: "",
        });

        fetchCoupons();

      } catch (error) {

        console.log(error);

        alert(
          error.response?.data
            ?.message ||
            "Failed to create coupon"
        );
      }
    };

  // ======================================
  // DELETE COUPON
  // ======================================
  const deleteCoupon =
    async (id) => {

      const confirmDelete =
        window.confirm(
          "Delete this coupon?"
        );

      if (!confirmDelete)
        return;

      try {

        const token =
          localStorage.getItem(
            "vendorToken"
          );

        await api.delete(
          `/coupons/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        alert(
          "Coupon Deleted Successfully"
        );

        fetchCoupons();

      } catch (error) {

        console.log(error);

        alert(
          error.response?.data
            ?.message ||
            "Failed to delete coupon"
        );
      }
    };

  return (

    <div className="flex min-h-screen bg-gray-100 overflow-hidden">

      {/* ======================================
          MOBILE OVERLAY
      ====================================== */}
      {sidebarOpen && (

        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() =>
            setSidebarOpen(false)
          }
        />

      )}

      {/* ======================================
          SIDEBAR
      ====================================== */}
      <div
        className={`
          fixed lg:static z-50 h-full
          transition-transform duration-300
          ${
            sidebarOpen
              ? "translate-x-0"
              : "-translate-x-full lg:translate-x-0"
          }
        `}
      >
        <Sidebar />
      </div>

      {/* ======================================
          MAIN CONTENT
      ====================================== */}
      <div className="flex-1 flex flex-col w-full overflow-hidden">

        {/* TOP NAV */}
        <div className="sticky top-0 z-30 bg-white shadow-sm">

          <div className="flex items-center">

            {/* MOBILE MENU */}
            <button
              onClick={() =>
                setSidebarOpen(
                  !sidebarOpen
                )
              }
              className="lg:hidden p-4"
            >
              {sidebarOpen ? (
                <X size={28} />
              ) : (
                <Menu size={28} />
              )}
            </button>

            <div className="flex-1">
              <Navbar />
            </div>

          </div>

        </div>

        {/* PAGE CONTENT */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6">

          {/* HEADER */}
          <div className="mb-8">

            <h1 className="text-2xl md:text-3xl font-bold">
              Coupons
            </h1>

            <p className="text-gray-500 mt-2 text-sm md:text-base">
              Create and manage discount coupons
            </p>

          </div>

          {/* ======================================
              CREATE COUPON FORM
          ====================================== */}
          <div className="bg-white rounded-3xl p-5 md:p-8 shadow mb-10">

            <h2 className="text-xl md:text-2xl font-bold mb-6">
              Create Coupon
            </h2>

            <form
              onSubmit={
                handleSubmit
              }
              className="grid grid-cols-1 md:grid-cols-2 gap-5"
            >

              {/* COUPON CODE */}
              <div>

                <label className="block mb-2 font-medium">
                  Coupon Code
                </label>

                <input
                  type="text"
                  name="code"
                  placeholder="SAVE20"
                  value={
                    formData.code
                  }
                  onChange={
                    handleChange
                  }
                  className="border p-4 rounded-xl w-full focus:outline-none focus:ring-2 focus:ring-black"
                  required
                />

              </div>

              {/* DISCOUNT TYPE */}
              <div>

                <label className="block mb-2 font-medium">
                  Discount Type
                </label>

                <select
                  name="discountType"
                  value={
                    formData.discountType
                  }
                  onChange={
                    handleChange
                  }
                  className="border p-4 rounded-xl w-full focus:outline-none focus:ring-2 focus:ring-black"
                >

                  <option value="percentage">
                    Percentage
                  </option>

                  <option value="fixed">
                    Fixed
                  </option>

                </select>

              </div>

              {/* DISCOUNT VALUE */}
              <div>

                <label className="block mb-2 font-medium">
                  Discount Value
                </label>

                <input
                  type="number"
                  name="discountValue"
                  placeholder="20"
                  value={
                    formData.discountValue
                  }
                  onChange={
                    handleChange
                  }
                  className="border p-4 rounded-xl w-full focus:outline-none focus:ring-2 focus:ring-black"
                  required
                />

              </div>

              {/* MIN ORDER */}
              <div>

                <label className="block mb-2 font-medium">
                  Minimum Order Amount
                </label>

                <input
                  type="number"
                  name="minOrderAmount"
                  placeholder="500"
                  value={
                    formData.minOrderAmount
                  }
                  onChange={
                    handleChange
                  }
                  className="border p-4 rounded-xl w-full focus:outline-none focus:ring-2 focus:ring-black"
                />

              </div>

              {/* MAX DISCOUNT */}
              <div>

                <label className="block mb-2 font-medium">
                  Maximum Discount
                </label>

                <input
                  type="number"
                  name="maxDiscount"
                  placeholder="200"
                  value={
                    formData.maxDiscount
                  }
                  onChange={
                    handleChange
                  }
                  className="border p-4 rounded-xl w-full focus:outline-none focus:ring-2 focus:ring-black"
                />

              </div>

              {/* EXPIRY DATE */}
              <div>

                <label className="block mb-2 font-medium">
                  Expiry Date
                </label>

                <input
                  type="date"
                  name="expiryDate"
                  value={
                    formData.expiryDate
                  }
                  onChange={
                    handleChange
                  }
                  className="border p-4 rounded-xl w-full focus:outline-none focus:ring-2 focus:ring-black"
                  required
                />

              </div>

              {/* BUTTON */}
              <div className="md:col-span-2">

                <button
                  type="submit"
                  className="bg-black hover:bg-gray-800 text-white py-4 px-8 rounded-xl font-semibold transition w-full md:w-auto"
                >
                  Create Coupon
                </button>

              </div>

            </form>

          </div>

          {/* ======================================
              COUPON LIST
          ====================================== */}
          <div className="bg-white rounded-3xl p-5 md:p-8 shadow">

            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">

              <h2 className="text-xl md:text-2xl font-bold">
                All Coupons
              </h2>

              <span className="bg-gray-100 px-4 py-2 rounded-full text-sm text-gray-600 w-fit">
                {coupons.length} Coupons
              </span>

            </div>

            {/* DESKTOP TABLE */}
            <div className="hidden lg:block overflow-x-auto">

              <table className="w-full">

                <thead>

                  <tr className="bg-gray-100 text-gray-700">

                    <th className="p-4 text-left rounded-l-xl">
                      Code
                    </th>

                    <th className="p-4 text-left">
                      Type
                    </th>

                    <th className="p-4 text-left">
                      Discount
                    </th>

                    <th className="p-4 text-left">
                      Expiry
                    </th>

                    <th className="p-4 text-left">
                      Status
                    </th>

                    <th className="p-4 text-left rounded-r-xl">
                      Action
                    </th>

                  </tr>

                </thead>

                <tbody>

                  {coupons.map(
                    (coupon) => (

                      <tr
                        key={
                          coupon._id
                        }
                        className="border-b hover:bg-gray-50"
                      >

                        <td className="p-4 font-bold">
                          {
                            coupon.code
                          }
                        </td>

                        <td className="p-4 capitalize">
                          {
                            coupon.discountType
                          }
                        </td>

                        <td className="p-4">
                          {
                            coupon.discountType ===
                            "percentage"
                              ? `${coupon.discountValue}%`
                              : `₹${coupon.discountValue}`
                          }
                        </td>

                        <td className="p-4">
                          {
                            new Date(
                              coupon.expiryDate
                            ).toLocaleDateString()
                          }
                        </td>

                        <td className="p-4">

                          <span
                            className={`px-3 py-1 rounded-full text-sm font-medium
                            ${
                              coupon.isActive
                                ? "bg-green-100 text-green-700"
                                : "bg-red-100 text-red-700"
                            }`}
                          >
                            {
                              coupon.isActive
                                ? "Active"
                                : "Inactive"
                            }
                          </span>

                        </td>

                        <td className="p-4">

                          <button
                            onClick={() =>
                              deleteCoupon(
                                coupon._id
                              )
                            }
                            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition"
                          >
                            Delete
                          </button>

                        </td>

                      </tr>
                    )
                  )}

                </tbody>

              </table>

            </div>

            {/* MOBILE + TABLET CARDS */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 lg:hidden">

              {coupons.map(
                (coupon) => (

                  <div
                    key={
                      coupon._id
                    }
                    className="border rounded-2xl p-5 hover:shadow-md transition"
                  >

                    <div className="flex items-start justify-between gap-3">

                      <div>

                        <h3 className="text-lg font-bold">
                          {
                            coupon.code
                          }
                        </h3>

                        <p className="text-gray-500 capitalize text-sm mt-1">
                          {
                            coupon.discountType
                          }{" "}
                          Discount
                        </p>

                      </div>

                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium
                        ${
                          coupon.isActive
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {
                          coupon.isActive
                            ? "Active"
                            : "Inactive"
                        }
                      </span>

                    </div>

                    <div className="mt-4 space-y-2 text-sm">

                      <p>
                        <span className="font-semibold">
                          Discount:
                        </span>{" "}
                        {
                          coupon.discountType ===
                          "percentage"
                            ? `${coupon.discountValue}%`
                            : `₹${coupon.discountValue}`
                        }
                      </p>

                      <p>
                        <span className="font-semibold">
                          Expiry:
                        </span>{" "}
                        {
                          new Date(
                            coupon.expiryDate
                          ).toLocaleDateString()
                        }
                      </p>

                    </div>

                    <button
                      onClick={() =>
                        deleteCoupon(
                          coupon._id
                        )
                      }
                      className="mt-5 w-full bg-red-500 hover:bg-red-600 text-white py-3 rounded-xl transition"
                    >
                      Delete Coupon
                    </button>

                  </div>
                )
              )}

            </div>

          </div>

        </div>

      </div>

    </div>
  );
}