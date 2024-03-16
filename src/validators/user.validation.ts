import validate from "../middlewares/validator";
import { body } from 'express-validator';

export const signupValidation = () =>
    validate([
        body("fullName")
            .notEmpty()
            .withMessage("fullName is required."),
        body("userName")
            .notEmpty()
            .withMessage("userName is required."),
        body("email")
            .notEmpty()
            .withMessage("email is required."),
        body("password")
            .notEmpty()
            .withMessage("password is required."),
        body("confPassword")
            .notEmpty()
            .withMessage("confPassword is required."),
    ])


export const loginValidator = () =>
    validate([
        body("uniqueId")
            .notEmpty()
            .withMessage("uniqueId is required."),
        body("password")
            .notEmpty()
            .withMessage("password is required.")
    ])
