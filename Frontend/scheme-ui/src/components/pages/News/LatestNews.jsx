import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Filter, RefreshCcw, Megaphone } from 'lucide-react';



import { Calendar, ExternalLink, MapPin, Tag, Newspaper } from 'lucide-react';

const NewsCard = ({ news }) => {
  const { publishedAt, source, category, state, link, summary, title } = news;

  // Category specific colors
  const categoryStyles = {
    Agriculture: "bg-green-100 text-green-700 border-green-200",
    Finance: "bg-amber-100 text-amber-700 border-amber-200",
    Education: "bg-purple-100 text-purple-700 border-purple-200",
    General: "bg-blue-100 text-blue-700 border-blue-200",
  };

  const currentStyle = categoryStyles[category] || categoryStyles.General;

  return (
    <div className="group bg-white rounded-2xl shadow-sm border border-gray-200 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col h-full overflow-hidden">
      {/* Visual Accent Top Bar */}
      <div className={`h-1.5 w-full ${currentStyle.split(' ')[0]}`} />
      
      <div className="p-6 flex-grow">
        <div className="flex justify-between items-center mb-4">
          <span className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${currentStyle}`}>
            <Tag size={12} />
            {category}
          </span>
          <span className="flex items-center gap-1 text-gray-400 text-xs font-medium">
            <Calendar size={14} />
            {new Date(publishedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
          </span>
        </div>
        
        <h3 className="text-xl font-bold text-gray-900 mb-4 leading-snug group-hover:text-blue-600 transition-colors">
          {title}
        </h3>

        <ul className="space-y-3 mb-4">
          {summary.map((point, index) => (
            <li key={index} className="flex items-start text-sm text-gray-600 leading-relaxed">
              <span className="min-w-[6px] h-[6px] rounded-full bg-blue-400 mr-3 mt-2" />
              {point}
            </li>
          ))}
        </ul>
      </div>

      <div className="px-6 py-4 bg-gray-50/50 flex flex-wrap gap-4 justify-between items-center border-t border-gray-100">
        <div className="flex items-center gap-3 text-xs text-gray-500">
          <div className="flex items-center gap-1 font-medium bg-white px-2 py-1 rounded border border-gray-200">
            <Newspaper size={12} className="text-blue-500" />
            {source}
          </div>
          <div className="flex items-center gap-1 font-medium">
            <MapPin size={12} className="text-red-400" />
            {state}
          </div>
        </div>
        
        <a 
          href={link} 
          target="_blank" 
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-800 text-sm font-bold transition-colors"
        >
          Details <ExternalLink size={14} />
        </a>
      </div>
    </div>
  );
};

const LatestNews = () => {
  const [newsList, setNewsList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState({ category: '' });
  
  const userLang = localStorage.getItem('userLanguage') || 'en';
  const userState = localStorage.getItem('userState') || 'Central';

  const fetchNews = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/v1/news/latest`, {
        params: { state: userState, language: userLang, category: filter.category }
      });
      console.log(response);
      setNewsList(response.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchNews(); }, [filter, userLang, userState]);

  return (
    <div className="min-h-screen bg-[#f8fafc] pb-20">
      {/* Premium Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10 backdrop-blur-md bg-white/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="bg-blue-600 p-3 rounded-2xl shadow-lg shadow-blue-200">
                <Megaphone className="text-white" size={28} />
              </div>
              <div>
                <h1 className="text-2xl font-black text-gray-900 tracking-tight">News Mitra</h1>
                <p className="text-sm font-medium text-gray-500">Government Updates for <span className="text-blue-600 font-bold">{userState}</span></p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                <select 
                  className="pl-10 pr-8 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-bold text-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none appearance-none cursor-pointer"
                  onChange={(e) => setFilter({ category: e.target.value })}
                >
                  <option value="">All Categories</option>
                  <option value="Agriculture">Agriculture</option>
                  <option value="Education">Education</option>
                  <option value="Finance">Finance</option>
                </select>
              </div>
              <button 
                onClick={fetchNews}
                className="p-2.5 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 text-gray-600 transition-colors"
              >
                <RefreshCcw size={20} className={loading ? "animate-spin" : ""} />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10">
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((n) => (
              <div key={n} className="h-[400px] bg-white rounded-2xl animate-pulse border border-gray-100" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {newsList.map((news) => {
              if(news.summary && news.summary.length > 0) {
                return <NewsCard key={news._id} news={news} />;
              }
            })}
          </div>
        )}

        {!loading && newsList.length === 0 && (
          <div className="max-w-md mx-auto text-center py-20">
            <div className="bg-gray-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
              <Newspaper className="text-gray-400" size={40} />
            </div>
            <h3 className="text-xl font-bold text-gray-800">No updates found</h3>
            <p className="text-gray-500 mt-2">We couldn't find any news matching your current filters. Try checking again later.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default LatestNews;