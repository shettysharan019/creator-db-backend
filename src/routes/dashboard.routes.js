import { Router } from "express";
import {
    getCreatorsByCategory,
    getTotalEarnings,
    getCreatorGrowth,
    getDashboardSummary,
    getMemberDashboardSummary,
} from "../controllers/dashboard.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.use(verifyJWT);

router.route("/summary").get(getDashboardSummary);
router.route("/creators-by-category").get(getCreatorsByCategory);
router.route("/earnings").get(getTotalEarnings);
router.route("/creator-growth").get(getCreatorGrowth);
router.route("/member-summary").get(verifyJWT, getMemberDashboardSummary);

export default router;