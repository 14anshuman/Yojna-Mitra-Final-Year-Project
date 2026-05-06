import User from "../models/user.model.js";
import { generateAccessAndRefreshToken } from "../helper/generateAccessAndRefreshToken.js";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";

// signup a new user
const signUp = async (req, res) => {
    try {
        // Destructure the user's data from the request body
        //  console.log(req.body); 
        const { name, email, password, age, gender, state, incomeGroup, interests,phone } = req.body;

        // Check if all fields are provided
        if (!name || !email || !password) {
            return res.status(400).json({
                message: "All fields are required",
                status: 400,
                success: false,
            });
        }

        // Check if the user already exists
        const userExist = await User.findOne({ email: email });
        if (userExist) {
            return res.status(400).json({
                message: "User already exists",
                status: 400,
                success: false,
            });
        }

        // Check for minimum password length
        if (password.length < 6) {
            return res.status(400).json({
                message: "Password must be at least 8 characters long",
                status: 400,
                success: false,
            });
        }

        // Apply email regex
        const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({
                message: "Invalid email format",
                status: 400,
                success: false,
            });
        }

        // Create a new user
        const newUser = new User({ name, email, password, age, gender, state, incomeGroup, interests, phone });
        await newUser.save();

        // fetch user information
        const user = await User.findById(newUser._id).select("-password");

        // Send back the created user's information
        return res.status(201).json({
            message: "User registered successfully",
            user,
            status: 201,
            success: true,
        });
    } catch (error) {
        console.error("error while registering a user", error);
        return res.status(500).json({
            message: "Error while registering a user",
            error: error.message,
            status: 500,
            success: false,
        });
    }
};

// login an existing user
const login = async (req, res) => {
    try {
        // Destructure the user's data from the request body
        const { email, password } = req.body;

        // Check if all fields are provided
        if (!email || !password) {
            return res.status(400).json({
                message: "All fields are required",
                status: 400,
                success: false,
            });
        }

        // Check if the user exists
        const user = await User.findOne({ email: email });
        if (!user) {
            return res.status(400).json({
                message: "User does not exist",
                status: 400,
                success: false,
            });
        }

        

        // Check if the password is correct
        const isMatch = await user.isPasswordCorrect(password);
        if (!isMatch) {
            return res.status(400).json({
                message: "Incorrect password",
                status: 400,
                success: false,
            });
        }

        // Generate access token and refresh token
        const { token, newRefreshToken: refreshToken } = await generateAccessAndRefreshToken(user._id);


        // console.log("Generated tokens:", { token, refreshToken }); // Debugging log

        // Fetch user information
        let userDetails = await User.findById(user._id).select(
            "-password -refreshToken"
        );

        // Add token to userDetails
        userDetails = { ...userDetails.toObject(), token };

        // sending token and refreshToken as cookies
        const options = {
            httpOnly: true,  // Cannot be accessed via JavaScript (only sent with HTTP requests)
            secure: process.env.NODE_ENV === 'production', // Set to true only in production (for HTTPS)
            sameSite: 'None', // Allows cross-origin cookie transmission (important for cross-origin requests)
        };


        // Send back the user's information
        return res
            .status(200)
            .cookie("token", token, options)
            .cookie("refreshToken", refreshToken, options)
            .json({
                message: "User logged in successfully",
                user: userDetails,
                status: 200,
                success: true,
            });
    } catch (error) {
        console.error("error while logging in a user", error);
        return res.status(500).json({
            message: "Error while logging in a user",
            error: error.message,
            status: 500,
            success: false,
        });
    }
};

// Generate a new access token and using the refresh token
const refreshtoken = async (req, res) => {
    try {
        const incomingRefreshToken =
            req.cookies?.refreshToken || req.body?.refreshToken;

        if (!incomingRefreshToken) {
            return res.status(403).json({
                message: "Unauthorized request: Refresh token is required",
                status: 403,
                success: false,
            });
        }

        const decoded = jwt.verify(
            incomingRefreshToken,
            process.env.REFRESH_TOKEN_SECRET
        );


        const user = await User.findById(decoded?._id);

        if (!user) {
            return res.status(401).json({
                message: "Unauthorized request: Invalid refresh token",
                status: 401,
                success: false,
            });
        }

        if (incomingRefreshToken !== user?.refreshToken) {
            return res.status(403).json({
                message: "Unauthorized request: Refresh token in invalid or expired",
                status: 403,
                success: false,
            });
        }

        const options = {
            httpOnly: true,  // Cannot be accessed via JavaScript (only sent with HTTP requests)
            secure: process.env.NODE_ENV === 'production', // Set to true only in production (for HTTPS)
            sameSite: 'None', // Allows cross-origin cookie transmission (important for cross-origin requests)
        };

        const { token, newRefreshToken } =
            await generateAccessAndRefreshToken(user._id);

        return res
            .status(200)
            .cookie("token", token, options)
            .cookie("refreshToken", newRefreshToken, options)
            .json({
                status: 200,
                data: {
                    token: token,
                },
                message: "Access token was updated successfully",
                success: true,
            });
    } catch (error) {
        console.error("Error refreshing access token:", error);
        return res.status(500).json({
            message: "Internal server error",
            error: error.message,
            status: 500,
            success: false,
        });
    }
};

// logout a user
const logout = async (req, res) => {
    try {
        const userId = req.user._id;
        await User.findByIdAndUpdate(
            userId,
            {
                // unset is used to remove this field from mongo, it is better than set refrehToken to null or undef
                $unset: {
                    refreshToken: 1,
                },
            },
            {
                new: true,
            }
        );

        const options = {
            httpOnly: true,  // Cannot be accessed via JavaScript (only sent with HTTP requests)
            secure: process.env.NODE_ENV === 'production', // Set to true only in production (for HTTPS)
            sameSite: 'None', // Allows cross-origin cookie transmission (important for cross-origin requests)
        };
        return res
            .status(200)
            .clearCookie("token", options)
            .clearCookie("refreshToken", options)
            .json({
                status: 200,
                message: "User logged out successfully",
                success: true,
            });
    } catch (error) {
        return res.status(403).json({
            message: "Error while logging out a user",
            error: error.message,
            status: 403,
            success: false,
        });
    }
};


const getMe = async (req, res) => {
    try {
        const userId = req.user._id;
        const user = await User.findById(userId).select("-password -refreshToken");
        return res.status(200).json({
            status: 200,
            data: user,
            message: "User details fetched successfully",
            success: true,
        });

    } catch (error) {
        return res.status(500).json({
            message: "Internal server error",
            error: error.message,
            status: 500,
            success: false,
        });
    }
};

/*
const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true
        },
        email: {
            type: String,
            required: true,
            unique: true,
            // Email validation pattern: matches a standard email format
            match: new RegExp(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/),
        },
        password: {
            type: String,
            required: true,
            minlength: 6,
        },
        phoneNumber: {
            type: String,
        },
        role: {
            type: String,
            enum: ["USER", "ADMIN"],
            default: "USER",
            required: true,
        },

        refreshToken: {
            type: String, // The refresh token itself
            default: null,
        },

        // array of strings
        interests: {
            type: [String],
        },

        incomeGroup: {
            type: String,
            enum: ['EWS', 'General', 'OBC', 'SC', 'ST'],

        },

        state: {
            type: String,
        },

        age: {
            type: Number,
        },

        favorites: {
            type: [mongoose.Schema.Types.ObjectId],
            ref: 'Scheme',
        },

        gender: {
            type: String,
            enum: ['male', 'female', 'other'],
        },

        role: {
            type: String,
            enum: ["USER", "ADMIN"],
            default: "USER",
            required: true,
        },


    },

    { timestamps: true }
);
*/

const putData = async (req, res) => {
  try {
    const userId = req.user._id;

    // Whitelist allowed fields ONLY
    const allowedUpdates = [
      "name",
      "email",
      "phone",
      "age",
      "gender",
      "state",
      "incomeGroup",
      "interests",
    ];

    const updates = {};

    Object.keys(req.body).forEach((key) => {
      if (allowedUpdates.includes(key)) {
        updates[key] = req.body[key];
      }
    });

    // Prevent empty update
    if (!Object.keys(updates).length) {
      return res.status(400).json({
        success: false,
        message: "No valid fields provided for update",
        status: 400,
      });
    }

    const user = await User.findByIdAndUpdate(userId, updates, {
      new: true,
      runValidators: true,   // IMPORTANT
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
        status: 404,
      });
    }

    return res.status(200).json({
      success: true,
      status: 200,
      data: user,
      message: "User details updated successfully",
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      status: 500,
      message: "Internal server error",
      error: error.message,
    });
  }
};


const addToFavorites = async (req, res) => {
    try {
        const { userId, schemeId } = req.body;

        if (!userId || !schemeId) {
            return res.status(400).json({ message: "User ID and Scheme ID are required" });
        }

        // $addToSet adds the ID only if it doesn't already exist in the array
        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { $addToSet: { favorites: schemeId } },
            { new: true } // Returns the updated document
        );

        if (!updatedUser) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json({ 
            message: "Scheme added to favorites", 
            favoritesCount: updatedUser.favorites.length 
        });
    } catch (error) {
        console.error("Favorite Error:", error);
        res.status(500).json({ error: error.message });
    }
};



const getUserFavorites = async (req, res) => {
    try {
        // In a real app, userId comes from the auth middleware (req.user.id)
        const userId = req.user._id;

        // Find user and replace the IDs in the 'favorites' array with the actual objects
        const user = await User.findById(userId).populate({
            path: 'favorites',
            select: 'title description category level state' // Only fetch what the card needs
        });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json({
            success: true,
            favorites: user.favorites
        });
    } catch (error) {
        res.status(500).json({ message: "Error fetching favorites", error: error.message });
    }
};


const removeFromFavorites = async (req, res) => {
    try {
        const {  schemeId } = req.body;
        const userId = req.user._id; // Get user ID from auth middleware

        if (!userId || !schemeId) {
            return res.status(400).json({ message: "User ID and Scheme ID are required" });
        }

        // IMPORTANT: Convert string ID to MongoDB ObjectId
        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { 
                $pull: { favorites: new mongoose.Types.ObjectId(schemeId) } 
            },
            { new: true }
        );

        if (!updatedUser) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json({ 
            success: true, 
            message: "Removed from favorites",
            currentFavorites: updatedUser.favorites // Good for debugging
        });

    } catch (error) {
        console.error("Remove Favorite Error:", error);
        res.status(500).json({ error: error.message });
    }
};

export { signUp, login, refreshtoken, logout, getMe, putData, addToFavorites,removeFromFavorites, getUserFavorites };
