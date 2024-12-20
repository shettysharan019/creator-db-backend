import { TeamMember } from "../models/team.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";

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

export { registerUser };
