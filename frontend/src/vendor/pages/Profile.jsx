import React, {
  useEffect,
  useState,
} from "react";

import axios from "axios";

import Sidebar from "../components/Sidebar";

import Navbar from "../components/Navbar";

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

      <div className="flex">

        <Sidebar />

        <div className="flex-1 bg-gray-100 min-h-screen">

          <Navbar />

          <div className="p-10 text-xl font-semibold">
            Loading...
          </div>

        </div>

      </div>
    );
  }

  return (

    <div className="flex">

      {/* SIDEBAR */}
      <Sidebar />

      {/* MAIN */}
      <div className="flex-1 bg-gray-100 min-h-screen">

        <Navbar />

        <div className="p-6">

          {/* HEADING */}
          <h1 className="text-3xl font-bold mb-6">
            Vendor Profile
          </h1>

          {/* CARD */}
          <div className="bg-white rounded-2xl shadow p-8 max-w-4xl">

            <form
              onSubmit={handleSubmit}
              className="space-y-6"
            >

              {/* LOGO */}
              <div className="flex flex-col items-center">

                <img
                  src={
                    logoPreview ||
                    "https://via.placeholder.com/150"
                  }
                  alt="Vendor Logo"
                  className="w-32 h-32 rounded-full object-cover border-4 border-gray-200"
                />

                <input
                  type="file"
                  accept="image/*"
                  onChange={handleLogo}
                  className="mt-4"
                />

              </div>

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
                  className="w-full border p-3 rounded-lg"
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
                  className="w-full border p-3 rounded-lg"
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
                  className="w-full border p-3 rounded-lg bg-gray-100 cursor-not-allowed"
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
                  className="w-full border p-3 rounded-lg"
                />

              </div>

              {/* ADDRESS */}
              <div>

                <label className="block font-semibold mb-2">
                  Address
                </label>

                <textarea
                  name="address"
                  rows="4"
                  value={
                    formData.address
                  }
                  onChange={
                    handleChange
                  }
                  className="w-full border p-3 rounded-lg"
                />

              </div>

              {/* VERIFIED STATUS */}
              <div>

                <label className="block font-semibold mb-2">
                  Verification Status
                </label>

                <div
                  className={`inline-block px-4 py-2 rounded-full text-white font-semibold ${
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
              <button
                type="submit"
                disabled={updating}
                className="bg-black hover:bg-gray-800 text-white px-8 py-3 rounded-lg font-semibold"
              >
                {updating
                  ? "Updating..."
                  : "Update Profile"}
              </button>

            </form>

          </div>

        </div>

      </div>

    </div>
  );
}