import { Router } from "express";
import { 
    addCreator, 
    getCreators, 
    getCreatorById, 
    updateCreator, 
    deleteCreator 
} from "../controllers/creator.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

// Secured routes
router.route("/").post(verifyJWT, addCreator).get(verifyJWT, getCreators);
router.route("/:id")
    .get(verifyJWT, getCreatorById)
    .patch(verifyJWT, updateCreator)
    .delete(verifyJWT, deleteCreator);

export default router;