import React, { useEffect, useState } from "react";
import axios from "axios";
import SchemeCard from "../../common/schemeCard/SchemeCard";
import { Link } from "react-router-dom";
import { HeartOff } from "lucide-react";
import { toast } from "react-hot-toast";

const Favorites = () => {
    const [favorites, setFavorites] = useState([]);
    const [loading, setLoading] = useState(true);
    const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

    const fetchFavorites = async () => {
        try {
            const token = localStorage.getItem("token");
            const response = await axios.get(
                `${BACKEND_URL}/api/v1/users/favorites/`,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setFavorites(response.data.favorites);
        } catch (error) {
            console.error("Error loading favorites", error);
            toast.error("Failed to load your saved schemes.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchFavorites();
    }, []);

    // Function to handle removing a favorite
    const handleRemoveFavorite = async (schemeId) => {
        try {
            if(window.confirm("Are you sure you want to remove this scheme from your favorites?")) {
                const token = localStorage.getItem("token");
            
            // OPTIMISTIC UI UPDATE: Remove from state immediately for better UX
            const previousFavorites = [...favorites];
            setFavorites(favorites.filter(scheme => scheme._id !== schemeId));

            await axios.post(
                `${BACKEND_URL}/api/v1/users/remove-from-favorites`,
                { schemeId }, // userId usually extracted from token in backend
                { headers: { Authorization: `Bearer ${token}` } }
            );

            toast.success("Removed from favorites");
            }
        } catch (error) {
            console.error("Error removing favorite", error);
            toast.error("Could not remove from favorites.");
            // Rollback if API fails
            fetchFavorites(); 
        }
    };

    if (loading) return (
        <div className="flex items-center justify-center min-h-screen">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-50 px-6 py-12">
            <div className="max-w-6xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-800">My Saved Schemes</h1>
                    <span className="px-4 py-1 bg-green-100 text-green-700 rounded-full text-sm font-semibold">
                        {favorites.length} Saved
                    </span>
                </div>

                {favorites.length === 0 ? (
                    <div className="text-center py-20 bg-white rounded-3xl shadow-sm border border-gray-100">
                        <HeartOff size={48} className="mx-auto text-gray-300 mb-4" />
                        <p className="text-gray-500 text-lg">You haven't saved any schemes yet.</p>
                        <Link to="/schemes" className="text-green-600 font-semibold mt-4 hover:underline inline-block">
                            Explore All Schemes
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {favorites.map((scheme) => (
                            /* Note: We wrap the card in a Link, but inside SchemeCard 
                               we use e.preventDefault() on the delete button.
                            */
                            <Link to={`/scheme/${scheme._id}`} key={scheme._id}>
                                <SchemeCard 
                                    scheme={scheme} 
                                    isFavoritePage={true} 
                                    onRemove={handleRemoveFavorite}
                                />
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Favorites;