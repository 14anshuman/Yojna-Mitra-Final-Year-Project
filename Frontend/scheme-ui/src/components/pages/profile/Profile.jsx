import React, { useState, useEffect } from "react";
import {
  User, Mail, Phone, Heart, DollarSign, MapPin,
  Calendar, Edit2, Save, X, Star, Shield, 
  ChevronRight, Layout
} from "lucide-react";
import { toast } from "react-hot-toast";
import axios from "axios";

const Profile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [userData, setUserData] = useState({
    name: "", email: "", phone: "", interests: [],
    incomeGroup: "", state: "", age: "", gender: "",
    role: "", favorites: [],
  });

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
        const res = await axios.get(`${BACKEND_URL}/api/v1/users/getme`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        if (res.data.success) setUserData(res.data.data);
      } catch (err) {
        toast.error("Profile load failed");
      }
    };
    fetchUserData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData((prev) => ({ ...prev, [name]: value }));
  };

  const handleInterestsChange = (interest) => {
    setUserData((prev) => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter((i) => i !== interest)
        : [...prev.interests, interest],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
      const res = await axios.put(`${BACKEND_URL}/api/v1/users/update`, userData, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      if (res.data.success) {
        toast.success("Profile updated");
        setIsEditing(false);
      }
    } catch (err) {
      toast.error("Update failed");
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] py-12 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto">
        {/* Profile Header Card */}
        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden mb-8">
          <div className="h-32 bg-gradient-to-br from-slate-900 to-green-900"></div>
          <div className="px-8 pb-8">
            <div className="relative flex justify-between items-end -mt-12 mb-6">
              <div className="p-1 bg-white rounded-2xl shadow-lg">
                <div className="w-24 h-24 bg-slate-100 rounded-xl flex items-center justify-center text-green-600 font-bold text-3xl border border-slate-100">
                  {userData.name?.charAt(0) || "U"}
                </div>
              </div>
              {!isEditing ? (
                <button
                  onClick={() => setIsEditing(true)}
                  className="px-6 py-2.5 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-all flex items-center gap-2 font-semibold shadow-md active:scale-95"
                >
                  <Edit2 size={18} />
                  Edit Profile
                </button>
              ) : (
                <div className="flex gap-2">
                  <button onClick={() => setIsEditing(false)} className="px-4 py-2.5 bg-slate-100 text-slate-600 rounded-xl hover:bg-slate-200 font-semibold flex items-center gap-2">
                    <X size={18} /> Cancel
                  </button>
                  <button onClick={handleSubmit} className="px-6 py-2.5 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 font-semibold flex items-center gap-2 shadow-md">
                    <Save size={18} /> Save Changes
                  </button>
                </div>
              )}
            </div>
            <div>
              <h1 className="text-3xl font-extrabold text-slate-900">{userData.name || "User Name"}</h1>
              <p className="text-slate-500 font-medium flex items-center gap-2 mt-1">
                <Shield size={16} className="text-green-500" />
                {userData.role?.toUpperCase() || "CITIZEN"}
              </p>
            </div>
          </div>
        </div>

        {!isEditing ? (
          <div className="space-y-6">
            {/* Stats Bar */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <StatCard icon={<Star />} label="Saved" value={userData.favorites.length} />
              <StatCard icon={<Layout />} label="Interests" value={userData.interests.length} />
              <StatCard icon={<MapPin />} label="State" value={userData.state || "N/A"} />
              <StatCard icon={<DollarSign />} label="Group" value={userData.incomeGroup || "N/A"} />
            </div>

            {/* Information Grid */}
            <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-8">
              <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
                <User size={20} className="text-green-600" /> Personal Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
                <InfoItem label="Email Address" value={userData.email} />
                <InfoItem label="Phone Number" value={userData.phone} />
                <InfoItem label="Age" value={userData.age ? `${userData.age} Years` : null} />
                <InfoItem label="Gender" value={userData.gender} />
              </div>

              <div className="mt-10">
                <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                  <Heart size={20} className="text-green-600" /> Areas of Interest
                </h3>
                <div className="flex flex-wrap gap-2">
                  {userData.interests.length > 0 ? (
                    userData.interests.map((int) => (
                      <span key={int} className="px-4 py-1.5 bg-green-50 text-green-700 rounded-full text-sm font-semibold border border-green-100">
                        {int}
                      </span>
                    ))
                  ) : (
                    <p className="text-slate-400 italic text-sm">No interests selected.</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* Editable Form */
          <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-8">
            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <InputField label="Full Name" name="name" value={userData.name} onChange={handleChange} />
                <InputField label="Phone" name="phone" value={userData.phone} onChange={handleChange} />
                <InputField label="Age" name="age" type="number" value={userData.age} onChange={handleChange} />
                <SelectField label="State" name="state" value={userData.state} onChange={handleChange} options={STATES} />
                <SelectField label="Income Group" name="incomeGroup" value={userData.incomeGroup} onChange={handleChange} options={INCOME_GROUPS} />
              </div>

              <div>
                <label className="text-sm font-bold text-slate-700 block mb-3">Choose Your Interests</label>
                <div className="flex flex-wrap gap-2">
                  {INTERESTS.map((interest) => (
                    <button
                      key={interest} type="button"
                      onClick={() => handleInterestsChange(interest)}
                      className={`px-4 py-2 rounded-xl text-sm font-medium transition-all border ${
                        userData.interests.includes(interest)
                          ? "bg-green-600 text-white border-green-600 shadow-md scale-105"
                          : "bg-white text-slate-500 border-slate-200 hover:border-green-300"
                      }`}
                    >
                      {interest}
                    </button>
                  ))}
                </div>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

// Sub-components for cleaner code
const StatCard = ({ icon, label, value }) => (
  <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
    <div className="p-2 bg-green-50 text-green-600 rounded-lg">{icon}</div>
    <div>
      <p className="text-xs font-bold text-slate-400 uppercase tracking-tight">{label}</p>
      <p className="text-sm font-bold text-slate-800">{value}</p>
    </div>
  </div>
);

const InfoItem = ({ label, value }) => (
  <div className="border-b border-slate-50 pb-2">
    <p className="text-xs font-bold text-slate-400 uppercase mb-1 tracking-wide">{label}</p>
    <p className="text-slate-800 font-semibold">{value || "Not specified"}</p>
  </div>
);

const InputField = ({ label, name, value, onChange, type = "text" }) => (
  <div>
    <label className="text-sm font-bold text-slate-700 ml-1">{label}</label>
    <input
      name={name} type={type} value={value} onChange={onChange}
      className="mt-2 w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-4 focus:ring-green-100 focus:border-green-500 outline-none transition-all"
    />
  </div>
);

const SelectField = ({ label, name, value, onChange, options }) => (
  <div>
    <label className="text-sm font-bold text-slate-700 ml-1">{label}</label>
    <select
      name={name} value={value} onChange={onChange}
      className="mt-2 w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-4 focus:ring-green-100 focus:border-green-500 outline-none transition-all appearance-none"
    >
      <option value="">Select Option</option>
      {options.map((opt) => <option key={opt} value={opt}>{opt}</option>)}
    </select>
  </div>
);

const INCOME_GROUPS = ["Low", "Middle", "High"];

const INTERESTS = [
  "Women and Child",
  "Utility & Sanitation",
  "Travel & Tourism",
  "Transport & Infrastructure Sports & Culture",
  "Social welfare & Empowerment",
  "Skills & Employment",
  "Science, IT & Communications",
  "Public Safety,Law & Justice",
  "Housing & Shelter",
  "Health & Wellness",
  "Education & Learning",
  "Business & Entrepreneurship",
  "Banking, Financial Services and Insurance",
  "Agriculture,Rural & Environment",
];




const STATES = [
  "Andaman and Nicobar Islands",
  "Arunachal Pradesh",
  "Assam",
  "Bihar",
  "Chhattisgarh",
  "Goa",
  "Gujarat",
  "Haryana",
  "Himachal Pradesh",
  "Jammu and Kashmir",
  "Jharkhand",
  "Karnataka",
  "Kerala",
  "Madhya Pradesh",
  "Maharashtra",
  "Meghalaya",
  "Mizoram",
  "Nagaland",
  "Odisha",
  "Punjab",
  "Rajasthan",
  "Sikkim",
  "Tamil Nadu",
  "Telangana",
  "Tripura",
  "Uttar Pradesh",
  "Uttarakhand",
  "West Bengal",
  "Chandigarh",
  "Dadra and Nagar Haveli and Daman and Diu",
  "Lakshadweep",
  "Delhi",
  "Puducherry",
];

export default Profile;