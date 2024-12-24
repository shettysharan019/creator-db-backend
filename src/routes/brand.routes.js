import { Router } from "express";
import {
    createBrand,
    getBrands,
    getBrandsByCreator,
    updateBrand,
    deleteBrand
} from "../controllers/brand.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.use(verifyJWT);

router.route("/")
    .post(createBrand)
    .get(getBrands);

router.route("/creator/:creatorId")
    .get(getBrandsByCreator);

router.route("/:id")
    .patch(updateBrand)
    .delete(deleteBrand);

export default router;