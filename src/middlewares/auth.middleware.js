import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";
import { TeamMember } from "../models/team.model.js";
import { ApiError } from "../utils/ApiError.js";


export const verifyJWT = asyncHandler(async (req, res, next) => {
    try {
        const accessToken = req.cookies?.accessToken || req.headers("Authorization")?.replace("Bearer ", "");
        if (!accessToken) {
            throw new ApiError(401, "Unauthorized Request.");
        }
        const decoded = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET)

        const user = await TeamMember.findById(decoded?._id).select("-password -refreshToken");
        if (!user) {
            throw new ApiError(404, "Invalid access token.");
        }

        req.user = user;
        next();
    } catch (error) {
        throw new ApiError(401, "Invalid access token.");
    }
});