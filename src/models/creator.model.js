import mongoose, { Schema } from "mongoose";

const creatorSchema = new Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },
        username: {
            type: String,
            required: true,
            unique: true,
        },
        profile_link: {
            type: String,
            required: true,
            unique: true,
        },
        followers: {
            type: Number,
            required: true,
            min: 0,
        },
        category: {
            type: Schema.Types.ObjectId,
            ref: "Category",
            required: true
        },
        categoryName: {
            type: String,
            required: false
        },
        email_address: {
            type: String,
        },
        gender: {
            type: String,
            enum: ["male", "female", "other"],
        },
        phone_number_1: {
            type: String,
        },
        phone_number_2: {
            type: String,
        },
        state: {
            type: String,
        },
        city: {
            type: String,
        },
        manager_name: {
            type: String,
        },
        owner: {
            type: Schema.Types.ObjectId,
            ref: "TeamMember",
            required: true,
        },
        other_comments: {
            type: String,
        },
        date_added: {
            type: Date,
            default: Date.now,
        },
    },
    { timestamps: true }
);

export const Creator = mongoose.model("Creator", creatorSchema);