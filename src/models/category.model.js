import mongoose, {Schema} from "mongoose";

const categorySchema = new Schema(
    {
        category_name: {
            type: String,
            required: [true, "Category name is required"],
            unique: true,
            trim: true,
            minLength: [2, "Category name must be at least 2 characters"],
            maxLength: [50, "Category name cannot exceed 50 characters"],
            index: true
        },
        created_by: {
            type: Schema.Types.ObjectId,
            ref: "TeamMember",
            required: [true, "Creator is required"],
            index: true
        },
        description: {
            type: String,
            trim: true,
            maxLength: [200, "Description cannot exceed 200 characters"]
        },
        is_active: {
            type: Boolean,
            default: true
        }
    },
    { 
        timestamps: true,
        toJSON: { virtuals: true },
        toObject: { virtuals: true }
    }
);

categorySchema.index({ category_name: 'text' });

export const Category = mongoose.model("Category", categorySchema);
