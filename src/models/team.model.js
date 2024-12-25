import mongoose, { Schema } from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const teamMemberSchema = new Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
        },
        password: {
            type: String,
            required: [true, "Password is required"],
        },
        role: {
            type: String,
            enum: ["admin", "member"],
            default: "member",
        },
        refreshToken: { 
            type: String, 
            default: null 
        },
        date_joined: {
            type: Date,
            default: Date.now,
        },
    },
    { timestamps: true }
);

// Hash password before saving
teamMemberSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();
    this.password = await bcrypt.hash(this.password, 10);
    next();
});

// Compare passwords for login
teamMemberSchema.methods.comparePassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

teamMemberSchema.methods.generateAccessToken = function () {
    return jwt.sign({ 
        _id: this._id,
        name: this.name,
        email: this.email
    }, 
    process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
    });
};

teamMemberSchema.methods.generateRefreshToken = function () {
    return jwt.sign({ 
        _id: this._id 
    }, 
    process.env.REFRESH_TOKEN_SECRET, {
        expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
    });
};

// Add permissions for member role
teamMemberSchema.methods.hasPermission = function(action) {
    const memberPermissions = {
        search: true,
        add: true,
        edit: false,
        delete: false
    };
    
    return this.role === 'admin' ? true : memberPermissions[action];
};

export const TeamMember = mongoose.model("TeamMember", teamMemberSchema);
