import { asyncHandler } from "../utils/asyncHandler.js";
import { Brand } from "../models/brand.model.js";
import { ApiError } from "../utils/ApiError.js";

// Add a new brand
const addBrand = asyncHandler(async (req, res) => {
    const { name, campaignDetails, creatorId } = req.body;

    const newBrand = await Brand.create({ name, campaignDetails, creatorId });
    res.status(201).json(newBrand);
});

// Get all brands
const getBrands = asyncHandler(async (req, res) => {
    const brands = await Brand.find().populate("creatorId");
    res.status(200).json(brands);
});

// Get a brand by ID
const getBrandById = asyncHandler(async (req, res) => {
    const brand = await Brand.findById(req.params.id).populate("creatorId");
    if (!brand) {
        throw new ApiError(404, "Brand not found.");
    }
    res.status(200).json(brand);
});

// Update a brand by ID
const updateBrand = asyncHandler(async (req, res) => {
    const updatedBrand = await Brand.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!updatedBrand) {
        throw new ApiError(404, "Brand not found.");
    }
    res.status(200).json(updatedBrand);
});

// Delete a brand by ID
const deleteBrand = asyncHandler(async (req, res) => {
    const deletedBrand = await Brand.findByIdAndDelete(req.params.id);
    if (!deletedBrand) {
        throw new ApiError(404, "Brand not found.");
    }
    res.status(204).json(null);
});

export { addBrand, getBrands, getBrandById, updateBrand, deleteBrand };
