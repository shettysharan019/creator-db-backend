import { asyncHandler } from "../utils/asyncHandler.js";
import { Commercial } from "../models/commercial.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const createCommercial = asyncHandler(async (req, res) => {
    const { creator, service, amount, currency = "INR", details } = req.body;

    if (!creator || !service || !amount) {
        throw new ApiError(400, "All required fields must be provided");
    }

    const commercial = await Commercial.create({
        creator,
        service,
        amount,
        currency,
        details
    });

    const populatedCommercial = await Commercial.findById(commercial._id)
        .populate("creator", "name username");

    return res.status(201).json(
        new ApiResponse(201, populatedCommercial, "Commercial created successfully")
    );
});

const getCommercials = asyncHandler(async (req, res) => {
    const commercials = await Commercial.find()
        .populate("creator", "name username")
        .sort("-createdAt");

    return res.status(200).json(
        new ApiResponse(200, commercials, "Commercials fetched successfully")
    );
});

const getCommercialById = asyncHandler(async (req, res) => {
    const commercial = await Commercial.findById(req.params.id)
        .populate("creator", "name username");

    if (!commercial) {
        throw new ApiError(404, "Commercial not found");
    }

    return res.status(200).json(
        new ApiResponse(200, commercial, "Commercial fetched successfully")
    );
});

const updateCommercial = asyncHandler(async (req, res) => {
    const updatedCommercial = await Commercial.findByIdAndUpdate(
        req.params.id,
        { $set: req.body },
        { new: true, runValidators: true }
    ).populate("creator", "name username");

    if (!updatedCommercial) {
        throw new ApiError(404, "Commercial not found");
    }

    return res.status(200).json(
        new ApiResponse(200, updatedCommercial, "Commercial updated successfully")
    );
});

const deleteCommercial = asyncHandler(async (req, res) => {
    const commercial = await Commercial.findByIdAndDelete(req.params.id);

    if (!commercial) {
        throw new ApiError(404, "Commercial not found");
    }

    return res.status(200).json(
        new ApiResponse(200, {}, "Commercial deleted successfully")
    );
});

export {
    createCommercial,
    getCommercials,
    getCommercialById,
    updateCommercial,
    deleteCommercial
};