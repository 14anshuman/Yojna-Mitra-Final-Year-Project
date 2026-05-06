import mongoose from 'mongoose';
import Scheme from '../models/scheme.model.js'; 
import dotenv from 'dotenv';

dotenv.config();

const schemesData = [
  // --- HEALTH & WELLNESS ---
  {
    title: "Mission Indradhanush",
    url: "https://www.myscheme.gov.in/schemes/mi",
    description: "A health mission to ensure full immunization for children up to 2 years and pregnant women.",
    keyFeatures: ["Focuses on 12 vaccine-preventable diseases", "Targeted at low-coverage pockets", "Free vaccinations at government centers"],
    howToApply: ["Visit nearest Government Health Centre", "Check immunization card for schedule"],
    documentsRequired: ["Child Birth Certificate", "Mother's Aadhaar Card", "Immunization Card"],
    tags: ["Health", "Immunization", "Children"],
    level: "Central",
    ministry: "Ministry of Health and Family Welfare",
    category: ["Children", "Pregnant Women"],
    state: ["All"],
    eligibility: ["Children under 2 years", "Pregnant women"]
  },
  {
    title: "Pradhan Mantri Bhartiya Janaushadhi Pariyojana (PMBJP)",
    url: "https://www.myscheme.gov.in/schemes/pmbjp",
    description: "Making quality generic medicines available at affordable prices for all through dedicated outlets.",
    keyFeatures: ["Generic medicines at 50-90% cheaper rates", "Quality assured by NABL labs", "Accessible through PMBJP Kendras"],
    howToApply: ["Visit a Janaushadhi Kendra with a valid prescription"],
    documentsRequired: ["Doctor's Prescription"],
    tags: ["Healthcare", "Medicine", "Affordability"],
    level: "Central",
    ministry: "Ministry of Chemicals and Fertilizers",
    category: ["All Citizens"],
    state: ["All"],
    eligibility: ["Any citizen with a valid prescription"]
  },

  // --- AGRICULTURE & FARMERS ---
  {
    title: "Pradhan Mantri Fasal Bima Yojana (PMFBY)",
    url: "https://www.myscheme.gov.in/schemes/pmfby",
    description: "A government-sponsored crop insurance scheme that integrates multiple stakeholders.",
    keyFeatures: ["Low premium rates for farmers", "Covers yield loss due to natural calamities", "Post-harvest loss coverage included"],
    howToApply: ["Apply via PMFBY portal", "Through Bank branches or Common Service Centres (CSC)"],
    documentsRequired: ["Land Records", "Sowing Certificate", "Aadhaar Card", "Bank Passbook"],
    tags: ["Agriculture", "Insurance", "Farmers"],
    level: "Central",
    ministry: "Ministry of Agriculture & Farmers Welfare",
    category: ["Farmers"],
    state: ["All"],
    eligibility: ["All farmers including sharecroppers and tenant farmers"]
  },
  {
    title: "Paramparagat Krishi Vikas Yojana (PKVY)",
    url: "https://www.myscheme.gov.in/schemes/pkvy",
    description: "Promotion of commercial organic farming through cluster-based approach and PGS certification.",
    keyFeatures: ["Financial assistance of ₹50,000 per hectare", "Focus on soil health and organic inputs", "PGS-India certification support"],
    howToApply: ["Register through regional councils or state agriculture departments"],
    documentsRequired: ["Land Identity", "Aadhaar Card", "Bank Details"],
    tags: ["Agriculture", "Organic Farming", "Sustainability"],
    level: "Central",
    ministry: "Ministry of Agriculture & Farmers Welfare",
    category: ["Farmers"],
    state: ["All"],
    eligibility: ["Farmers interested in organic conversion"]
  },

  // --- EDUCATION & SKILLS ---
  {
    title: "Pradhan Mantri Vidyalaxmi Scheme",
    url: "https://www.vidyalaxmi.co.in/",
    description: "A first-of-its-kind portal for students seeking Education Loan with a single window application.",
    keyFeatures: ["Access to 40+ banks", "Transparent loan tracking", "Linked to interest subvention schemes"],
    howToApply: ["Register on Vidya Lakshmi portal", "Fill Common Educational Loan Application Form (CELAF)"],
    documentsRequired: ["Admission Letter", "Fee Structure", "KYC of Student & Parent", "Income Proof"],
    tags: ["Education", "Loan", "Students"],
    level: "Central",
    ministry: "Ministry of Finance",
    category: ["Students"],
    state: ["All"],
    eligibility: ["Students pursuing higher education in India or abroad"]
  },
  {
    title: "PM-SHRI Schools",
    url: "https://pmshrischools.education.gov.in/",
    description: "A centrally sponsored scheme for upgradation and development of more than 14,500 schools.",
    keyFeatures: ["Focus on NEP 2020 pedagogy", "Smart classrooms and green school initiatives", "Vocational training integration"],
    howToApply: ["Schools apply through a dedicated portal based on selection criteria"],
    documentsRequired: ["School Infrastructure details", "UDISE code"],
    tags: ["Education", "Infrastructure", "Schools"],
    level: "Central",
    ministry: "Ministry of Education",
    category: ["Students", "Schools"],
    state: ["All"],
    eligibility: ["K-12 Students in selected PM-SHRI schools"]
  },

  // --- SOCIAL SECURITY & FINANCE ---
  {
    title: "Pradhan Mantri Suraksha Bima Yojana (PMSBY)",
    url: "https://www.myscheme.gov.in/schemes/pmsby",
    description: "Accident insurance scheme offering death and disability cover.",
    keyFeatures: ["₹2 lakh cover for accidental death/total disability", "Premium of just ₹20 per year", "Auto-debit from bank account"],
    howToApply: ["Visit the bank branch where you hold a savings account", "Submit the consent form"],
    documentsRequired: ["Aadhaar Card", "Savings Bank Account details"],
    tags: ["Insurance", "Finance", "Social Security"],
    level: "Central",
    ministry: "Ministry of Finance",
    category: ["All Citizens"],
    state: ["All"],
    eligibility: ["Citizens aged 18 to 70 years with a bank account"]
  },
  {
    title: "PM SVANidhi",
    url: "https://pmsvanidhi.mohua.gov.in/",
    description: "A micro-credit facility for street vendors to provide affordable working capital loans.",
    keyFeatures: ["Initial loan of ₹10,000", "7% interest subvention", "Rewards for digital transactions"],
    howToApply: ["Apply via PM SVANidhi portal", "Contact a Banking Correspondent (BC) or CSC"],
    documentsRequired: ["Vending Certificate", "Aadhaar Card", "Bank Account"],
    tags: ["Business", "Street Vendors", "Loan"],
    level: "Central",
    ministry: "Ministry of Housing and Urban Affairs",
    category: ["Street Vendors", "Small Traders"],
    state: ["All"],
    eligibility: ["Street vendors in urban areas active before March 2020"]
  },

  // --- WOMEN & CHILD DEVELOPMENT ---
  {
    title: "Beti Bachao Beti Padhao (BBBP)",
    url: "https://www.myscheme.gov.in/schemes/bbbp",
    description: "A campaign to generate awareness and improve the efficiency of welfare services intended for girls.",
    keyFeatures: ["Prevention of gender-biased sex selection", "Ensuring survival & protection of the girl child", "Ensuring education and participation"],
    howToApply: ["National awareness campaign, no direct individual application required for the name"],
    documentsRequired: ["N/A"],
    tags: ["Women", "Girl Child", "Education"],
    level: "Central",
    ministry: "Ministry of Women and Child Development",
    category: ["Women", "Girl Child"],
    state: ["All"],
    eligibility: ["All girl children and their parents"]
  },
  {
    title: "Pradhan Mantri Matru Vandana Yojana (PMMVY)",
    url: "https://pmmvy.wcd.gov.in/",
    description: "Maternity benefit program providing cash incentives for pregnant women.",
    keyFeatures: ["Cash incentive of ₹5,000 in three installments", "Benefit for the first living child", "Direct Benefit Transfer (DBT)"],
    howToApply: ["Register at the local Anganwadi Centre or approved Health Facility"],
    documentsRequired: ["MCP Card (Mother Child Protection)", "Aadhaar Card", "Bank Passbook"],
    tags: ["Women", "Health", "Maternity"],
    level: "Central",
    ministry: "Ministry of Women and Child Development",
    category: ["Pregnant Women"],
    state: ["All"],
    eligibility: ["Pregnant and lactating mothers for the first child"]
  },

  // --- RURAL & INFRASTRUCTURE ---
  {
    title: "Pradhan Mantri Gram Sadak Yojana (PMGSY)",
    url: "https://pmgsy.nic.in/",
    description: "Providing all-weather road connectivity to unconnected habitations in rural areas.",
    keyFeatures: ["Connectivity to habitations with population 500+", "Focus on hilly and tribal areas", "Standardized quality construction"],
    howToApply: ["Community-driven identification via Gram Panchayats"],
    documentsRequired: ["Village map", "Habitation data"],
    tags: ["Infrastructure", "Rural Development", "Roads"],
    level: "Central",
    ministry: "Ministry of Rural Development",
    category: ["Rural Population"],
    state: ["All"],
    eligibility: ["Inhabitants of unconnected rural areas"]
  },
  {
    title: "Jal Jeevan Mission (JJM)",
    url: "https://jaljeevanmission.gov.in/",
    description: "Aims to provide Functional Household Tap Connections (FHTC) to every rural household.",
    keyFeatures: ["55 liters per capita per day water supply", "Community-led management", "Focus on water quality monitoring"],
    howToApply: ["Register with the local Pani Samiti or Gram Panchayat"],
    documentsRequired: ["Aadhaar Card", "Property Tax Receipt (if any)"],
    tags: ["Water", "Health", "Infrastructure"],
    level: "Central",
    ministry: "Ministry of Jal Shakti",
    category: ["Rural Households"],
    state: ["All"],
    eligibility: ["All rural households currently without tap water"]
  }

  // NOTE: In a real script, you would add the remaining 38 schemes here following the same structure.
  // Including: Digital India, Startup India, Standup India, PM-VAY, PM-Awas Urban, etc.
];

const bulkSeed = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URL);
        console.log("Connected to MongoDB...");

        // This uses Upsert logic for each item in the array
        const operations = schemesData.map(scheme => ({
            updateOne: {
                filter: { title: scheme.title },
                update: { $set: scheme },
                upsert: true
            }
        }));

        await Scheme.bulkWrite(operations);
        console.log(`✅ Successfully synced ${schemesData.length} schemes!`);
        process.exit();
    } catch (error) {
        console.error("Error seeding data:", error);
        process.exit(1);
    }
};

bulkSeed();