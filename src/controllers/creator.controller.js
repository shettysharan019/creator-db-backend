import { asyncHandler } from "../utils/asyncHandler.js";
import { Creator } from "../models/creator.model.js";
import { ApiError } from "../utils/ApiError.js";

// Add a new creator
const addCreator = asyncHandler(async (req, res) => {
    const { name, username, profileLink, emailAddress, phoneNumber1, state, city, categories } = req.body;

    const newCreator = await Creator.create({
        name,
        username,
        profileLink,
        emailAddress,
        phoneNumber1,
        state,
        city,
        categories,
        owner: req.user._id
    });

    res.status(201).json(newCreator);
});

// Get all creators
const getCreators = asyncHandler(async (req, res) => {
    const creators = await Creator.find();
    res.status(200).json(creators);
});

// Get a single creator by ID
const getCreatorById = asyncHandler(async (req, res) => {
    const creator = await Creator.findById(req.params.id);
    if (!creator) {
        throw new ApiError(404, "Creator not found.");
    }
    res.status(200).json(creator);
});

// Update a creator by ID
const updateCreator = asyncHandler(async (req, res) => {
    const updatedCreator = await Creator.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!updatedCreator) {
        throw new ApiError(404, "Creator not found.");
    }
    res.status(200).json(updatedCreator);
});

// Delete a creator by ID
const deleteCreator = asyncHandler(async (req, res) => {
    const deletedCreator = await Creator.findByIdAndDelete(req.params.id);
    if (!deletedCreator) {
        throw new ApiError(404, "Creator not found.");
    }
    res.status(204).json(null);
});

export { addCreator, getCreators, getCreatorById, updateCreator, deleteCreator };
