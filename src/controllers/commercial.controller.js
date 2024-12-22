import { asyncHandler } from "../utils/asyncHandler.js";
import { Commercial } from "../models/commercial.model.js";
import { ApiError } from "../utils/ApiError.js";

// Add a new commercial
const addCommercial = asyncHandler(async (req, res) => {
    const { service, amount, currency, creatorId } = req.body;

    // Input validation
    if (!service || !amount || !currency || !creatorId) {
        throw new ApiError(400, "All fields are required");
    }

    // Validate amount is a positive number
    if (amount <= 0) {
        throw new ApiError(400, "Amount must be greater than 0");
    }

    const newCommercial = await Commercial.create({
        service,
        amount,
        currency,
        creatorId
    });

    return res.status(201).json({
        success: true,
        data: newCommercial,
        message: "Commercial created successfully"
    });
});

// Get all commercials
const getCommercials = asyncHandler(async (req, res) => {
    const commercials = await Commercial.find()
        .populate("creatorId", "name email") // Specify fields to populate
        .lean();

    if (!commercials?.length) {
        return res.status(200).json({
            success: true,
            data: [],
            message: "No commercials found"
        });
    }

    return res.status(200).json({
        success: true,
        data: commercials,
        message: "Commercials fetched successfully"
    });
});

// Update a commercial by ID
const updateCommercial = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const updateData = req.body;

    if (!id) {
        throw new ApiError(400, "Commercial ID is required");
    }

    // Validate if commercial exists
    const existingCommercial = await Commercial.findById(id);
    if (!existingCommercial) {
        throw new ApiError(404, "Commercial not found");
    }

    // Validate amount if it's being updated
    if (updateData.amount && updateData.amount <= 0) {
        throw new ApiError(400, "Amount must be greater than 0");
    }

    const updatedCommercial = await Commercial.findByIdAndUpdate(
        id,
        updateData,
        { new: true, runValidators: true }
    ).populate("creatorId", "name email");

    return res.status(200).json({
        success: true,
        data: updatedCommercial,
        message: "Commercial updated successfully"
    });
});

// Delete a commercial by ID
const deleteCommercial = asyncHandler(async (req, res) => {
    const { id } = req.params;

    if (!id) {
        throw new ApiError(400, "Commercial ID is required");
    }

    const deletedCommercial = await Commercial.findByIdAndDelete(id);
    if (!deletedCommercial) {
        throw new ApiError(404, "Commercial not found");
    }

    return res.status(200).json({
        success: true,
        message: "Commercial deleted successfully"
    });
});

export { addCommercial, getCommercials, updateCommercial, deleteCommercial };
