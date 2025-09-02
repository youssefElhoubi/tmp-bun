import express from "express";
import {
    signUp,
    signIn,
    passwordResetLink,
    passwordChange,
} from "../controllers/authController";
import { signInValidation,signUpValidation } from "../utils/validators/authvalidators";

const authRout = express.Router();

authRout.post("/signup", signUpValidation, signUp);
authRout.post("/signin", signInValidation, signIn);
authRout.post("/password-reset", passwordResetLink);
authRout.post("/password-change/:id", passwordChange);

export default authRout;
