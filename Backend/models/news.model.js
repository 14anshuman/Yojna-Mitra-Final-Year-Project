import mongoose from 'mongoose';

const newsSchema = new mongoose.Schema({
    // Original metadata from the source
    source: {
        type: String,
        required: true,
        default: 'PIB' // e.g., PIB, State Portal, NewsAPI
    },
    originalLink: {
        type: String,
        required: true,
        unique: true // Prevents duplicate news entries
    },
    publishedAt: {
        type: Date,
        required: true
    },

    // Geographical and Interest Filtering
    state: {
        type: String,
        default: 'Central', // 'Central' or specific state name like 'Punjab'
        index: true
    },
    category: {
        type: String,
        enum: ['Agriculture', 'Education', 'Health', 'Finance', 'Housing', 'Women Welfare', 'General'],
        default: 'General',
        index: true
    },

    // Multilingual Content (AI-generated)
    // This allows you to store the translation once and serve it instantly
    content: {
        title:String,
        summary: [String],    // You can dynamically add more language codes as needed
    },

    isActive: {
        type: Boolean,
        default: true
    }
}, { timestamps: true });

// Indexing for faster queries when users filter by their profile
newsSchema.index({ state: 1, category: 1, publishedAt: -1 });

const News = mongoose.model('News', newsSchema);

export default News;