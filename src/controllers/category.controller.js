import { Category, PREDEFINED_CATEGORIES } from "../models/category.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const resetCategories = asyncHandler(async (req, res) => {
    // Drop the collection entirely
    await Category.collection.drop();
    
    // Recreate indexes
    await Category.collection.createIndex(
        { category_name: 1 }, 
        { unique: true }
    );
    
    return res.status(200).json(
        new ApiResponse(200, {}, "Categories reset successfully")
    );
});

let categoriesInitialized = false;

const initializePredefinedCategories = async () => {
    try {
        if (categoriesInitialized) return;

        const existingCategories = await Category.countDocuments();
        console.log("Existing categories count:", existingCategories);

        if (existingCategories === 0) {
            const categoriesToInsert = PREDEFINED_CATEGORIES.map(name => ({
                category_name: name,
                created_by: null
            }));

            const insertedCategories = await Category.insertMany(categoriesToInsert);
            console.log(`Initialized ${insertedCategories.length} predefined categories`);
            categoriesInitialized = true;
        }
    } catch (error) {
        console.error("Error initializing categories:", error);
        throw error;
    }
};

const getCategories = asyncHandler(async (req, res) => {
    await initializePredefinedCategories();
    
    const categories = await Category.find({}).lean();
    console.log(`Retrieved ${categories.length} categories`);

    return res.status(200).json(
        new ApiResponse(200, categories, "Categories fetched successfully")
    );
});

const createCategory = asyncHandler(async (req, res) => {
    const { category_name } = req.body;

    if (!category_name?.trim()) {
        throw new ApiError(400, "Category name is required");
    }

    // Check if category exists in predefined list
    if (PREDEFINED_CATEGORIES.includes(category_name)) {
        throw new ApiError(409, "Category already exists in predefined list");
    }

    // Check if category already exists in database
    const existingCategory = await Category.findOne({ category_name });
    if (existingCategory) {
        throw new ApiError(409, "Category already exists");
    }

    const category = await Category.create({
        category_name,
        created_by: req.user._id
    });

    return res.status(201).json(
        new ApiResponse(201, category, "Category created successfully")
    );
});

const deleteAllCategories = asyncHandler(async (req, res) => {
    await Category.deleteMany({});
    
    return res.status(200).json(
        new ApiResponse(200, {}, "All categories deleted successfully")
    );
});

export {
    resetCategories,
    getCategories,
    createCategory,
    deleteAllCategories
};