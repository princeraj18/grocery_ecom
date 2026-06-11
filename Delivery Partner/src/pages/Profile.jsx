import React, { useEffect, useState } from "react";
import axios from "axios";
import { User, Phone, MapPin, Truck, Star, CheckCircle, IndianRupee, Camera } from "lucide-react";

export default function Profile() {
  const [partner, setPartner] = useState(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    vehicleType: "",
    vehicleNumber: "",
    address: "",
  });
  const [profileImage, setProfileImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem("deliveryToken");
      const res = await axios.get(
        "http://localhost:5000/api/delivery-partners/profile",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (res.data.success) {
        setPartner(res.data.partner);
        setFormData({
          name: res.data.partner.name || "",
          phone: res.data.partner.phone || "",
          vehicleType: res.data.partner.vehicleType || "",
          vehicleNumber: res.data.partner.vehicleNumber || "",
          address: res.data.partner.address || "",
        });
      }
    } catch (error) {
      console.log("Error fetching profile:", error);
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

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfileImage(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("deliveryToken");
      const data = new FormData();

      Object.keys(formData).forEach((key) => {
        data.append(key, formData[key]);
      });

      if (profileImage) {
        data.append("profileImage", profileImage);
      }

      const res = await axios.put(
        "http://localhost:5000/api/delivery-partners/update-profile",
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (res.data.success) {
        alert("Profile updated successfully");
        fetchProfile();
      }
    } catch (error) {
      console.log("Error updating profile:", error);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6 max-w-2xl mx-auto p-4 sm:p-6 animate-pulse">
        <div className="h-8 bg-gray-200 dark:bg-slate-800 rounded-lg w-1/3" />
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-gray-100 space-y-6 h-96" />
      </div>
    );
  }

  const initials = partner?.name
    ?.split(" ")
    ?.map((word) => word[0]?.toUpperCase())
    ?.join("")
    ?.slice(0, 2);

  return (
    <div className="p-4 sm:p-6 max-w-2xl dark:bg-slate-900/20 mx-auto space-y-6 font-poppins bg-gray-50/20 min-h-screen">
      <div>
        <h1 className="text-xl font-bold text-gray-900 dark:text-white uppercase tracking-wider">
          Rider Account
        </h1>
        <p className="text-[10px] text-gray-400 dark:text-slate-500 dark:text-slate-400 font-bold uppercase tracking-widest mt-1">
          Manage your operational credentials and profile options
        </p>
      </div>

      {/* Main Form White Card Container */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-gray-200 dark:border-slate-800/60 shadow-sm space-y-8">
        
        {/* Profile Header section */}
        <div className="flex flex-col sm:flex-row items-center gap-5">
          <div className="relative group">
            {previewUrl || partner?.profileImage ? (
              <img
                src={previewUrl || partner.profileImage}
                alt="profile"
                className="h-20 w-20 rounded-2xl object-cover ring-4 ring-gray-50 border border-gray-100"
              />
            ) : (
              <div className="h-20 w-20 bg-orange-500 rounded-2xl flex items-center justify-center text-2xl text-white font-black shadow-sm">
                {initials}
              </div>
            )}
            <label className="absolute -bottom-1.5 -right-1.5 p-1.5 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-lg shadow-sm cursor-pointer hover:bg-gray-50 transition-colors block">
              <Camera size={12} className="text-gray-500 dark:text-slate-400" />
              <input type="file" onChange={handleFileChange} className="hidden" accept="image/*" />
            </label>
          </div>

          <div className="text-center sm:text-left">
            <h2 className="text-lg font-black text-gray-900 dark:text-white tracking-wide">
              {partner?.name}
            </h2>
            <p className="text-[10px] text-gray-400 dark:text-slate-500 dark:text-slate-400 font-bold uppercase tracking-widest mt-0.5">
              Partner ID: #{partner?._id?.slice(-6).toUpperCase()}
            </p>
          </div>
        </div>

        {/* Operational Performance Stat Readouts */}
        <div className="grid grid-cols-2 dark:bg-slate-900/20 sm:grid-cols-4 gap-4 p-4 bg-gray-50/50 rounded-xl border border-gray-100">
          <div>
            <span className="text-[9px] font-bold text-gray-400 dark:text-slate-500 dark:text-slate-400 uppercase tracking-wider flex items-center gap-1">
              <Truck size={10} className="text-gray-400 dark:text-slate-500 dark:text-slate-400" /> Vehicle
            </span>
            <span className="text-xs font-bold text-gray-800 dark:text-slate-100 mt-1 block truncate">
              {partner?.vehicleNumber || "N/A"}
            </span>
            <span className="text-[9px] text-gray-400 dark:text-slate-500 dark:text-slate-400 font-medium lowercase">
              ({partner?.vehicleType || "not set"})
            </span>
          </div>

          <div>
            <span className="text-[9px] font-bold text-gray-400 dark:text-slate-500 dark:text-slate-400 uppercase tracking-wider flex items-center gap-1">
              <Star size={10} className="text-amber-500 fill-amber-500" /> Metrics
            </span>
            <span className="text-xs font-bold text-gray-800 dark:text-slate-100 mt-1 block">
              ⭐ {partner?.rating || "5.0"}
            </span>
            <span className="text-[9px] text-gray-400 dark:text-slate-500 dark:text-slate-400 font-medium">Rating Level</span>
          </div>

          <div>
            <span className="text-[9px] font-bold text-gray-400 dark:text-slate-500 dark:text-slate-400 uppercase tracking-wider flex items-center gap-1">
              <CheckCircle size={10} className="text-emerald-500" /> Duties
            </span>
            <span className="text-xs font-bold text-gray-800 dark:text-slate-100 mt-1 block">
              {partner?.completedDeliveries || 0} Trips
            </span>
            <span className="text-[9px] text-gray-400 dark:text-slate-500 dark:text-slate-400 font-medium">Closed Logs</span>
          </div>

          <div>
            <span className="text-[9px] font-bold text-gray-400 dark:text-slate-500 dark:text-slate-400 uppercase tracking-wider flex items-center gap-1">
              <IndianRupee size={10} className="text-emerald-500" /> Balance
            </span>
            <span className="text-xs font-bold text-emerald-600 mt-1 block">
              ₹{(partner?.earnings || 0).toLocaleString("en-IN")}
            </span>
            <span className="text-[9px] text-gray-400 dark:text-slate-500 dark:text-slate-400 font-medium">Gross Wallet</span>
          </div>
        </div>

        {/* Form Inputs Grid Block */}
        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-gray-400 dark:text-slate-500 dark:text-slate-400 uppercase tracking-wider block">Full Name</label>
              <div className="relative">
                <User size={14} className="absolute left-3.5 top-3.5 text-gray-400 dark:text-slate-500 dark:text-slate-400" />
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="John Doe"
                  className="w-full bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800/80 rounded-xl pl-10 pr-4 py-2.5 text-xs font-medium text-gray-800 dark:text-slate-100 focus:outline-none focus:border-gray-300 dark:border-slate-700 transition-colors placeholder:text-gray-300"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-gray-400 dark:text-slate-500 dark:text-slate-400 uppercase tracking-wider block">Phone Number</label>
              <div className="relative">
                <Phone size={14} className="absolute left-3.5 top-3.5 text-gray-400 dark:text-slate-500 dark:text-slate-400" />
                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+91 XXXXX XXXXX"
                  className="w-full bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800/80 rounded-xl pl-10 pr-4 py-2.5 text-xs font-medium text-gray-800 dark:text-slate-100 focus:outline-none focus:border-gray-300 dark:border-slate-700 transition-colors placeholder:text-gray-300"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-gray-400 dark:text-slate-500 dark:text-slate-400 uppercase tracking-wider block">Vehicle Plate Registration</label>
              <div className="relative">
                <Truck size={14} className="absolute left-3.5 top-3.5 text-gray-400 dark:text-slate-500 dark:text-slate-400" />
                <input
                  type="text"
                  name="vehicleNumber"
                  value={formData.vehicleNumber}
                  onChange={handleChange}
                  placeholder="BR-01-XXXX"
                  className="w-full bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800/80 rounded-xl pl-10 pr-4 py-2.5 text-xs font-medium text-gray-800 dark:text-slate-100 focus:outline-none focus:border-gray-300 dark:border-slate-700 transition-colors placeholder:text-gray-300"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-gray-400 dark:text-slate-500 dark:text-slate-400 uppercase tracking-wider block">Vehicle Transport Mode</label>
              <select
                name="vehicleType"
                value={formData.vehicleType}
                onChange={handleChange}
                className="w-full bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800/80 rounded-xl px-4 py-2.5 text-xs font-medium text-gray-800 dark:text-slate-100 focus:outline-none focus:border-gray-300 dark:border-slate-700 transition-colors appearance-none cursor-pointer"
              >
                <option value="Bike">Bike</option>
                <option value="Scooter">Scooter</option>
                <option value="Cycle">Cycle</option>
              </select>
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-bold text-gray-400 dark:text-slate-500 dark:text-slate-400 uppercase tracking-wider block">Base Hub / Address</label>
            <div className="relative">
              <MapPin size={14} className="absolute left-3.5 top-3.5 text-gray-400 dark:text-slate-500 dark:text-slate-400" />
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="Operational Base Location Address"
                className="w-full bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800/80 rounded-xl pl-10 pr-4 py-2.5 text-xs font-medium text-gray-800 dark:text-slate-100 focus:outline-none focus:border-gray-300 dark:border-slate-700 transition-colors placeholder:text-gray-300"
              />
            </div>
          </div>

          {/* Action Submission Trigger */}
          <div className="pt-4 flex justify-end">
            <button
              type="submit"
              className="w-full sm:w-auto bg-orange-500 hover:bg-orange-600 active:scale-[0.99] text-white text-[11px] font-bold uppercase tracking-wider px-6 py-3 rounded-xl transition-all shadow-sm"
            >
              Update Profile
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}