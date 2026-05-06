import Scheme from "../models/scheme.model.js";
import User from "../models/user.model.js";

export const generateRecommendations = async (userId, options) => {
    try {
        const userProfile = await User.findById(userId);
        if (!userProfile) throw new Error('User not found');

        const page = parseInt(options.page) || 1;
        const limit = parseInt(options.limit) || 9;
        const skip = (page - 1) * limit;

        // 1. Build Query (State + Central)
        const query = {
            state: { $in: [userProfile.state, 'Central', 'All', 'State'] }
        };

        if (userProfile.interests?.length > 0) {
            query.category = { $in: userProfile.interests };
        }

        // console.log(query);

        // 2. Fetch data and count total simultaneously for efficiency
        const [schemes, totalDocs] = await Promise.all([
            Scheme.find(query)
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit)
                .select('title state level ministry category tags description imageUrl')
                .lean(),
            Scheme.countDocuments(query)
        ]);

        const totalPages = Math.ceil(totalDocs / limit);
        // console.log(schemes.length)
        // 3. Fallback logic if no matches
        if (!schemes.length) {
            const randomSchemes = await Scheme.aggregate([
                { $sample: { size: 9 } },
                { 
                    $project: {
                        title: 1, state: 1, level: 1, ministry: 1, 
                        category: 1, tags: 1, description: 1, imageUrl: 1 
                    }
                }
            ]);

            return {
                schemes:  randomSchemes,
                totalPages: 1,
                currentPage: 1,
                totalSchemes: randomSchemes.length,
                hasNextPage: false,
                hasPrevPage: false,
                isRandomized: true
            };
        }

        return {
            schemes,
            totalPages,
            currentPage: page,
            totalSchemes: totalDocs,
            hasNextPage: page < totalPages,
            hasPrevPage: page > 1,
            isRandomized: false
        };

    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
};
