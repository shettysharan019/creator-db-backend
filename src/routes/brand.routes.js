import { Router } from "express";
import { 
    addBrand, 
    getBrands, 
    getBrandById, 
    updateBrand, 
    deleteBrand 
} from "../controllers/brand.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

// Secured routes
router.route("/").post(verifyJWT, addBrand).get(verifyJWT, getBrands);
router.route("/:id")
    .get(verifyJWT, getBrandById)
    .patch(verifyJWT, updateBrand)
    .delete(verifyJWT, deleteBrand);

export default router;
