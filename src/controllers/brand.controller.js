import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Brand } from "../models/brand.model.js";
import { Creator } from "../models/creator.model.js";

const createBrand = asyncHandler(async (req, res) => {
    const { brand_name, creator } = req.body;

    if (!brand_name || !creator) {
        throw new ApiError(400, "Brand name and creator are required");
    }

    const creatorExists = await Creator.findById(creator);
    if (!creatorExists) {
        throw new ApiError(404, "Creator not found");
    }

    const existingBrand = await Brand.findOne({ brand_name });
    if (existingBrand) {
        throw new ApiError(409, "Brand already exists");
    }

    const brand = await Brand.create({
        brand_name,
        creator
    });

    const populatedBrand = await Brand.findById(brand._id)
        .populate('creator', 'name username');

    return res.status(201).json(
        new ApiResponse(201, populatedBrand, "Brand created successfully")
    );
});

const getBrands = asyncHandler(async (req, res) => {
    const brands = await Brand.find()
        .populate('creator', 'name username')
        .sort('-createdAt');

    return res.status(200).json(
        new ApiResponse(200, brands, "Brands fetched successfully")
    );
});

const getBrandsByCreator = asyncHandler(async (req, res) => {
    const { creatorId } = req.params;

    const brands = await Brand.find({ creator: creatorId })
        .populate('creator', 'name username');

    return res.status(200).json(
        new ApiResponse(200, brands, "Creator brands fetched successfully")
    );
});

const updateBrand = asyncHandler(async (req, res) => {
    const { brand_name } = req.body;
    const { id } = req.params;

    const brand = await Brand.findByIdAndUpdate(
        id,
        { $set: { brand_name } },
        { new: true }
    ).populate('creator', 'name username');

    if (!brand) {
        throw new ApiError(404, "Brand not found");
    }

    return res.status(200).json(
        new ApiResponse(200, brand, "Brand updated successfully")
    );
});

const deleteBrand = asyncHandler(async (req, res) => {
    const { id } = req.params;

    const brand = await Brand.findByIdAndDelete(id);
    if (!brand) {
        throw new ApiError(404, "Brand not found");
    }

    return res.status(200).json(
        new ApiResponse(200, {}, "Brand deleted successfully")
    );
});

export {
    createBrand,
    getBrands,
    getBrandsByCreator,
    updateBrand,
    deleteBrand
};