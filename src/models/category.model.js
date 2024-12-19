import mongoose, {Schema} from "mongoose";

// Define the Categories Schema
const categorySchema = new Schema(
    {
        category_name: {
            type: String,
            required: true,
            unique: true,
            trim: true,
        },
        created_by: {
            type: Schema.Types.ObjectId,
            ref: "TeamMember",
            required: true,
        },
        date_added: {
            type: Date,
            default: Date.now,
        },
    },
    { timestamps: true }
);

export const Category = mongoose.model("Category", categorySchema);
