import News from "../models/news.model.js";

// Get latest news with filters for state, category, and language
export const getLatestNews = async (req, res) => {
    try {
        // Assume these come from query params or the authenticated user profile
        const { state, category, language = 'en' } = req.query;

        // 1. Build the filter
        const filter = { isActive: true };

        // Always show Central news + User's specific state news
        if (state) {
            filter.state = { $in: [state, 'Central'] };
        }

        // Optional category filter (e.g., Agriculture, Education)
        if (category) {
            filter.category = category;
        }

        // 2. Execute query
        const newsList = await News.find(filter)
            .sort({ publishedAt: -1 }) // Newest first
            .limit(20)
            .lean();



        // console.log(newsList);
        

        // 3. Format response to only send the requested language
        // This keeps the payload small for the frontend
        const formattedNews = newsList.map(item => ({
            _id: item._id,
            source: item.source,
            link: item.originalLink,
            publishedAt: item.publishedAt,
            category: item.category,
            state: item.state,
            title: item.content.title,
            summary: item.content.summary,
     
            displayContent: item.content[language] || item.content['en']
        }));

        return res.status(200).json({
            success: true,
            count: formattedNews.length,
            data: formattedNews
        });

    } catch (error) {
        console.error("Error fetching news:", error);
        return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};

// Get specific news detail by ID
export const getLatestNewsById = async (req, res) => {
    try {
        const { id } = req.params;
        const { language = 'en' } = req.query;

        const newsItem = await News.findById(id).lean();

        if (!newsItem) {
            return res.status(404).json({ success: false, message: "News not found" });
        }

        // Return the specific translation plus metadata
        return res.status(200).json({
            success: true,
            data: {
                ...newsItem,
                displayContent: newsItem.content[language] || newsItem.content['en']
            }
        });

    } catch (error) {
        console.error("Error fetching news by ID:", error);
        return res.status(500).json({ success: false, message: "Invalid News ID or Server Error" });
    }
};