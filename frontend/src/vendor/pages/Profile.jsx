import React, {
  useEffect,
  useState,
} from "react";

import axios from "axios";

import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

import {
  Menu,
  X,
} from "lucide-react";

export default function Profile() {

  const [vendorId, setVendorId] =
    useState("");

  const [loading, setLoading] =
    useState(true);

  const [updating, setUpdating] =
    useState(false);

  const [logoPreview, setLogoPreview] =
    useState("");

  const [logo, setLogo] =
    useState(null);

  // MOBILE SIDEBAR
  const [sidebarOpen, setSidebarOpen] =
    useState(false);

  const [formData, setFormData] =
    useState({
      shopName: "",
      ownerName: "",
      email: "",
      phone: "",
      address: "",
      isVerified: false,
    });

  // ==========================================
  // FETCH PROFILE
  // ==========================================
  const fetchProfile =
    async () => {

      try {

        const token =
          localStorage.getItem(
            "vendorToken"
          );

        const { data } =
          await axios.get(
            "http://localhost:5000/api/vendors/profile",
            {
              headers: {
                Authorization:
                  `Bearer ${token}`,
              },
            }
          );

        setVendorId(data._id);

        setFormData({
          shopName:
            data.shopName || "",

          ownerName:
            data.ownerName || "",

          email:
            data.email || "",

          phone:
            data.phone || "",

          address:
            data.address || "",

          isVerified:
            data.isVerified || false,
        });

        setLogoPreview(
          data.logo || ""
        );

      } catch (error) {

        console.log(error);

        alert(
          "Failed to load profile"
        );

      } finally {

        setLoading(false);
      }
    };

  // ==========================================
  // HANDLE CHANGE
  // ==========================================
  const handleChange = (e) => {

    setFormData({
      ...formData,
      [e.target.name]:
        e.target.value,
    });
  };

  // ==========================================
  // HANDLE LOGO
  // ==========================================
  const handleLogo = (e) => {

    const file =
      e.target.files[0];

    if (file) {

      setLogo(file);

      setLogoPreview(
        URL.createObjectURL(file)
      );
    }
  };

  // ==========================================
  // UPDATE PROFILE
  // ==========================================
  const handleSubmit =
    async (e) => {

      e.preventDefault();

      try {

        setUpdating(true);

        const token =
          localStorage.getItem(
            "vendorToken"
          );

        const data =
          new FormData();

        data.append(
          "shopName",
          formData.shopName
        );

        data.append(
          "ownerName",
          formData.ownerName
        );

        data.append(
          "phone",
          formData.phone
        );

        data.append(
          "address",
          formData.address
        );

        if (logo) {

          data.append(
            "logo",
            logo
          );
        }

        const res =
          await axios.put(
            `http://localhost:5000/api/vendors/${vendorId}`,
            data,
            {
              headers: {
                Authorization:
                  `Bearer ${token}`,

                "Content-Type":
                  "multipart/form-data",
              },
            }
          );

        alert(
          res.data.message
        );

        fetchProfile();

      } catch (error) {

        console.log(error);

        alert(
          error.response?.data
            ?.message ||
            "Update failed"
        );

      } finally {

        setUpdating(false);
      }
    };

  useEffect(() => {

    fetchProfile();

  }, []);

  // ==========================================
  // LOADING
  // ==========================================
  if (loading) {

    return (

      <div className="flex bg-gray-100 min-h-screen">

       

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

      </div>
    );
  }

  return (

    <div className="flex bg-gray-100 min-h-screen overflow-hidden">

      {/* ===================================== */}
      {/* DESKTOP SIDEBAR */}
      {/* ===================================== */}
      <div className="hidden lg:block">

        <Sidebar />

      </div>

      {/* ===================================== */}
      {/* MOBILE SIDEBAR */}
      {/* ===================================== */}
      {sidebarOpen && (

        <>

          {/* OVERLAY */}
          <div
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            onClick={() =>
              setSidebarOpen(false)
            }
          />

          {/* SIDEBAR */}
          <div className="fixed top-0 left-0 z-50 h-full lg:hidden">

            <Sidebar />

          </div>

        </>
      )}

      {/* ===================================== */}
      {/* MAIN */}
      {/* ===================================== */}
      <div className="flex-1 flex flex-col overflow-hidden">

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

        {/* CONTENT */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6">

          {/* HEADING */}
          <div className="mb-6">

            <h1 className="hidden lg:block text-3xl font-bold">
              Vendor Profile
            </h1>

            <p className="text-gray-500 mt-2">
              Manage your vendor details
            </p>

          </div>

          {/* CARD */}
          <div className="bg-white rounded-3xl shadow-lg p-5 sm:p-8 max-w-5xl mx-auto">

            <form
              onSubmit={handleSubmit}
              className="space-y-8"
            >

              {/* PROFILE IMAGE */}
              <div className="flex flex-col items-center">

                <div className="relative">

                  <img
                    src={
                      logoPreview ||
                      "https://via.placeholder.com/150"
                    }
                    alt="Vendor Logo"
                    className="w-32 h-32 sm:w-40 sm:h-40 rounded-full object-cover border-4 border-gray-200 shadow"
                  />

                </div>

                <label className="mt-5 cursor-pointer bg-black text-white px-5 py-2 rounded-xl hover:bg-gray-800 transition">

                  Change Logo

                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleLogo}
                    className="hidden"
                  />

                </label>

              </div>

              {/* FORM GRID */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                {/* SHOP NAME */}
                <div>

                  <label className="block font-semibold mb-2">
                    Shop Name
                  </label>

                  <input
                    type="text"
                    name="shopName"
                    value={
                      formData.shopName
                    }
                    onChange={
                      handleChange
                    }
                    className="w-full border border-gray-300 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-black"
                  />

                </div>

                {/* OWNER NAME */}
                <div>

                  <label className="block font-semibold mb-2">
                    Owner Name
                  </label>

                  <input
                    type="text"
                    name="ownerName"
                    value={
                      formData.ownerName
                    }
                    onChange={
                      handleChange
                    }
                    className="w-full border border-gray-300 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-black"
                  />

                </div>

                {/* EMAIL */}
                <div>

                  <label className="block font-semibold mb-2">
                    Email
                  </label>

                  <input
                    type="email"
                    value={
                      formData.email
                    }
                    disabled
                    className="w-full border border-gray-300 p-3 rounded-xl bg-gray-100 cursor-not-allowed"
                  />

                </div>

                {/* PHONE */}
                <div>

                  <label className="block font-semibold mb-2">
                    Phone
                  </label>

                  <input
                    type="text"
                    name="phone"
                    value={
                      formData.phone
                    }
                    onChange={
                      handleChange
                    }
                    className="w-full border border-gray-300 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-black"
                  />

                </div>

              </div>

              {/* ADDRESS */}
              <div>

                <label className="block font-semibold mb-2">
                  Address
                </label>

                <textarea
                  name="address"
                  rows="5"
                  value={
                    formData.address
                  }
                  onChange={
                    handleChange
                  }
                  className="w-full border border-gray-300 p-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-black"
                />

              </div>

              {/* VERIFICATION */}
              <div>

                <label className="block font-semibold mb-3">
                  Verification Status
                </label>

                <div
                  className={`inline-flex items-center px-5 py-2 rounded-full text-white font-semibold ${
                    formData.isVerified
                      ? "bg-green-500"
                      : "bg-red-500"
                  }`}
                >
                  {formData.isVerified
                    ? "Verified"
                    : "Not Verified"}
                </div>

              </div>

              {/* BUTTON */}
              <div className="flex justify-center sm:justify-start">

                <button
                  type="submit"
                  disabled={updating}
                  className="w-full sm:w-auto bg-black hover:bg-gray-800 text-white px-10 py-3 rounded-xl font-semibold transition"
                >
                  {updating
                    ? "Updating..."
                    : "Update Profile"}
                </button>

              </div>

            </form>

          </div>

        </div>

      </div>

    </div>
  );
}