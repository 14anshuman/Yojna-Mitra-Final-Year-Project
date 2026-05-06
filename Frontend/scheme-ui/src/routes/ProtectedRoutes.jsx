
import { Outlet, Navigate } from "react-router-dom";

import { useEffect } from "react";
import { useContext } from "react";
import { UserContext } from "../context/UserContext";

const ProtectedRoutes = () => {
    // Add a 'loading' state from your Context if you have one
    const { isAuthenticated, checkAuthStatus, loading } = useContext(UserContext);

    useEffect(() => {
        // Only check if we haven't already verified
        if (isAuthenticated === null) {
            checkAuthStatus();
        }
    }, []);

    // IMPORTANT: Stay on the loading screen until the backend/localStorage check finishes
    if (loading || isAuthenticated === null) {
        return (
            <div className="flex items-center justify-center h-screen">
                <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-green-500"></div>
            </div>
        );
    }

    return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
};
export default ProtectedRoutes;
