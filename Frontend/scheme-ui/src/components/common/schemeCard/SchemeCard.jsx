import { ArrowRight, Building2, MapPin, Trash2, ShieldCheck, Globe } from 'lucide-react';
import DisplayMarkdown from '../../pages/schemeDetails/components/DisplayMarkdown';

const SchemeCard = ({ scheme, isFavoritePage, onRemove }) => {
    return (
        <div className="h-full group bg-white rounded-2xl shadow-sm hover:shadow-2xl hover:shadow-green-100 transition-all duration-300 overflow-hidden border border-slate-200 flex flex-col relative">
            
            {/* Header Image Area */}
            <div className="relative border-0.5 rounded-2xl  h-44 w-full overflow-hidden">
                <img
                    src={scheme.imageUrl || "/assets/yojna.png"}
                    alt={scheme.title}
                    className="h-full w-full object-cover group-hover:scale-101 transition-transform duration-500"
                />
                {/* Level Badge (Central/State) */}
                <div className="absolute top-3 left-3">
                    <span className={`px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-full shadow-sm backdrop-blur-md ${
                        scheme.level === 'Central' 
                        ? 'bg-green-600/90 text-white' 
                        : 'bg-amber-500/90 text-white'
                    }`}>
                        {scheme.level || 'Scheme'}
                    </span>
                </div>
            </div>

            <div className="p-5 flex flex-col flex-grow">
                {/* Title & Description */}
                <div className="flex-grow">
                    <h2 className="text-lg font-bold text-slate-800 group-hover:text-green-600 transition-colors duration-300 line-clamp-2 leading-tight mb-2">
                        {scheme.title}
                    </h2>
                    
                    {/* Minimalist Description */}
                    <div className="text-slate-500 text-sm line-clamp-2 leading-relaxed mb-4">
                        <DisplayMarkdown content={scheme.description} />
                    </div>
                </div>

                {/* Metadata Grid */}
                <div className="grid grid-cols-1 gap-2 mb-5 border-t border-slate-100 pt-4">
                    <div className="flex items-center gap-2 text-slate-600">
                        <div className="p-1.5 bg-green-50 rounded-md text-green-600">
                            <Building2 size={14} />
                        </div>
                        <span className="text-xs font-medium truncate">
                            {scheme.ministry || scheme.department || 'Government of India'}
                        </span>
                    </div>

                    <div className="flex items-center gap-2 text-slate-600">
                        <div className="p-1.5 bg-emerald-50 rounded-md text-emerald-600">
                            <MapPin size={14} />
                        </div>
                        <span className="text-xs font-medium uppercase tracking-tight">
                            {Array.isArray(scheme.state) ? scheme.state[0] : scheme.state || 'All States'}
                        </span>
                    </div>
                </div>

                {/* Action Footer */}
                <div className="flex gap-2">
                    <button className="flex-1 px-4 py-2.5 text-sm font-semibold text-white bg-green-600 hover:bg-green-700 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 shadow-md shadow-green-100 active:scale-95">
                        View Details
                        <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                    </button>

                    {isFavoritePage && (
                        <button
                            onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                onRemove(scheme._id);
                            }}
                            className="p-2.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all border border-slate-200 hover:border-red-100 flex items-center justify-center"
                            title="Remove"
                        >
                            <Trash2 size={18} />
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default SchemeCard;