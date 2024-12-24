import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";
import { TeamMember } from "../models/team.model.js";
import { ApiError } from "../utils/ApiError.js";

export const verifyJWT = asyncHandler(async (req, res, next) => {
    const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
        throw new ApiError(401, "Authentication required. Please login.");
    }

    try {
        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        
        const user = await TeamMember.findById(decodedToken?._id).select("-password -refreshToken");
        
        if (!user) {
            throw new ApiError(401, "Invalid access token");
        }

        req.user = user;
        next();
    } catch (error) {
        throw new ApiError(401, "Invalid access token. Please login again.");
    }
});