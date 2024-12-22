import { Router } from "express";
import { 
    addCategory, 
    getCategories, 
    updateCategory, 
    deleteCategory 
} from "../controllers/category.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

// Secured routes
router.route("/").post(verifyJWT, addCategory).get(verifyJWT, getCategories);
router.route("/:id").patch(verifyJWT, updateCategory).delete(verifyJWT, deleteCategory);

export default router;