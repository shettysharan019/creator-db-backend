import mongoose, { Schema } from "mongoose";

const PREDEFINED_CATEGORIES = [
    "Artist",
    "Musician/band",
    "Blogger",
    "Clothing (Brand)",
    "Community",
    "Digital creator",
    "Education",
    "Entrepreneur",
    "Health/beauty",
    "Editor",
    "Writer",
    "Personal blog",
    "Product/service",
    "Gamer",
    "Restaurant",
    "Beauty, cosmetic & personal care",
    "Grocery Store",
    "Photographer",
    "Shopping & retail",
    "Video creator"
];

const categorySchema = new Schema({
    category_name: {
        type: String,
        required: [true, "Category name is required"],
        unique: true,
        trim: true,
        validate: {
            validator: function(v) {
                return v && v.length > 0;
            },
            message: "Category name cannot be empty"
        }
    },
    created_by: {
        type: Schema.Types.ObjectId,
        ref: "TeamMember"
    }
}, { timestamps: true });

export const Category = mongoose.model("Category", categorySchema);
export { PREDEFINED_CATEGORIES };
