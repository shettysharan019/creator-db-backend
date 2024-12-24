import { Router } from "express";
import {
    addCreator,
    getCreators,
    getCreatorById,
    updateCreator,
    deleteCreator,
    searchCreators
} from "../controllers/creator.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

// All routes are protected with JWT authentication
router.use(verifyJWT);

router.route("/")
    .post(addCreator)
    .get(getCreators);

router.route("/search")
    .get(verifyJWT, searchCreators);

router.route("/:id")
    .get(getCreatorById)
    .patch(updateCreator)
    .delete(deleteCreator);

export default router;