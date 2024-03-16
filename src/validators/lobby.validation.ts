import validate from "../middlewares/validator";
import { body } from 'express-validator';

export const createLobbyValidator = () =>
    validate([
        body("amount")
            .notEmpty()
            .withMessage("amount is required.")
    ])