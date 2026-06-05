import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function DeliveryRegister() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    vehicleType: 'Bike', // Defaults to 'Bike' matching schema initialization
    vehicleNumber: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await axios.post('http://localhost:5000/api/delivery-partners/register', formData);

      if (response.data.success) {
        // Safe storage of auto-login values
        localStorage.setItem('deliveryToken', response.data.token);
        localStorage.setItem('deliveryPartner', JSON.stringify(response.data.partner));
        
        // Push user onto the localized view layout context
        navigate('/');
        window.location.reload();
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please check your network or inputs.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 py-12">
      <div className="bg-slate-900 p-8 rounded-2xl w-full max-w-lg border border-slate-800 shadow-xl">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-white">Join the Fleet</h2>
          <p className="text-slate-400 mt-2">Earn on your own schedule</p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 text-red-400 text-sm rounded-xl text-center">
            {error}
          </div>
        )}

        <form className="space-y-5" onSubmit={handleRegister}>
          {/* Row 1: Profile Identifiers */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Full Name</label>
              <input 
                type="text" 
                name="name"
                required
                value={formData.name}
                onChange={handleInputChange}
                placeholder="John Doe" 
                className="w-full px-4 py-3 rounded-xl bg-slate-800 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-orange-500" 
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Phone Number</label>
              <input 
                type="tel" 
                name="phone"
                required
                value={formData.phone}
                onChange={handleInputChange}
                placeholder="+123456789" 
                className="w-full px-4 py-3 rounded-xl bg-slate-800 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-orange-500" 
              />
            </div>
          </div>

          {/* Row 2: Electronic Communication Mail handle */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Email Address</label>
            <input 
              type="email" 
              name="email"
              required
              value={formData.email}
              onChange={handleInputChange}
              placeholder="driver@fastdrop.com" 
              className="w-full px-4 py-3 rounded-xl bg-slate-800 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-orange-500" 
            />
          </div>

          {/* Row 3: Machinery Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Vehicle Type</label>
              <select 
                name="vehicleType"
                value={formData.vehicleType}
                onChange={handleInputChange}
                className="w-full px-4 py-3 rounded-xl bg-slate-800 border border-slate-700 text-white focus:outline-none focus:border-orange-500 bg-[image:none]"
              >
                <option value="Bike">Bike (Bicycle)</option>
                <option value="Scooter">Scooter (Motorcycle)</option>
                <option value="Cycle">Cycle</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Vehicle Number</label>
              <input 
                type="text" 
                name="vehicleNumber"
                value={formData.vehicleNumber}
                onChange={handleInputChange}
                placeholder="ABC-1234 (Optional)" 
                className="w-full px-4 py-3 rounded-xl bg-slate-800 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-orange-500" 
              />
            </div>
          </div>

          {/* Row 4: Account Security Checkpoint */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Password</label>
            <input 
              type="password" 
              name="password"
              required
              value={formData.password}
              onChange={handleInputChange}
              placeholder="••••••••" 
              className="w-full px-4 py-3 rounded-xl bg-slate-800 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-orange-500" 
            />
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-orange-500 hover:bg-orange-600 disabled:bg-orange-500/50 text-white font-semibold py-3 rounded-xl shadow-lg shadow-orange-500/20 transition-all duration-200"
          >
            {loading ? 'Creating Fleet Space...' : 'Create Partner Account'}
          </button>
        </form>

        <p className="text-center text-sm text-slate-400 mt-6">
          Already have an account?{' '}
          <NavLink to="/login" className="text-orange-500 hover:underline">
            Log in here
          </NavLink>
        </p>
      </div>
    </div>
  );
}