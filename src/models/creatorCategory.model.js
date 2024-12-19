import mongoose, {Schema} from "mongoose";

// Define the Creator-Categories Schema (Many-to-Many)
const creatorCategoriesSchema = new Schema(
    {
        creator: {
            type: Schema.Types.ObjectId,
            ref: "Creator",
            required: true,
        },
        category: {
            type: Schema.Types.ObjectId,
            ref: "Category",
            required: true,
        },
    },
    { timestamps: true }
);

export const CreatorCategories = mongoose.model(
    "CreatorCategories",
    creatorCategoriesSchema
);
