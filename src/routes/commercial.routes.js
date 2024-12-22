import { Router } from "express";
import { 
    addCommercial, 
    getCommercials, 
    updateCommercial, 
    deleteCommercial 
} from "../controllers/commercial.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

// Secured routes
router.route("/").post(verifyJWT, addCommercial).get(verifyJWT, getCommercials);
router.route("/:id").patch(verifyJWT, updateCommercial).delete(verifyJWT, deleteCommercial);

export default router;
