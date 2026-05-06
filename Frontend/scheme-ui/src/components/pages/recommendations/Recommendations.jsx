import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Search } from 'lucide-react';
import SchemeCard from '../../common/schemeCard/SchemeCard';
import Pagination from '../../common/pagination/Pagination';
import { getPersonalizedRecommendations } from '../../../services/recommendations/recommendationService';
import Header from '../../common/header/Header';
import axios from 'axios';
import { useContext } from 'react';
import { UserContext } from '../../../context/UserContext';

const Recommendations = () => {
    const {user} =useContext(UserContext);
    const [recommendations, setRecommendations] = useState([]);
    const [loading, setLoading] = useState();
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalSchemes, setTotalSchemes] = useState(0);
    const [error, setError] = useState(null);

    const fetchRecommendations = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const token = localStorage.getItem('token');
            const data = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/v1/recommendations/general`, {
                params: { page: 1, limit: 6 },
                withCredentials: true,
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
            // console.log(data,recommendations);
            // console.log("dd");

            // console.log('Fetched recommendations:', data);
            if(data.data.data){
                setRecommendations(data.data.data);
                console.log("dd",data.data.data);
            }else{
                 setRecommendations(data.data.data.schemes || []);
            setTotalPages(data.data.data.totalPages);
            setCurrentPage(data.data.data.currentPage);
            setTotalSchemes(data.data.data.totalSchemes);
            }
            

           
        } catch (error) {
            console.error('Failed to fetch recommendations:', error);
            setError('Failed to fetch recommendations. Please try again.');
        } finally {
            setLoading(false);
        }
    }, []);

   useEffect(() => {
    


        fetchRecommendations();
        // Set the flag so it doesn't run again during this session
        
    
}, [user._id, fetchRecommendations]);

    const handlePageChange = (page) => {
        setCurrentPage(page);
        window.scrollTo(0, 0);
    };

    const recommendationsCountText = totalSchemes > 0 
        ? `Showing ${(currentPage-1)*9}-${currentPage*9} of ${totalSchemes} recommended schemes`
        : '';

    if (loading) {
        return (
            <div className="text-center py-8">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#74B83E]"></div>
                <p className="mt-2 text-xl">Loading recommendations...</p>
            </div>
        );
    }

    return (
        <div className="bg-gray-100 min-h-screen">
            
            <section className="container  py-12">
                <h1 className="text-4xl font-bold pt-10 mb-8 text-center">Recommended Schemes for You</h1>

                {/* {error && (
                    <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-8" role="alert">
                        <p>{error}</p>
                    </div>
                )} */}

                {recommendationsCountText && (
                    <p className="text-gray-600 mb-4">{recommendationsCountText}</p>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {recommendations.map((scheme) => (
                        <Link to={`/scheme/${scheme._id}`} key={scheme._id}>
                            <SchemeCard scheme={scheme} />
                        </Link>
                    ))}
                </div>

                {!loading && recommendations.length > 0 && (
                    <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={handlePageChange}
                    />
                )}

                {recommendations.length === 0 && !loading && (
                    <div className="text-center py-8">
                        <Search size={48} className="text-gray-400 mx-auto mb-4" />
                        <p className="text-xl text-gray-600">
                            No recommendations found. Please update your profile preferences.
                        </p>
                    </div>
                )}
            </section>
        </div>
    );
};

export default Recommendations;
