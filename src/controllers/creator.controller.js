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

export {
    addCreator,
    getCreators,
    getCreatorById,
    updateCreator,
    deleteCreator
};