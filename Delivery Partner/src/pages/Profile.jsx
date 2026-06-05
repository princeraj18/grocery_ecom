import React, {
  useEffect,
  useState,
} from "react";

import axios from "axios";

export default function Profile() {

  const [partner, setPartner] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  const [formData, setFormData] =
    useState({
      name: "",
      phone: "",
      vehicleType: "",
      vehicleNumber: "",
      address: "",
    });

  const [profileImage, setProfileImage] =
    useState(null);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {

    try {

      const token =
        localStorage.getItem(
          "deliveryToken"
        );

      const res = await axios.get(
        "http://localhost:5000/api/delivery-partners/profile",
        {
          headers: {
            Authorization:
              `Bearer ${token}`,
          },
        }
      );

      if (res.data.success) {

        setPartner(res.data.partner);

        setFormData({
          name:
            res.data.partner.name || "",
          phone:
            res.data.partner.phone || "",
          vehicleType:
            res.data.partner
              .vehicleType || "",
          vehicleNumber:
            res.data.partner
              .vehicleNumber || "",
          address:
            res.data.partner
              .address || "",
        });
      }

    } catch (error) {

      console.log(error);

    } finally {

      setLoading(false);
    }
  };

  const handleChange = (e) => {

    setFormData({
      ...formData,
      [e.target.name]:
        e.target.value,
    });
  };

  const handleSubmit = async (e) => {

    e.preventDefault();

    try {

      const token =
        localStorage.getItem(
          "deliveryToken"
        );

      const data =
        new FormData();

      Object.keys(formData).forEach(
        (key) => {
          data.append(
            key,
            formData[key]
          );
        }
      );

      if (profileImage) {
        data.append(
          "profileImage",
          profileImage
        );
      }

      const res = await axios.put(
        "http://localhost:5000/api/delivery-partners/update-profile",
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

      if (res.data.success) {

        alert(
          "Profile updated successfully"
        );

        fetchProfile();
      }

    } catch (error) {

      console.log(error);
    }
  };

  if (loading) {
    return (
      <div className="text-white">
        Loading profile...
      </div>
    );
  }

  const initials =
    partner?.name
      ?.split(" ")
      ?.map((word) =>
        word[0]?.toUpperCase()
      )
      ?.join("")
      ?.slice(0, 2);

  return (
    <div className="space-y-6 max-w-2xl">

      <h1 className="text-2xl font-bold text-white">
        Rider Account
      </h1>

      <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 space-y-6">

        {/* Profile Header */}
        <div className="flex items-center gap-4">

          {partner?.profileImage ? (

            <img
              src={partner.profileImage}
              alt="profile"
              className="h-16 w-16 rounded-2xl object-cover"
            />

          ) : (

            <div className="h-16 w-16 bg-orange-500 rounded-2xl flex items-center justify-center text-2xl text-white font-bold">
              {initials}
            </div>
          )}

          <div>

            <h2 className="text-lg font-bold text-white">
              {partner?.name}
            </h2>

            <p className="text-sm text-slate-400">
              Delivery Partner #
              {partner?._id?.slice(-6)}
            </p>
          </div>
        </div>

        {/* Info */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-slate-800">

          <div>
            <span className="text-xs text-slate-500 block">
              Vehicle
            </span>

            <span className="text-sm font-medium text-slate-200 mt-0.5 block">
              {partner?.vehicleNumber} (
              {partner?.vehicleType})
            </span>
          </div>

          <div>
            <span className="text-xs text-slate-500 block">
              Rating
            </span>

            <span className="text-sm font-medium text-slate-200 mt-0.5 block">
              ⭐ {partner?.rating}
            </span>
          </div>

          <div>
            <span className="text-xs text-slate-500 block">
              Completed Deliveries
            </span>

            <span className="text-sm font-medium text-slate-200 mt-0.5 block">
              {partner?.completedDeliveries}
            </span>
          </div>

          <div>
            <span className="text-xs text-slate-500 block">
              Earnings
            </span>

            <span className="text-sm font-medium text-emerald-400 mt-0.5 block">
              ₹{partner?.earnings}
            </span>
          </div>
        </div>

        {/* Update Form */}
        <form
          onSubmit={handleSubmit}
          className="space-y-4 pt-6 border-t border-slate-800"
        >

          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Full Name"
            className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white"
          />

          <input
            type="text"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="Phone"
            className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white"
          />

          <input
            type="text"
            name="vehicleNumber"
            value={formData.vehicleNumber}
            onChange={handleChange}
            placeholder="Vehicle Number"
            className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white"
          />

          <select
            name="vehicleType"
            value={formData.vehicleType}
            onChange={handleChange}
            className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white"
          >
            <option value="Bike">
              Bike
            </option>

            <option value="Scooter">
              Scooter
            </option>

            <option value="Cycle">
              Cycle
            </option>
          </select>

          <input
            type="text"
            name="address"
            value={formData.address}
            onChange={handleChange}
            placeholder="Address"
            className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white"
          />

          <input
            type="file"
            onChange={(e) =>
              setProfileImage(
                e.target.files[0]
              )
            }
            className="w-full text-white"
          />

          <button
            type="submit"
            className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-xl font-semibold"
          >
            Update Profile
          </button>
        </form>
      </div>
    </div>
  );
}