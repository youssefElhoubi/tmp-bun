import { body, validationResult } from "express-validator";

export const signUpValidation = [
    body("name").isString().isLength({ min: 4, max: 255 }),
    body("email").isEmail(),
    body("password").isString().isLength({ min: 8 }),
];


export const signInValidation = [
    body("email").isEmail(),
    body("password").isString().isLength({ min: 8 }),
];