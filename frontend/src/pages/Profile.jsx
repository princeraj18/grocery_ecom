// UserProfile.jsx

import React, { useEffect, useState } from "react";
import { useContext } from "react";
import { ShopContext } from "../context/ShopContext";
const UserProfile = () => {
  const [isEditing, setIsEditing] = useState(false);
const { user } = useContext(ShopContext);

  // User data fetched from registration/localStorage/API
  const [users, setUsers] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    gender: "",
    profileImage: "",
  });

  // Fetch user details after login/registration
  useEffect(() => {
    // Example: Fetch from localStorage
    const storedUser = JSON.parse(localStorage.getItem("user"));

    if (storedUser) {
      setUsers(storedUser);
    }
  }, []);

  // Handle Input Change
  const handleChange = (e) => {
    setUsers({
      ...users,
      [e.target.name]: e.target.value,
    });
  };

  // Save Updated Profile
  const handleSave = () => {
    localStorage.setItem("user", JSON.stringify(users));

    // Optional API Call
    // axios.put("/api/user/update", users)

    setIsEditing(false);
  };

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4">
      <div className="max-w-6xl mx-auto bg-white rounded-3xl shadow-xl overflow-hidden">

        {/* Banner */}
        <div className="h-52 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 relative">

          {/* Profile Image */}
          <div className="absolute -bottom-16 left-10">
            <img
              src={
                users.profileImage ||
                "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
              }
              alt="profile"
              className="w-32 h-32 rounded-full border-4 border-white shadow-lg object-cover"
            />
          </div>
        </div>

        {/* Main Content */}
        <div className="pt-24 px-10 pb-10">

          {/* Header */}
          <div className="flex flex-col md:flex-row md:justify-between md:items-center">

            <div>
              <h1 className="text-4xl font-bold text-gray-800">
                {user?.name} 
              </h1>

              <p className="text-gray-500 mt-2">
                Manage your ShopEase profile details
              </p>
            </div>

            <button
              onClick={() => {
                if (isEditing) {
                  handleSave();
                } else {
                  setIsEditing(true);
                }
              }}
              className="mt-6 md:mt-0 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl font-semibold transition"
            >
              {isEditing ? "Save Changes" : "Edit Profile"}
            </button>
          </div>

          {/* Profile Form */}
          <div className="grid md:grid-cols-2 gap-8 mt-12">

            {/* Left */}
            <div className="space-y-6">

              {/* Full Name */}
              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  Full Name
                </label>

                <input
                  type="text"
                  name="fullName"
                  value={users.fullName}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className={`w-full px-4 py-3 rounded-xl border ${
                    isEditing
                      ? "border-indigo-400 focus:ring-2 focus:ring-indigo-500"
                      : "bg-gray-100 border-gray-200"
                  } focus:outline-none`}
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  Email Address
                </label>

                <input
                  type="email"
                  name="email"
                  value={users.email}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className={`w-full px-4 py-3 rounded-xl border ${
                    isEditing
                      ? "border-indigo-400 focus:ring-2 focus:ring-indigo-500"
                      : "bg-gray-100 border-gray-200"
                  } focus:outline-none`}
                />
              </div>

              {/* Phone */}
              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  Phone Number
                </label>

                <input
                  type="text"
                  name="phone"
                  value={users.phone}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className={`w-full px-4 py-3 rounded-xl border ${
                    isEditing
                      ? "border-indigo-400 focus:ring-2 focus:ring-indigo-500"
                      : "bg-gray-100 border-gray-200"
                  } focus:outline-none`}
                />
              </div>

              {/* Gender */}
              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  Gender
                </label>

                <select
                  name="gender"
                  value={users.gender}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className={`w-full px-4 py-3 rounded-xl border ${
                    isEditing
                      ? "border-indigo-400 focus:ring-2 focus:ring-indigo-500"
                      : "bg-gray-100 border-gray-200"
                  } focus:outline-none`}
                >
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>

            {/* Right */}
            <div className="space-y-6">

              {/* Address */}
              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  Address
                </label>

                <input
                  type="text"
                  name="address"
                  value={users.address}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className={`w-full px-4 py-3 rounded-xl border ${
                    isEditing
                      ? "border-indigo-400 focus:ring-2 focus:ring-indigo-500"
                      : "bg-gray-100 border-gray-200"
                  } focus:outline-none`}
                />
              </div>

              {/* City */}
              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  City
                </label>

                <input
                  type="text"
                  name="city"
                  value={users.city}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className={`w-full px-4 py-3 rounded-xl border ${
                    isEditing
                      ? "border-indigo-400 focus:ring-2 focus:ring-indigo-500"
                      : "bg-gray-100 border-gray-200"
                  } focus:outline-none`}
                />
              </div>

              {/* State */}
              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  State
                </label>

                <input
                  type="text"
                  name="state"
                  value={users.state}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className={`w-full px-4 py-3 rounded-xl border ${
                    isEditing
                      ? "border-indigo-400 focus:ring-2 focus:ring-indigo-500"
                      : "bg-gray-100 border-gray-200"
                  } focus:outline-none`}
                />
              </div>

              {/* Pincode */}
              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  Pincode
                </label>

                <input
                  type="text"
                  name="pincode"
                  value={users.pincode}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className={`w-full px-4 py-3 rounded-xl border ${
                    isEditing
                      ? "border-indigo-400 focus:ring-2 focus:ring-indigo-500"
                      : "bg-gray-100 border-gray-200"
                  } focus:outline-none`}
                />
              </div>
            </div>
          </div>

          {/* Account Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-14">

            <div className="bg-indigo-50 p-6 rounded-2xl text-center">
              <h2 className="text-3xl font-bold text-indigo-600">24</h2>
              <p className="text-gray-600 mt-2">Total Orders</p>
            </div>

            <div className="bg-purple-50 p-6 rounded-2xl text-center">
              <h2 className="text-3xl font-bold text-purple-600">8</h2>
              <p className="text-gray-600 mt-2">Wishlist Items</p>
            </div>

            <div className="bg-pink-50 p-6 rounded-2xl text-center">
              <h2 className="text-3xl font-bold text-pink-600">3</h2>
              <p className="text-gray-600 mt-2">Saved Addresses</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;