import mongoose, {Schema} from "mongoose";

// Define the Commercials Schema
const commercialsSchema = new Schema(
    {
        creator: {
            type: Schema.Types.ObjectId,
            ref: "Creator",
            required: true,
        },
        service: {
            type: String,
            required: true,
        },
        amount: {
            type: Number,
            required: true,
            min: 0,
        },
        currency: {
            type: String,
            default: "INR",
        },
        details: {
            type: String,
        },
    },
    { timestamps: true }
);

export const Commercials = mongoose.model("Commercials", commercialsSchema);
