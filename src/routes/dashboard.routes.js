import { Router } from "express";
import {
    getCreatorsByCategory,
    getTotalEarnings,
    getCreatorGrowth,
    getDashboardSummary
} from "../controllers/dashboard.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.use(verifyJWT);

router.route("/summary").get(getDashboardSummary);
router.route("/creators-by-category").get(getCreatorsByCategory);
router.route("/earnings").get(getTotalEarnings);
router.route("/creator-growth").get(getCreatorGrowth);

export default router;