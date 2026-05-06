import mongoose from "mongoose";
import Scheme from "../models/scheme.model.js";



const createScheme = async (req, res) => {
    try {
        const data = req.body.data;
        const scheme = new Scheme(data);
        await scheme.save();
        res.status(201).json(scheme);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


const getAllSchemes = async (req, res) => {
    try {
        const { 
            page = 1, 
            limit = 10, 
            category, 
            ministry, 
            state, 
            level, 
            gender, 
            incomeGroup,
            search 
        } = req.query;

        const query = {};

        // 1. Exact/Array Match Filters
        if (state && state !== "all") query.state = state;
        if (level && level !== "all") query.level = level;

        // 2. Text Search (for the Title)
        if (search) {
            query.title = { $regex: search, $options: "i" };
        }

        // 3. Category & Ministry (Searching the Category array/string)
        if (category && category !== "all") {
            query.category = { $regex: category, $options: "i" };
        }
        if (ministry && ministry !== "all") {
            query.$or = [
                { category: { $regex: ministry, $options: "i" } },
                { description: { $regex: ministry, $options: "i" } }
            ];
        }

        // 4. Gender & Income Group (Searching inside Eligibility text)
        if (gender && gender !== "all") {
            query.eligibility = { $regex: gender, $options: "i" };
        }
        if (incomeGroup && incomeGroup !== "all") {
            const incomeRegex = { $regex: incomeGroup, $options: "i" };
            if (query.eligibility) {
                query.$and = [
                    { eligibility: query.eligibility },
                    { eligibility: incomeRegex }
                ];
                delete query.eligibility;
            } else {
                query.eligibility = incomeRegex;
            }
        }

        // 5. Paginated Execution + Global Stats
        const skip = (parseInt(page) - 1) * parseInt(limit);
        
        const [
            schemes, 
            totalFiltered, 
            centralCount, 
            stateCount, 
            absoluteTotal
        ] = await Promise.all([
            Scheme.find(query).skip(skip).limit(parseInt(limit)).sort({ createdAt: -1 }).lean(),
            Scheme.countDocuments(query), // Used for pagination
            Scheme.countDocuments({ level: { $regex: /^central$/i } }), // Global Central Stats
            Scheme.countDocuments({ level: { $regex: /^state$/i } }),   // Global State Stats
            Scheme.countDocuments() // Real total schemes in database
        ]);

        res.status(200).json({
            success: true,
            schemes,
            totalSchemes: absoluteTotal, // Total in your entire DB (2507)
            totalFiltered,               // Total matching current filters
            centralCount,
            stateCount,
            totalPages: Math.ceil(totalFiltered / limit),
            currentPage: parseInt(page)
        });

    } catch (error) {
        console.error("Filter Error:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};

const getSchemeFiltered = async (req, res) => {
    try {
        const { category, state, level, gender, incomeGroup, page = 1, limit = 9 } = req.query;
        let query = {};

        // 1. STATE & LEVEL: Direct Matches
        if (state && state !== "all") query.state = state;
        if (level && level !== "all") query.level = level;

        // 2. CATEGORY: Search within the comma-separated category string
        if (category && category !== "all") {
            query.category = { $regex: category, $options: "i" };
        }

        // 3. GENDER & INCOME GROUP: Search within the 'eligibility' or 'description' text
        // Since these aren't separate columns, we search for keywords in the text.
        if (gender && gender !== "all") {
            query.eligibility = { $regex: gender, $options: "i" };
        }

        if (incomeGroup && incomeGroup !== "all") {
            // Searches for terms like "EWS", "BPL", "ST", etc., in eligibility
            query.eligibility = { ...query.eligibility, $regex: incomeGroup, $options: "i" };
        }

        const skip = (page - 1) * limit;
        const [schemes, total] = await Promise.all([
            Scheme.find(query).skip(skip).limit(limit).lean(),
            Scheme.countDocuments(query)
        ]);

        res.status(200).json({
            schemes,
            totalSchemes: total,
            totalPages: Math.ceil(total / limit)
        });

    } catch (error) {
        res.status(500).json({ message: "Filter failed", error: error.message });
    }
};

const getSchemeById = async (req, res) => {
    try {
        const { id } = req.params;
        const scheme = await Scheme.findById(id);
        if (!scheme) {
            return res.status(404).json({ message: 'Scheme not found' });
        }
        res.status(200).json(scheme);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


 




export {
    createScheme,
    getAllSchemes,
    getSchemeFiltered,
    getSchemeById
};
