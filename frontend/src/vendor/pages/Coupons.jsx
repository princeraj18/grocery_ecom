import {
  useEffect,
  useState,
} from "react";

import api from "../api/api";

import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

export default function Coupon() {

  const [coupons, setCoupons] =
    useState([]);

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
          data.coupons
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
alert("Coupon Created Successfully");
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
      }
    };

  // ======================================
  // DELETE COUPON
  // ======================================
  const deleteCoupon =
    async (id) => {

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
alert("Coupon Deleted Successfully");
        fetchCoupons();

      } catch (error) {

        console.log(error);
      }
    };

  return (

    <div className="flex bg-gray-100 min-h-screen">

      <Sidebar />

      <div className="flex-1">

        <Navbar />

        <div className="p-6">

          {/* HEADER */}
          <div className="mb-8">

            <h1 className="text-3xl font-bold">
              Coupons
            </h1>

            <p className="text-gray-500 mt-2">
              Create and manage coupons
            </p>

          </div>

          {/* FORM */}
          <div className="bg-white rounded-3xl p-6 shadow mb-10">

            <h2 className="text-2xl font-bold mb-6">
              Create Coupon
            </h2>

            <form
              onSubmit={
                handleSubmit
              }
              className="grid grid-cols-1 md:grid-cols-2 gap-5"
            >

              <input
                type="text"
                name="code"
                placeholder="Coupon Code"
                value={
                  formData.code
                }
                onChange={
                  handleChange
                }
                className="border p-4 rounded-xl"
                required
              />

              <select
                name="discountType"
                value={
                  formData.discountType
                }
                onChange={
                  handleChange
                }
                className="border p-4 rounded-xl"
              >

                <option value="percentage">
                  Percentage
                </option>

                <option value="fixed">
                  Fixed
                </option>

              </select>

              <input
                type="number"
                name="discountValue"
                placeholder="Discount Value"
                value={
                  formData.discountValue
                }
                onChange={
                  handleChange
                }
                className="border p-4 rounded-xl"
                required
              />

              <input
                type="number"
                name="minOrderAmount"
                placeholder="Minimum Order"
                value={
                  formData.minOrderAmount
                }
                onChange={
                  handleChange
                }
                className="border p-4 rounded-xl"
              />

              <input
                type="number"
                name="maxDiscount"
                placeholder="Maximum Discount"
                value={
                  formData.maxDiscount
                }
                onChange={
                  handleChange
                }
                className="border p-4 rounded-xl"
              />

              <input
                type="date"
                name="expiryDate"
                value={
                  formData.expiryDate
                }
                onChange={
                  handleChange
                }
                className="border p-4 rounded-xl"
                required
              />

              <button
                type="submit"
                className="bg-black text-white py-4 rounded-xl font-semibold hover:bg-gray-800 transition"
              >
                Create Coupon
              </button>

            </form>

          </div>

          {/* COUPONS TABLE */}
          <div className="bg-white rounded-3xl p-6 shadow">

            <h2 className="text-2xl font-bold mb-6">
              All Coupons
            </h2>

            <div className="overflow-x-auto">

              <table className="w-full">

                <thead>

                  <tr className="bg-gray-100">

                    <th className="p-4 text-left">
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

                    <th className="p-4 text-left">
                      Action
                    </th>

                  </tr>

                </thead>

                <tbody>

                  {
                    coupons.map(
                      (coupon) => (

                        <tr
                          key={
                            coupon._id
                          }
                          className="border-b"
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
                              coupon.discountValue
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
                              className={`px-3 py-1 rounded-full text-sm
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
                              className="bg-red-500 text-white px-4 py-2 rounded-lg"
                            >
                              Delete
                            </button>

                          </td>

                        </tr>
                      )
                    )
                  }

                </tbody>

              </table>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
}