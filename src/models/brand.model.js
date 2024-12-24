import mongoose, { Schema } from "mongoose";

const brandSchema = new Schema(
    {
        brand_name: {
            type: String,
            required: true,
            unique: true,
        },
        creator: {
            type: Schema.Types.ObjectId,
            ref: "Creator",
            required: true,
        },
        date_added: {
            type: Date,
            default: Date.now,
        },
    },
    { timestamps: true }
);

export const Brand = mongoose.model("Brand", brandSchema);