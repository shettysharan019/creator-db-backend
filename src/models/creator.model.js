import mongoose, {Schema} from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

// Define the Creators Schema
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
            index: true
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

creatorSchema.plugin(mongooseAggregatePaginate);

export const Creator = mongoose.model("Creator", creatorSchema);

