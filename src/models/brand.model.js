import mongoose, {Schema} from "mongoose";

const brandSchema = new Schema(
    {
        brand_name: {
            type: String,
            required: [true, "Brand name is required"],
            unique: true,
            trim: true,
            minLength: [2, "Brand name must be at least 2 characters"],
            maxLength: [50, "Brand name cannot exceed 50 characters"],
            index: true
        },
        creator: {
            type: Schema.Types.ObjectId,
            ref: "Creator",
            required: [true, "Creator is required"],
            index: true
        },
        logo_url: {
            type: String,
            trim: true,
            validate: {
                validator: function(v) {
                    return !v || /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/.test(v);
                },
                message: "Please enter a valid URL"
            }
        },
        website: {
            type: String,
            trim: true,
            validate: {
                validator: function(v) {
                    return !v || /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/.test(v);
                },
                message: "Please enter a valid URL"
            }
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

brandSchema.index({ brand_name: 'text' });

export const Brand = mongoose.model("Brand", brandSchema);
