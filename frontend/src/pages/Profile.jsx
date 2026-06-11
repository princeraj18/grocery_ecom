// UserProfile.jsx
import React, { useEffect, useState, useContext } from "react";
import { ShopContext } from "../context/ShopContext";
import { FaUser, FaEnvelope, FaPhone, FaMapMarkerAlt, FaCity, FaMap, FaKey, FaCamera, FaSave, FaEdit, FaTimes } from "react-icons/fa";

const UserProfile = () => {
  const { user } = useContext(ShopContext);
  const [isEditing, setIsEditing] = useState(false);

  // User state synchronized with your application data keys
  const [users, setUsers] = useState({
    name: "",
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

  // Hydrate local layout profile state cleanly
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser) {
      setUsers((prev) => ({
        ...prev,
        ...storedUser,
        // Fallback checks to ensure cross-compatible names render
        name: storedUser.name || storedUser.fullName || "",
        fullName: storedUser.fullName || storedUser.name || "",
      }));
    }
  }, []);

  // Handle standard profile updates
  const handleChange = (e) => {
    const { name, value } = e.target;
    setUsers((prev) => ({
      ...prev,
      [name]: value,
      ...(name === "fullName" ? { name: value } : {}),
    }));
  };

  // Convert profile image file attachments directly to local storage binary strings
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUsers((prev) => ({
          ...prev,
          profileImage: reader.result,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  // Persist updated records locally
  const handleSave = () => {
    localStorage.setItem("user", JSON.stringify(users));
    // Optional API Sync Hook: axios.put("/api/user/update", users)
    setIsEditing(false);
  };

  const handleCancel = () => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser) setUsers(storedUser);
    setIsEditing(false);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-12 px-4 sm:px-6 lg:px-8 transition-colors duration-200">
      <div className="max-w-4xl mx-auto bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800/80 overflow-hidden">
        
        {/* Decorative Brand Header Hero Area */}
        <div className="h-44 bg-gradient-to-r from-[#0c831f] via-emerald-600 to-yellow-500 relative">
          
          {/* Real Upload Trigger Image Context Avatar Container */}
          <div className="absolute -bottom-14 left-8 group">
            <div className="relative w-28 h-28 sm:w-32 sm:h-32 rounded-2xl overflow-hidden border-4 border-white dark:border-slate-900 shadow-md bg-slate-100 dark:bg-slate-800">
              <img
                src={users.profileImage || "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"}
                alt="Profile Workspace"
                className="w-full h-full object-cover"
              />
              {isEditing && (
                <label className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center text-white cursor-pointer transition-opacity opacity-0 group-hover:opacity-100">
                  <FaCamera className="text-xl mb-1" />
                  <span className="text-[10px] font-bold tracking-wider uppercase">Upload</span>
                  <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                </label>
              )}
            </div>
          </div>
        </div>

        {/* Identity Information Base Body */}
        <div className="pt-20 px-6 sm:px-8 pb-8">
          
          {/* Main Action Header Assembly */}
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 border-b border-slate-100 dark:border-slate-800/60 pb-6">
            <div>
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                {users.name || users.fullName || "User Account"}
              </h1>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                Manage your profile security settings and delivery configurations
              </p>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              {isEditing ? (
                <>
                  <button
                    onClick={handleCancel}
                    className="flex items-center gap-2 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 px-4 py-2.5 rounded-xl text-sm font-bold transition-all"
                  >
                    <FaTimes className="text-xs" /> Cancel
                  </button>
                  <button
                    onClick={handleSave}
                    className="flex items-center gap-2 bg-[#0c831f] hover:bg-[#096b19] dark:bg-emerald-600 dark:hover:bg-emerald-500 text-white px-4 py-2.5 rounded-xl text-sm font-black shadow-sm transition-all"
                  >
                    <FaSave className="text-sm" /> Save Changes
                  </button>
                </>
              ) : (
                <button
                  onClick={() => setIsEditing(true)}
                  className="flex items-center gap-2 bg-slate-900 hover:bg-slate-800 dark:bg-slate-100 dark:hover:bg-white text-white dark:text-slate-900 px-5 py-2.5 rounded-xl text-sm font-black shadow-sm transition-all"
                >
                  <FaEdit className="text-sm" /> Edit Profile
                </button>
              )}
            </div>
          </div>

          {/* Form Matrix Segment */}
          <div className="mt-8 space-y-8">
            
            {/* Form Section Group: Contact Data */}
            <div>
              <h3 className="text-xs font-black uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-4">Personal Records</h3>
              <div className="grid sm:grid-cols-2 gap-5">
                
                {/* Full Name */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">Full Name</label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-slate-400"><FaUser className="text-xs" /></span>
                    <input
                      type="text"
                      name="fullName"
                      value={users.fullName}
                      onChange={handleChange}
                      disabled={!isEditing}
                      placeholder="Enter full name"
                      className={`w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border focus:outline-none transition-all ${
                        isEditing
                          ? "border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:border-[#0c831f] dark:focus:border-emerald-500 ring-2 ring-transparent focus:ring-emerald-500/10"
                          : "border-slate-100 dark:border-slate-800/80 bg-slate-50 dark:bg-slate-950 text-slate-500 dark:text-slate-400 cursor-not-allowed"
                      }`}
                    />
                  </div>
                </div>

                {/* Email Address */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">Email Address</label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-slate-400"><FaEnvelope className="text-xs" /></span>
                    <input
                      type="email"
                      name="email"
                      value={users.email}
                      onChange={handleChange}
                      disabled={!isEditing}
                      placeholder="name@domain.com"
                      className={`w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border focus:outline-none transition-all ${
                        isEditing
                          ? "border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:border-[#0c831f] dark:focus:border-emerald-500 ring-2 ring-transparent focus:ring-emerald-500/10"
                          : "border-slate-100 dark:border-slate-800/80 bg-slate-50 dark:bg-slate-950 text-slate-500 dark:text-slate-400 cursor-not-allowed"
                      }`}
                    />
                  </div>
                </div>

                {/* Phone Number */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">Phone Number</label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-slate-400"><FaPhone className="text-xs" /></span>
                    <input
                      type="text"
                      name="phone"
                      value={users.phone}
                      onChange={handleChange}
                      disabled={!isEditing}
                      placeholder="Add phone number"
                      className={`w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border focus:outline-none transition-all ${
                        isEditing
                          ? "border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:border-[#0c831f] dark:focus:border-emerald-500 ring-2 ring-transparent focus:ring-emerald-500/10"
                          : "border-slate-100 dark:border-slate-800/80 bg-slate-50 dark:bg-slate-950 text-slate-500 dark:text-slate-400 cursor-not-allowed"
                      }`}
                    />
                  </div>
                </div>

                {/* Gender Options */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">Gender Identification</label>
                  <select
                    name="gender"
                    value={users.gender}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className={`w-full px-4 py-2.5 text-sm rounded-xl border focus:outline-none transition-all appearance-none bg-no-repeat bg-right pr-8 ${
                      isEditing
                        ? "border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:border-[#0c831f] dark:focus:border-emerald-500"
                        : "border-slate-100 dark:border-slate-800/80 bg-slate-50 dark:bg-slate-950 text-slate-500 dark:text-slate-400 cursor-not-allowed"
                    }`}
                  >
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Form Section Group: Shipping Destination Coordinates */}
            <div>
              <h3 className="text-xs font-black uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-4">Fulfillment Address Coordinates</h3>
              <div className="grid sm:grid-cols-2 gap-5">
                
                {/* Street Address Row Span across columns */}
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">Street Address</label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-slate-400"><FaMapMarkerAlt className="text-xs" /></span>
                    <input
                      type="text"
                      name="address"
                      value={users.address}
                      onChange={handleChange}
                      disabled={!isEditing}
                      placeholder="Apartment, suite, unit, building, floor, street details..."
                      className={`w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border focus:outline-none transition-all ${
                        isEditing
                          ? "border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:border-[#0c831f] dark:focus:border-emerald-500 ring-2 ring-transparent focus:ring-emerald-500/10"
                          : "border-slate-100 dark:border-slate-800/80 bg-slate-50 dark:bg-slate-950 text-slate-500 dark:text-slate-400 cursor-not-allowed"
                      }`}
                    />
                  </div>
                </div>

                {/* City */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">City</label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-slate-400"><FaCity className="text-xs" /></span>
                    <input
                      type="text"
                      name="city"
                      value={users.city}
                      onChange={handleChange}
                      disabled={!isEditing}
                      placeholder="Patna"
                      className={`w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border focus:outline-none transition-all ${
                        isEditing
                          ? "border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:border-[#0c831f] dark:focus:border-emerald-500 ring-2 ring-transparent focus:ring-emerald-500/10"
                          : "border-slate-100 dark:border-slate-800/80 bg-slate-50 dark:bg-slate-950 text-slate-500 dark:text-slate-400 cursor-not-allowed"
                      }`}
                    />
                  </div>
                </div>

                {/* State */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">State</label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-slate-400"><FaMap className="text-xs" /></span>
                    <input
                      type="text"
                      name="state"
                      value={users.state}
                      onChange={handleChange}
                      disabled={!isEditing}
                      placeholder="Bihar"
                      className={`w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border focus:outline-none transition-all ${
                        isEditing
                          ? "border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:border-[#0c831f] dark:focus:border-emerald-500 ring-2 ring-transparent focus:ring-emerald-500/10"
                          : "border-slate-100 dark:border-slate-800/80 bg-slate-50 dark:bg-slate-950 text-slate-500 dark:text-slate-400 cursor-not-allowed"
                      }`}
                    />
                  </div>
                </div>

                {/* Pincode */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">Postal Zip Code / Pincode</label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-slate-400"><FaKey className="text-xs" /></span>
                    <input
                      type="text"
                      name="pincode"
                      value={users.pincode}
                      onChange={handleChange}
                      disabled={!isEditing}
                      placeholder="800001"
                      className={`w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border focus:outline-none transition-all ${
                        isEditing
                          ? "border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:border-[#0c831f] dark:focus:border-emerald-500 ring-2 ring-transparent focus:ring-emerald-500/10"
                          : "border-slate-100 dark:border-slate-800/80 bg-slate-50 dark:bg-slate-950 text-slate-500 dark:text-slate-400 cursor-not-allowed"
                      }`}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;