import { asyncHandler } from "../utils/asyncHandler.js";
import { Category } from "../models/category.model.js";
import { ApiError } from "../utils/ApiError.js";

// Add a new category
const addCategory = asyncHandler(async (req, res) => {
    const { name, isCustom } = req.body;

    const newCategory = await Category.create({ name, isCustom });
    res.status(201).json(newCategory);
});

// Get all categories
const getCategories = asyncHandler(async (req, res) => {
    const categories = await Category.find();
    res.status(200).json(categories);
});

// Update a category by ID
const updateCategory = asyncHandler(async (req, res) => {
    const updatedCategory = await Category.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!updatedCategory) {
        throw new ApiError(404, "Category not found.");
    }
    res.status(200).json(updatedCategory);
});

// Delete a category by ID
const deleteCategory = asyncHandler(async (req, res) => {
    const deletedCategory = await Category.findByIdAndDelete(req.params.id);
    if (!deletedCategory) {
        throw new ApiError(404, "Category not found.");
    }
    res.status(204).json(null);
});

export { addCategory, getCategories, updateCategory, deleteCategory };
