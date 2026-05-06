import mongoose from 'mongoose';

const schemeSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
    },
    url:{
        type: String,
        trim: true,
    },
    description: {
        type: String,
        required: true,
        trim: true,
    },
    keyFeatures: {
        type: [String], // Array of strings
        required: true,
    },
    howToApply: {
        type:[String],
        required: true,
    },
    documentsRequired: {
        type: [String], // Array of strings
        required: true,
    },
    tags: {
        type: [String], // Array of strings (e.g., "education", "health")
        required: true,
    },
    level: {
        type: String,
        enum: ["Central", "State"], // Only "central" or "state" allowed
        required: true,
    },
    ministry: {
        type: String,
        trim: true,
        required: true,
    },
    category: {
        type: [String], 
        required: true, // Array of categories (e.g., "income group", "gender")

    },
    state: {
        type: [String], // Array of states (e.g., "Maharashtra", "Bihar") or "all" for central schemes
        required: true,
        default: ["All"], // Default to "all" for central schemes
    },
    eligibility: {
        type: [String], // Array of strings (e.g., "age 18+", "female", "sc/st")
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now, // Automatically set to current date
    },
    updatedAt: {
        type: Date,
        default: Date.now, // Automatically set to current date
    },
});

// Update the `updatedAt` field before saving
schemeSchema.pre('save', function (next) {
    this.updatedAt = Date.now();
    next();
});

const Scheme = mongoose.model('Scheme', schemeSchema);


export default Scheme;