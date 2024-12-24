import { ApiError } from "../utils/ApiError.js";

const validateCreatorInput = (req, res, next) => {
    const { name, username, profile_link, followers } = req.body;

    if (!name?.trim()) {
        throw new ApiError(400, "Name is required");
    }
    if (!username?.trim()) {
        throw new ApiError(400, "Username is required");
    }
    if (!profile_link?.trim()) {
        throw new ApiError(400, "Profile link is required");
    }
    if (!followers || followers < 0) {
        throw new ApiError(400, "Valid followers count is required");
    }

    next();
};

export { validateCreatorInput };