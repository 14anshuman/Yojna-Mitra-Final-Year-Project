import { useState, useEffect, useCallback } from "react";
import { Link, Navigate } from "react-router-dom";
import { Search, Info, LayoutGrid,Bell, ArrowRight } from "lucide-react";
import SchemeSearch from "./SchemeSearch";
import SchemeCard from "../../common/schemeCard/SchemeCard";
import Pagination from "../../common/pagination/Pagination";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Schemes = () => {
  const [schemes, setSchemes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalSchemes, setTotalSchemes] = useState(0);
  const [filters, setFilters] = useState({});
  const [error, setError] = useState(null);


  const navigate=useNavigate();

  const fetchSchemes = useCallback(
    async (page) => {
      try {
        setLoading(true);
        setError(null);
        const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

        const response = await axios.get(
          `${BACKEND_URL}/api/v1/schemes/get-all-schemes`,
          {
            params: { page, limit: 9, ...filters },
          }
        );

        const data = response.data;
        setSchemes(data.schemes || []);
        setTotalPages(data.totalPages || 1);
        setCurrentPage(data.currentPage || 1);
        setTotalSchemes(data.totalSchemes || 0);
      } catch (error) {
        setError("Failed to fetch schemes. Please try again.");
      } finally {
        setLoading(false);
      }
    },
    [filters]
  );

  useEffect(() => {
    fetchSchemes(currentPage);
  }, [currentPage, fetchSchemes]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSearch = (filters) => {
    setFilters(filters);
    setCurrentPage(1);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {/* Header Section */}
      <div>
  {/* Main Wrapper */}
  <div className="container mx-auto px-6 py-12 lg:py-20 flex flex-col md:flex-row md:items-center justify-between gap-10">
    
    {/* Left Side: Content */}
    <div className="max-w-3xl">
      <div className="flex items-center gap-2 text-green-700 font-bold mb-2 uppercase tracking-widest text-xs">
        <div className="p-1.5 bg-green-50 rounded-lg">
          <LayoutGrid size={16} />
        </div>
        <span>Explore Opportunities</span>
      </div>
      
      <h1 className="text-4xl lg:text-6xl font-black text-slate-900 mb-6 leading-[1.1]">
        Government Schemes <br />
        <span className="text-green-700">Directory</span>
      </h1>
      
      <p className="text-slate-600 text-lg lg:text-xl max-w-2xl leading-relaxed">
        Find, compare, and apply for government initiatives designed to support 
        <span className="text-slate-900 font-medium"> citizens, farmers, and entrepreneurs </span> 
        across India.
      </p>
    </div>

    {/* Right Side: News Mitra Button */}
    <div className="flex-shrink-0 -mt-22">
      <button
        onClick={() => navigate('/latest-news')}
        className="group relative flex items-center gap-4 bg-slate-900 hover:bg-slate-800 text-white pl-5 pr-6 py-3 rounded-2xl transition-all duration-300 shadow-2xl shadow-slate-200 border border-slate-700 hover:-translate-y-1"
      >
        <div className="relative">
          <div className="p-2 bg-slate-800 rounded-xl group-hover:bg-slate-700 transition-colors">
            <Bell size={20} className="text-green-400" />
          </div>
          {/* Active Ping Animation */}
          <span className="absolute -top-1 -right-1 flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
          </span>
        </div>
        
        <div className="text-left">
          <p className="text-[10px] uppercase tracking-[0.2em] text-slate-400 font-semibold mb-0.5">Live Updates</p>
          <p className="text-sm font-bold tracking-wide">News Mitra</p>
        </div>

        <div className="ml-2 p-1 bg-white/10 rounded-full group-hover:bg-white/20 transition-colors">
          <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
        </div>
      </button>
    </div>
    
  </div>
</div>

      {/* Search & Sticky Sub-nav Area */}
      <div className="flex justify-center">
            <div className=" w-full max-w-4xl rounded-2xl shadow-lg px-10 py-6 border border-gray-200">
              <SchemeSearch onSearch={handleSearch} />
            </div>
          </div>

      <section className="container mx-auto px-6 py-10">
        {/* Results Metadata */}
        {!loading && (
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4 border-l-4 border-green-500 pl-4">
            <div>
              <h3 className="text-xl font-bold text-slate-800">Available Schemes</h3>
              <p className="text-slate-500 text-sm">
                Showing <span className="font-semibold text-slate-900">{totalSchemes}</span> relevant initiatives
              </p>
            </div>
            {error && (
              <div className="flex items-center gap-2 text-red-600 bg-red-50 px-4 py-2 rounded-lg text-sm border border-red-100">
                <Info size={16} />
                <span>{error}</span>
              </div>
            )}
          </div>
        )}

        {/* Skeleton/Loading State */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-64 bg-slate-200 animate-pulse rounded-2xl"></div>
            ))}
          </div>
        ) : (
          <>
            {/* Scheme Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {schemes.map((scheme) => (
                <Link 
                  to={`/scheme/${scheme._id}`} 
                  key={scheme._id}
                  className="transition-transform duration-300 hover:-translate-y-2"
                >
                  <SchemeCard scheme={scheme} />
                </Link>
              ))}
            </div>

            {/* No Results State */}
            {schemes.length === 0 && (
              <div className="bg-white rounded-3xl p-20 text-center border-2 border-dashed border-slate-200">
                <div className="bg-slate-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search size={32} className="text-slate-400" />
                </div>
                <h3 className="text-xl font-bold text-slate-800">No matches found</h3>
                <p className="text-slate-500 mt-2">Try adjusting your filters or keywords for broader results.</p>
              </div>
            )}

            {/* Pagination Wrapper */}
            {schemes.length > 0 && (
              <div className="mt-10 flex flex-col items-center border-t border-slate-200 pt-1">
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={handlePageChange}
                />
                <p className="-mt-6 text-slate-400 text-xs uppercase tracking-widest font-medium">
                  Page {currentPage} of {totalPages}
                </p>
              </div>
            )}
          </>
        )}
      </section>
    </div>
  );
};

export default Schemes;