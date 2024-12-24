import { TeamMember } from "../models/team.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken";

const generateAccessAndRefreshTokens = async(userId) => {
    try {
        const user = await TeamMember.findById(userId);
        const accessToken = user.generateAccessToken();
        const refreshToken = user.generateRefreshToken();

        user.refreshToken = refreshToken;
        await user.save({ validateBeforeSave: false });

        return { accessToken, refreshToken };
    } catch (error) {
        throw new ApiError(500, "Something went wrong while genreating access and refresh tokens.");
    }
};

// Register user
const registerUser = asyncHandler(async (req, res) => {
    const { name, email, password, role } = req.body
    
    // Validate input data
    if (!name || !email || !password) {
        return res.status(400).json({ message: "All fields are required." });
    }

    // Check if user already exists
    const existingUser = await TeamMember.findOne({ email });
    if (existingUser) {
        throw new ApiError(409, "User with this email already exists.");
    }

    // Create new user
    const newUser = new TeamMember({
        name,
        email,
        password, // Will be hashed in the pre-save hook
        role: role || "member",
    });

    // Save user to database
    const savedUser = await newUser.save();

    // Check for successful user creation
    if (!savedUser) {
        throw new ApiError(500, "Something went wrong while registering the user.");
    }

    // Generate access and refresh tokens
    const accessToken = savedUser.generateAccessToken();
    const refreshToken = savedUser.generateRefreshToken();

    // Store the refresh token in the user document
    savedUser.refreshToken = refreshToken;
    await savedUser.save();

    // Return response (excluding password and refresh token)
    const { _id, name: savedName, email: savedEmail, role: savedRole } = savedUser;
    res.status(201).json({
        message: "User registered successfully.",
        user: { _id, name: savedName, email: savedEmail, role: savedRole },
        tokens: { accessToken, refreshToken },
    });
});

// Login user
const loginUser = asyncHandler(async (req, res) => {
    // Extract credentials from request body with destructuring
    const { email, password } = req.body;

    // Enhanced validation check
    if (!(email && password)) {
        throw new ApiError(400, "Both email and password are required");
    }

    // Find user with email and explicitly select password field
    const user = await TeamMember.findOne({ email }).select("+password");
    
    if (!user) {
        throw new ApiError(404, "User does not exist");
    }

    // Verify password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
        throw new ApiError(401, "Invalid credentials");
    }

    // Generate tokens
    const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(user._id);

    // Get user object without sensitive fields
    const loggedInUser = await TeamMember.findById(user._id).select("-password -refreshToken");

    // Cookie options
    const options = {
        httpOnly: true,
        secure: true,
        sameSite: 'strict'
    };

    // Return response with tokens in cookies and user data
    return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json({
            status: true,
            data: {
                user: loggedInUser,
                accessToken,
                refreshToken
            },
            message: "Login successful"
        });
});

// Logout user
const logoutUser = asyncHandler(async (req, res) => {
    // Clear refresh token from database
    await TeamMember.findByIdAndUpdate(
        req.user._id, 
        {
            $unset: { refreshToken: 1 }
        },
        {
            new: true,
            runValidators: true
        }
    );

    // Enhanced cookie options for security
    const options = {
        httpOnly: true,
        secure: true,
        sameSite: 'strict',
        path: '/',
        domain: process.env.DOMAIN || 'localhost'
    };

    return res
        .status(200)
        .clearCookie("accessToken", options)
        .clearCookie("refreshToken", options)
        .json({
            status: true,
            message: "Logged out successfully"
        });
});

const refreshAccessToken = asyncHandler(async (req, res) => {
    const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken;

    if (!incomingRefreshToken) {
        throw new ApiError(401, "Unauthorized request.");
    }

    try {
        const decoded = jwt.verify(incomingRefreshToken, process.env.REFRESH_TOKEN_SECRET);
        const user = await TeamMember.findById(decoded?._id);

        if(!user){
            throw new ApiError(401, "Invalid refresh token.");
        }

        if(incomingRefreshToken !== user?.refreshToken){
            throw new ApiError(401, "Refresh token is expired or used.");
        }

        const {accessToken, newRefreshToken} = await generateAccessAndRefreshTokens(user._id);
        const options = {
            httpOnly: true,
            secure: true
        };

        return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", newRefreshToken, options)
        .json(
            new ApiResponse(
                200,
                {accessToken, refreshToken: newRefreshToken},
                "Access token refreshed successfully."
            )
        )
    } catch (error) {
        new ApiError(401, "Invalid refresh token.");
    }
})

export { 
    registerUser,
    loginUser,
    logoutUser,
    refreshAccessToken
};
