import { Router } from "express";
import { registerUser } from "../controllers/team.controller.js";

const router = Router();

router.route("/register").post(registerUser);

export default router;