import { Router } from "express";
import { resetCategories, createCategory, getCategories, deleteAllCategories } from "../controllers/category.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.use(verifyJWT);

router.route("/reset")
    .post(verifyJWT, resetCategories);

router.route("/")
    .post(createCategory)
    .get(getCategories)
    .delete(verifyJWT, deleteAllCategories);

export default router;