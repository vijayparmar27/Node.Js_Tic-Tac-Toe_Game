import express from "express";
import { loginValidator, signupValidation } from "../validators/user.validation";
import { loginController, signupController } from "../controllers/user.controller";

const router = express.Router();

router.post(
    "/signup",
    signupValidation(),
    signupController
)

router.post(
    "/login",
    loginValidator(),
    loginController
)

export default router;