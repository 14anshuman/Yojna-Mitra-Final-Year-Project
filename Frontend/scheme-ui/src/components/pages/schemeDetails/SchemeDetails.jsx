import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Target,
  List,
  FileText,
  Users,
  Download,
  Share2,
  Bookmark,
  CheckCircle2,
  Building,
  MapPin,
  ExternalLink
} from "lucide-react";
import ChatBot from "../../common/chatbot/ChatBot";
import { generatePDF } from "../../../helper/generatePdf";
import { shareScheme } from "../../../helper/shareScheme";
import DisplayMarkdown from "./components/DisplayMarkdown";
import { toast } from "react-hot-toast";
import axios from "axios";

const SchemeDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [scheme, setScheme] = useState(null);
  const [loading, setLoading] = useState(true);
  const contentRef = useRef(null);
  const [isSaved, setIsSaved] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");

  const fetchSchemeById = async (id) => {
    try {
      setLoading(true);
      const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";
      const token = localStorage.getItem("token");

      const response = await axios.get(`${BACKEND_URL}/api/v1/schemes/get-scheme-by-id/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setScheme(response.data);
    } catch (error) {
      toast.error("Failed to fetch scheme details.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) fetchSchemeById(id);
  }, [id]);

  const handleSaveScheme = async () => {
    if (isSaving) return;
    try {
      setIsSaving(true);
      const token = localStorage.getItem("token");
      const user = JSON.parse(localStorage.getItem("user"));
      const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";
      
      await axios.post(`${BACKEND_URL}/api/v1/users/add-to-favorites`, 
        { userId: user._id, schemeId: id },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setIsSaved(true);
      toast.success("Added to favorites");
    } catch (error) {
      toast.error("Please login to save schemes");
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50">
      <div className="relative">
        <div className="h-16 w-16 rounded-full border-4 border-slate-200 border-t-green-600 animate-spin"></div>
      </div>
      <p className="mt-4 text-slate-500 font-medium tracking-wide">Syncing Scheme Details...</p>
    </div>
  );

  if (!scheme) return <div className="text-center py-20 font-medium text-slate-600">Scheme not found.</div>;

  const tabs = [
    { id: "overview", label: "Overview", icon: Target },
    { id: "eligibility", label: "Eligibility", icon: Users },
    { id: "benefits", label: "Benefits", icon: List },
    { id: "documents", label: "Documents", icon: FileText },
    { id: "apply", label: "How to Apply", icon: ExternalLink },
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-20">
      {/* Top Navigation Bar */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center text-slate-600 hover:text-green-600 font-semibold transition-colors group"
          >
            <ArrowLeft className="mr-2 group-hover:-translate-x-1 transition-transform" size={20} />
            Back to Directory 
          </button>
          <div className="flex gap-3">
            <button onClick={() => shareScheme(scheme.title)} className="p-2 text-slate-400 hover:text-green-600 transition-colors">
              <Share2 size={20} />
            </button>
            <button 
              onClick={handleSaveScheme}
              className={`p-2 transition-colors ${isSaved ? 'text-green-600' : 'text-slate-400 hover:text-green-600'}`}
            >
              <Bookmark size={20} fill={isSaved ? "currentColor" : "none"} />
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 pt-8">
        <div className="grid lg:grid-cols-3 gap-8">
          
          {/* Main Content Area (Left 2 Columns) */}
          <div className="lg:col-span-2 space-y-6">
            <div ref={contentRef} className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
              {/* Hero Banner Section */}
              <div className="p-8 md:p-12 bg-gradient-to-br from-slate-900 to-green-900 text-white">
                <div className="flex flex-wrap gap-2 mb-6">
                  {scheme.level && (
                    <span className="px-3 py-1 bg-white/10 backdrop-blur-md text-white border border-white/20 rounded-full text-xs font-bold uppercase tracking-widest">
                      {scheme.level}
                    </span>
                  )}
                  <span className="px-3 py-1 bg-green-500 text-white rounded-full text-xs font-bold uppercase tracking-widest">
                    Verified
                  </span>
                </div>
                <h1 className="text-3xl md:text-5xl font-extrabold leading-tight mb-4">
                  {scheme.title}
                </h1>
                <p className="text-green-100 text-lg opacity-80 max-w-2xl">
                  {scheme.ministry || "Government of India Initiative"}
                </p>
              </div>

              {/* Enhanced Tab Navigation */}
              <div className="bg-white border-b border-slate-100 px-4 md:px-8">
                <nav className="flex space-x-6 overflow-x-auto no-scrollbar">
                  {tabs.map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex items-center py-5 border-b-2 text-sm font-bold cursor-pointer transition-all whitespace-nowrap ${
                        activeTab === tab.id
                          ? "border-green-600 text-green-600"
                          : "border-transparent text-slate-400 hover:text-slate-600"
                      }`}
                    >
                      <tab.icon className="mr-2" size={18} />
                      {tab.label}
                    </button>
                  ))}
                </nav>
              </div>

              {/* Tab Panel Content */}
              <div className="p-8 md:p-12 min-h-[250px]">
                <div className="prose prose-slate prose-lg max-w-none prose-headings:text-slate-900 prose-strong:text-green-600">
                  <DisplayMarkdown 
                    content={
                      activeTab === "overview" ? scheme.description :
                      activeTab === "eligibility" ? scheme.eligibility :
                      activeTab === "benefits" ? scheme.keyFeatures :
                      activeTab === "documents" ? scheme.documentsRequired :
                      scheme.howToApply
                    } 
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar Area (Right 1 Column) */}
          <div className="lg:col-span-1 space-y-6">
            {/* Quick Actions Card */}
            <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-6 space-y-4">
              <h3 className="font-semibold text-slate-800 text-lg">Quick Actions</h3>
              <button
                onClick={() => generatePDF(contentRef, scheme.title)}
                className="w-full py-4 bg-green-600 hover:bg-green-700 text-white rounded-2xl flex items-center justify-center gap-3 font-bold transition-all shadow-lg shadow-green-100"
              >
                <Download size={20} />
                Download Guidelines
              </button>
              <button 
                onClick={handleSaveScheme}
                className={`w-full py-4 border-2 rounded-2xl flex items-center justify-center gap-3 font-bold transition-all ${
                  isSaved ? "border-emerald-500 text-emerald-600 bg-emerald-50" : "border-slate-200 text-slate-700 hover:bg-slate-50"
                }`}
              >
                {isSaved ? <CheckCircle2 size={20} /> : <Bookmark size={20} />}
                {isSaved ? "Saved to Profile" : "Save for Later"}
              </button>
            </div>

            {/* Metadata Detail Card */}
            <div className="bg-green-50 rounded-3xl p-8 space-y-6 border border-green-100">
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-green-600 mb-1">
                  <MapPin size={16} />
                  <span className="text-xs font-black uppercase tracking-widest">Applicable State</span>
                </div>
                <p className="text-slate-900 font-bold text-lg">{scheme.state || "National / Central"}</p>
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-2 text-green-600 mb-1">
                  <Building size={16} />
                  <span className="text-xs font-black uppercase tracking-widest">Nodal Ministry</span>
                </div>
                <p className="text-slate-900 font-bold text-lg leading-snug">{scheme.ministry || "Union Government"}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {scheme && <ChatBot schemeId={scheme._id} />}
    </div>
  );
};

export default SchemeDetails;