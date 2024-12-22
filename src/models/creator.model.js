import mongoose, {Schema} from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

const creatorSchema = new Schema(
    {
        name: {
            type: String,
            required: [true, "Name is required"],
            trim: true,
            minLength: [2, "Name must be at least 2 characters"],
            maxLength: [50, "Name cannot exceed 50 characters"]
        },
        username: {
            type: String,
            required: [true, "Username is required"],
            unique: true,
            trim: true,
            lowercase: true,
            index: true,
            minLength: [3, "Username must be at least 3 characters"]
        },
        profile_link: {
            type: String,
            required: [true, "Profile link is required"],
            unique: true,
            trim: true,
            validate: {
                validator: function(v) {
                    return /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/.test(v);
                },
                message: "Please enter a valid URL"
            }
        },
        followers: {
            type: Number,
            required: true,
            min: [0, "Followers cannot be negative"],
            default: 0
        },
        email_address: {
            type: String,
            trim: true,
            lowercase: true,
            validate: {
                validator: function(v) {
                    return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(v);
                },
                message: "Please enter a valid email address"
            }
        },
        gender: {
            type: String,
            enum: {
                values: ["male", "female", "other"],
                message: "{VALUE} is not a valid gender"
            },
            lowercase: true
        },
        phone_number_1: {
            type: String,
            validate: {
                validator: function(v) {
                    return /^\+?[\d\s-]{10,}$/.test(v);
                },
                message: "Please enter a valid phone number"
            }
        },
        phone_number_2: {
            type: String,
            validate: {
                validator: function(v) {
                    return !v || /^\+?[\d\s-]{10,}$/.test(v);
                },
                message: "Please enter a valid phone number"
            }
        },
        state: {
            type: String,
            trim: true
        },
        city: {
            type: String,
            trim: true
        },
        manager_name: {
            type: String,
            trim: true
        },
        owner: {
            type: Schema.Types.ObjectId,
            ref: "TeamMember",
            required: [true, "Owner is required"],
            index: true
        },
        other_comments: {
            type: String,
            trim: true,
            maxLength: [500, "Comments cannot exceed 500 characters"]
        }
    },
    { 
        timestamps: true,
        toJSON: { virtuals: true },
        toObject: { virtuals: true }
    }
);

creatorSchema.index({ name: 'text', username: 'text' });
creatorSchema.plugin(mongooseAggregatePaginate);

export const Creator = mongoose.model("Creator", creatorSchema);
