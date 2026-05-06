import fs from "fs";
import csv from "csv-parser";
import mongoose from "mongoose";
import dotenv from "dotenv";
import Scheme from "../models/scheme.model.js";


dotenv.config();

const runImport = async () => {
    await mongoose.connect(process.env.MONGODB_URL);
    const results = [];

    // 1. USE PROPER PARSER OPTIONS
    // 'quote' and 'escape' help handle commas inside text blocks
    fs.createReadStream("./data/updated_data.csv")
        .pipe(csv({ 
            mapHeaders: ({ header }) => header.trim().toLowerCase(),
            skipLines: 0 
        }))
        .on("data", (row) => results.push(row))
        .on("end", async () => {
            const bulkOps = results.map((row) => {
                
                // --- COLUMN SHIFT PROTECTION LOGIC ---
                // If 'documents' contains "State" or "Central", the row shifted.
                // We need to look at the next available columns to find the real documents.
                let level = row.level;
                let docs = row.documents;
                let categoryRaw = row.category;

                const isShifted = (val) => val === "State" || val === "Central";

                if (isShifted(docs)) {
                    // If documents contains the level, everything shifted right by 1
                    level = docs;
                    docs = row.application; // Look one column back or ahead depending on your CSV
                }

                // --- ACCURATE CATEGORY MAPPING ---
                // We check 'category' AND 'unnamed: 9' (the hidden column in your CSV)
                let finalCategory = row.category || "";
                if (row['unnamed: 9'] && row['unnamed: 9'].length > 2) {
                    finalCategory = row['unnamed: 9'];
                }

                const categoryArray = finalCategory
                    .split(/[,\n]/)
                    .map(v => v.trim())
                    .filter(v => v && v.toLowerCase() !== "state" && v.toLowerCase() !== "central");

                // --- DATA CLEANING ---
                const normalized = {
                    title: row.title?.replace(/^"|"$/g, '').trim(),
                    // This removes the "carriage return" (\r) safely and 
// ignores the accidental question marks you might have introduced
description: row.description
    ?.trim()
    .replace(/\r/g, '')        // Remove carriage returns
    .replace(/\?/g, '')       // ONLY use this if your text has '?' where it shouldn't be
    .replace(/\n{2,}/g, '\n'),// Clean up double newlines
                    
                    // Filter out "State/Central" if they leaked into arrays
                    documentsRequired: docs?.split(/\r?\n|\.(?=\s[A-Z])/)
                        .map(v => v.trim())
                        .filter(v => v.length > 3 && !isShifted(v)),

                    keyFeatures: row.benefits?.split(/\r?\n|[?*•]/)
                        .map(v => v.trim())
                        .filter(v => v.length > 5),

                    howToApply: (row['application '] || row['application'] || "")
                        .split(/\r?\n|Step \d+:|[?*•]/)
                        .map(v => v.trim())
                        .filter(v => v.length > 5),

                    category: categoryArray.length > 0 ? categoryArray : ["General"],
                    level: isShifted(level) ? level : (row.level || "State"),
                    tags: row.tags?.split(/[,\n]/).map(v => v.trim()).filter(v => v),
                    eligibility: row.eligibility?.split(/\r?\n|[?*.]/)
                        .map(v => v.trim())
                        .filter(v => v.length > 5),
                    state: row.description?.includes("Puducherry") ? ["Puducherry"] : ["All"],
                    ministry: "Unknown Ministry"
                };

                return {
                    updateOne: {
                        filter: { title: normalized.title },
                        update: { $set: normalized },
                        upsert: true
                    }
                };
            });

            await Scheme.bulkWrite(bulkOps.filter(op => op.updateOne.update.$set.title));
            console.log("Import Successful");
            process.exit();
        });
};

runImport();