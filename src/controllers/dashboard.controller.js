import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Creator } from "../models/creator.model.js";
import { Commercial } from "../models/commercial.model.js";
import mongoose from "mongoose";

const getCreatorsByCategory = asyncHandler(async (req, res) => {
    const stats = await Creator.aggregate([
        {
            $lookup: {
                from: "categories",
                localField: "category",
                foreignField: "_id",
                as: "categoryInfo"
            }
        },
        {
            $group: {
                _id: "$category",
                categoryName: { $first: { $arrayElemAt: ["$categoryInfo.category_name", 0] } },
                count: { $sum: 1 }
            }
        },
        {
            $project: {
                category: "$_id",
                categoryName: 1,
                count: 1,
                _id: 0
            }
        }
    ]);

    return res.status(200).json(
        new ApiResponse(200, stats, "Creator statistics by category fetched successfully")
    );
});

const getTotalEarnings = asyncHandler(async (req, res) => {
    const { startDate, endDate } = req.query;
    
    const matchStage = {};
    if (startDate || endDate) {
        matchStage.createdAt = {};
        if (startDate) matchStage.createdAt.$gte = new Date(startDate);
        if (endDate) matchStage.createdAt.$lte = new Date(endDate);
    }

    const earnings = await Commercial.aggregate([
        {
            $match: matchStage
        },
        {
            $group: {
                _id: "$currency",
                totalAmount: { $sum: "$amount" },
                numberOfDeals: { $sum: 1 }
            }
        }
    ]);

    return res.status(200).json(
        new ApiResponse(200, earnings, "Total earnings fetched successfully")
    );
});

const getCreatorGrowth = asyncHandler(async (req, res) => {
    const { period = 'monthly' } = req.query;

    let groupByFormat;
    switch (period) {
        case 'daily':
            groupByFormat = { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } };
            break;
        case 'weekly':
            groupByFormat = { $week: "$createdAt" };
            break;
        case 'monthly':
        default:
            groupByFormat = { $dateToString: { format: "%Y-%m", date: "$createdAt" } };
    }

    const growth = await Creator.aggregate([
        {
            $group: {
                _id: groupByFormat,
                newCreators: { $sum: 1 }
            }
        },
        {
            $sort: { _id: 1 }
        }
    ]);

    return res.status(200).json(
        new ApiResponse(200, growth, "Creator growth statistics fetched successfully")
    );
});

const getDashboardSummary = asyncHandler(async (req, res) => {
    const totalCreators = await Creator.countDocuments();
    const totalCommercials = await Commercial.countDocuments();
    
    const totalEarnings = await Commercial.aggregate([
        {
            $group: {
                _id: null,
                total: { $sum: "$amount" }
            }
        }
    ]);

    const recentCreators = await Creator.find()
        .sort("-createdAt")
        .limit(5)
        .populate("category", "category_name");

    const summary = {
        totalCreators,
        totalCommercials,
        totalEarnings: totalEarnings[0]?.total || 0,
        recentCreators
    };

    return res.status(200).json(
        new ApiResponse(200, summary, "Dashboard summary fetched successfully")
    );
});

const getMemberDashboardSummary = asyncHandler(async (req, res) => {
    const recentCreators = await Creator.find({ owner: req.user._id })
        .sort("-createdAt")
        .limit(5)
        .populate("category");

    const totalCreatorsAdded = await Creator.countDocuments({ owner: req.user._id });

    const summary = {
        recentCreators,
        totalCreatorsAdded,
        userRole: req.user.role
    };

    return res.status(200).json(
        new ApiResponse(200, summary, "Member dashboard summary fetched successfully")
    );
});

export {
    getCreatorsByCategory,
    getTotalEarnings,
    getCreatorGrowth,
    getDashboardSummary,
    getMemberDashboardSummary
};