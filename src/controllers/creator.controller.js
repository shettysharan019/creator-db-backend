import { asyncHandler } from "../utils/asyncHandler.js";
import { Creator } from "../models/creator.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Category } from "../models/category.model.js";

const addCreator = asyncHandler(async (req, res) => {
    const {
        name,
        username,
        profile_link,
        followers,
        category,
        email_address,
        gender,
        phone_number_1,
        phone_number_2,
        state,
        city,
        manager_name,
        other_comments
    } = req.body;

    if (!name || !username || !profile_link || !followers) {
        throw new ApiError(400, "All required fields must be provided");
    }

    const existingCreator = await Creator.findOne({
        $or: [{ username }, { profile_link }]
    });

    if (existingCreator) {
        throw new ApiError(409, "Creator with this username or profile link already exists");
    }

    if (!category) {
        throw new ApiError(400, "Category is required");
    }

    const categoryExists = await Category.findById(category);
    if (!categoryExists) {
        throw new ApiError(404, "Category not found");
    }

    const creator = await Creator.create({
        name,
        username,
        profile_link,
        followers,
        category,
        email_address,
        gender,
        phone_number_1,
        phone_number_2,
        state,
        city,
        manager_name,
        other_comments,
        owner: req.user._id
    });

    const populatedCreator = await Creator.findById(creator._id)
        .populate('category', 'name')

    return res.status(201).json(
        new ApiResponse(201, populatedCreator, "Creator created successfully")
    );
});

const getCreators = asyncHandler(async (req, res) => {
    const creators = await Creator.find()
        .populate("owner", "name email")
        .sort("-createdAt");

    return res.status(200).json(
        new ApiResponse(200, creators, "Creators fetched successfully")
    );
});

const getCreatorById = asyncHandler(async (req, res) => {
    const creator = await Creator.findById(req.params.id)
        .populate("owner", "name email");

    if (!creator) {
        throw new ApiError(404, "Creator not found");
    }

    return res.status(200).json(
        new ApiResponse(200, creator, "Creator fetched successfully")
    );
});

const updateCreator = asyncHandler(async (req, res) => {
    const updatedCreator = await Creator.findByIdAndUpdate(
        req.params.id,
        {
            $set: req.body
        },
        { new: true, runValidators: true }
    );

    if (!updatedCreator) {
        throw new ApiError(404, "Creator not found");
    }

    return res.status(200).json(
        new ApiResponse(200, updatedCreator, "Creator updated successfully")
    );
});

const deleteCreator = asyncHandler(async (req, res) => {
    const creator = await Creator.findByIdAndDelete(req.params.id);

    if (!creator) {
        throw new ApiError(404, "Creator not found");
    }

    return res.status(200).json(
        new ApiResponse(200, {}, "Creator deleted successfully")
    );
});

// Search and Filter Creators
const searchCreators = asyncHandler(async (req, res) => {
    const {
        name,
        category,
        state,
        city,
        manager_name,
        minFollowers,
        maxFollowers,
        services
    } = req.query;

    const pipeline = [];

    // Match stage for search criteria
    const matchStage = {};

    if (name) {
        matchStage.name = { $regex: name, $options: 'i' };
    }

    if (category) {
        matchStage.category = new mongoose.Types.ObjectId(category);
    }

    if (state) {
        matchStage.state = { $regex: state, $options: 'i' };
    }

    if (city) {
        matchStage.city = { $regex: city, $options: 'i' };
    }

    if (manager_name) {
        matchStage.manager_name = { $regex: manager_name, $options: 'i' };
    }

    // Followers range
    if (minFollowers || maxFollowers) {
        matchStage.followers = {};
        if (minFollowers) matchStage.followers.$gte = parseInt(minFollowers);
        if (maxFollowers) matchStage.followers.$lte = parseInt(maxFollowers);
    }

    if (Object.keys(matchStage).length > 0) {
        pipeline.push({ $match: matchStage });
    }

    // Lookup stages for related data
    pipeline.push(
        {
            $lookup: {
                from: "categories",
                localField: "category",
                foreignField: "_id",
                as: "categoryInfo"
            }
        },
        {
            $lookup: {
                from: "commercials",
                localField: "_id",
                foreignField: "creator",
                as: "commercials"
            }
        }
    );

    // Filter by services if specified
    if (services) {
        pipeline.push({
            $match: {
                "commercials.service": { 
                    $regex: services, 
                    $options: 'i' 
                }
            }
        });
    }

    // Project stage to format the output
    pipeline.push({
        $project: {
            name: 1,
            username: 1,
            profile_link: 1,
            followers: 1,
            state: 1,
            city: 1,
            manager_name: 1,
            category: { $arrayElemAt: ["$categoryInfo.category_name", 0] },
            services: "$commercials.service",
            email_address: 1,
            phone_number_1: 1,
            phone_number_2: 1,
            created_at: "$createdAt"
        }
    });

    const creators = await Creator.aggregate(pipeline);

    return res.status(200).json(
        new ApiResponse(
            200, 
            creators,
            "Creators fetched successfully"
        )
    );
});

export {
    addCreator,
    getCreators,
    getCreatorById,
    updateCreator,
    deleteCreator,
    searchCreators
};