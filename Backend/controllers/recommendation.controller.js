import { generateRecommendations } from "../services/recommendation.service.js";
import {generateAiRecommendations} from "../services/DEPrecommendation.service.js";
import User from "../models/user.model.js";
import axios from "axios";

export const getPersonalizedRecommendations = async (req, res) => {
    try {
        const userId = req.user._id;
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 6;
        // console.log(page,limit);

        const userProfile = await User.findById(userId);

        // console.log('User Profile:',userProfile);

        const aiRecommendations = await generateAiRecommendations(userProfile);
        // console.log('AI Recommendations:', aiRecommendations.length);
        // console.log(aiRecommendations);
        

        if (aiRecommendations.length > 0) {
            // If AI recommendations are available, use them
            return res.status(200).json({
            success: true,
            data: aiRecommendations,
            message: 'Recommendations fetched successfully'
        });
        }

        
        
        const options = {
            page,
            limit,
            sort: { createdAt: -1 }
        };

        const recommendations = await generateRecommendations(userId, options);

        return res.status(200).json({
            success: true,
            data: recommendations,
            message: 'Recommendations fetched successfully'
        });
    } catch (error) {
        console.error('Error getting recommendations:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Error getting recommendations',
            error: error.message 
        });
    }
};


export const recommendationModelController = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 9;

        const userId = req.user._id;

        const userProfile = await User.findById(userId);

        if (!userProfile) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }
        const { interests } = userProfile;

        // Call ML API
        const response = await axios.post("http://127.0.0.1:8000/recommend", {
            interests,
            
        });

        let schemes = response.data;

        // ---------------- Pagination (IMPORTANT)
        const startIndex = (page - 1) * limit;
        const paginatedSchemes = schemes.slice(startIndex, startIndex + limit);

        return res.status(200).json({
            success: true,
            total: schemes.length,
            page,
            limit,
            data: paginatedSchemes
        });

    } catch (error) {
        console.error("Recommendation Error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to fetch recommendations"
        });
    }
};