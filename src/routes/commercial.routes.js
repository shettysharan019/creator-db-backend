import { Router } from "express";
import {
    createCommercial,
    getCommercials,
    getCommercialById,
    updateCommercial,
    deleteCommercial
} from "../controllers/commercial.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.use(verifyJWT);

router.route("/")
    .post(createCommercial)
    .get(getCommercials);

router.route("/:id")
    .get(getCommercialById)
    .patch(updateCommercial)
    .delete(deleteCommercial);

export default router;