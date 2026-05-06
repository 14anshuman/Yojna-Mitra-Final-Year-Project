import { useState } from "react";
import {
  Search,
  BookOpen,
  Users,
  Coins,
  Calendar,
  Building2,
  MapPin,
  Filter,
  ChevronDown,
  X,
} from "lucide-react";

const CATEGORIES = [
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

const MINISTRIES = [
  "Ministry Of Culture",
  "Ministry Of Petroleum and Natural Gas",
  "Ministry Of Rural Development",
  "Ministry Of Housing & Urban Affairs",
  "Ministry Of Heavy Industries",
  "Ministry Of Health & Family Welfare",
  "Ministry Of Science And Technology",
  "Ministry Of Law and Justice",
  "Ministry Of Agriculture and Farmers Welfare",
  "Ministry Of Labour and Employment",
  "Ministry Of External Affairs",
  "Ministry Of Youth Affairs & Sports",
  "Ministry Of Micro, Small and Medium Enterprises",
  "Ministry Of Commerce And Industry",
  "Ministry Of Minority Affairs",
  "Ministry Of New and Renewable Energy",
  "Ministry Of Social Justice and Empowerment",
  "Ministry Of Finance",
  "Ministry Of Women and Child Development",
  "Ministry Of Jal Shakti",
  "Ministry Of Education",
  "Ministry Of Skill Development And Entrepreneurship",
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

const LEVELS = ["State/ UT", "Central", "State"];

const SchemeSearch = ({ onSearch }) => {
  const [filters, setFilters] = useState({
    search: "",
    schemeName: "",
    openDate: "",
    closeDate: "",
    state: "",
    ministry: "",
    level: "",
    category: "",
    gender: "",
    incomeGroup: "",
  });

  const [activeTab, setActiveTab] = useState("basic");

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(filters);
  };

  const clearFilter = (filterName) => {
    setFilters((prev) => ({
      ...prev,
      [filterName]: "",
    }));
  };

  const SelectField = ({
    label,
    name,
    value,
    onChange,
    options,
    icon: Icon,
  }) => (
    <div className="relative">
      <select
        name={name}
        value={value}
        onChange={onChange}
        className="w-full p-3 pl-10 pr-10 bg-white/80 backdrop-blur-md border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#74B83E] focus:border-transparent transition-all duration-200 appearance-none text-gray-700 focus:outline-none text-sm shadow-sm"
      >
        <option value="">Select {label}</option>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
      <Icon
        className="absolute left-3 top-1/2 -translate-y-1/2 text-[#74B83E]"
        size={16}
      />
      <ChevronDown
        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
        size={14}
      />
    </div>
  );

  const tabs = [
    { id: "basic", label: "Basic Filters", icon: Filter },
    { id: "location", label: "Location", icon: MapPin },
    { id: "eligibility", label: "Eligibility", icon: Users },

  ];

  return (
    <div className="animate-fadeInUp">
      <div className="max-w-7xl mx-auto px-4 py-6">
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* --- Search Bar --- */}
          <div className="relative max-w-3xl mx-auto">
            <div className="flex items-center bg-white/70 backdrop-blur-md border border-[#74B83E]/40 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden">
              
              <input
                type="text"
                name="search"
                placeholder="🔍 Search for government schemes..."
                value={filters.search}
                onChange={handleFilterChange}
                className="flex-1 px-4 sm:py-3 text-base bg-transparent border-none focus:outline-none placeholder-gray-500 text-gray-800"
              />
              <button
                type="submit"
                className="px-5 sm:px-6 py-3 bg-gradient-to-r from-[#74B83E] to-green-500 text-white font-medium rounded-full transition-all duration-300 hover:scale-105 hover:shadow-md flex items-center gap-2"
              >
                <Search size={18} />
                <span className="hidden sm:inline">Search</span>
              </button>
            </div>
          </div>

          {/* --- Active Filters --- */}
          {Object.entries(filters).some(([_, value]) => value) && (
            <div className="bg-white/80 backdrop-blur-md rounded-full p-3 shadow-md border border-gray-100">
              <div className="flex flex-wrap gap-2">
                {Object.entries(filters).map(
                  ([key, value]) =>
                    value && (
                      <div
                        key={key}
                        className="flex items-center gap-1.5 bg-[#74B83E] bg-opacity-80 text-white px-3 py-1.5 rounded-full text-sm font-medium shadow-sm"
                      >
                        {key}: {value}
                        <button
                          type="button"
                          onClick={() => clearFilter(key)}
                          className="hover:text-red-200 transition-colors"
                        >
                          <X size={14} />
                        </button>
                      </div>
                    )
                )}
              </div>
            </div>
          )}

          {/* --- Filter Tabs --- */}
          <div className="rounded-2xl shadow-md overflow-hidden border border-[#74B83E]/50 bg-white/70 backdrop-blur-md">
            <div className="flex overflow-x-auto border-b border-gray-200">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-3 text-sm font-medium whitespace-nowrap transition-all duration-200 flex-1 ${
                    activeTab === tab.id
                      ? "text-[#74B83E] border-b-2 border-[#74B83E] bg-green-50"
                      : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  <tab.icon size={16} />
                  <span className="hidden sm:inline">{tab.label}</span>
                </button>
              ))}
            </div>

            <div className="p-5">
              {activeTab === "basic" && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <SelectField
                    label="Category"
                    name="category"
                    value={filters.category}
                    onChange={handleFilterChange}
                    options={CATEGORIES}
                    icon={BookOpen}
                  />
                  <SelectField
                    label="Ministry"
                    name="ministry"
                    value={filters.ministry}
                    onChange={handleFilterChange}
                    options={MINISTRIES}
                    icon={Building2}
                  />
                </div>
              )}

              {activeTab === "location" && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <SelectField
                    label="State"
                    name="state"
                    value={filters.state}
                    onChange={handleFilterChange}
                    options={STATES}
                    icon={MapPin}
                  />
                  <SelectField
                    label="Level"
                    name="level"
                    value={filters.level}
                    onChange={handleFilterChange}
                    options={LEVELS}
                    icon={Filter}
                  />
                </div>
              )}

              {activeTab === "eligibility" && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <SelectField
                    label="Gender"
                    name="gender"
                    value={filters.gender}
                    onChange={handleFilterChange}
                    options={["Male", "Female", "Other"]}
                    icon={Users}
                  />
                  <SelectField
                    label="Income Group"
                    name="incomeGroup"
                    value={filters.incomeGroup}
                    onChange={handleFilterChange}
                    options={["Low", "Middle", "High"]}
                    icon={Coins}
                  />
                </div>
              )}

             
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SchemeSearch;
