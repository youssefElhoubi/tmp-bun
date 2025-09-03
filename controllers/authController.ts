import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import {User} from "../models/userSchema"; 
import sign from "../utils/jwt/sign";
import sendmail from "../utils/mailer/passwordReset";

const JWT_SECRET = process.env.JWT_SECRET || "supersecret";



// ----------------- CONTROLLER METHODS -----------------

// SignUp
export const signUp = async (req: Request, res: Response) => {
    try {
        const { name, email, password, Image_url } = req.body;

        // check existing user
        const exist = await User.findOne({ email });
        if (exist) {
            return res.status(400).json({ error: "Email already in use" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            Image_url,
        });

        const token = sign({ sub: user._id, role: "user" });

        return res.status(201).json({ token });
    } catch (err: any) {
        return res.status(500).json({ error: err.message });
    }
};

// SignIn
export const signIn = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ error: "User not found" });

        const match = await bcrypt.compare(password, user.password);
        if (!match) return res.status(400).json({ error: "Invalid credentials" });

        const token = jwt.sign(
            { sub: user._id, role: user.role },
            JWT_SECRET,
            { expiresIn: "1h" }
        );

        return res.status(200).json({ token });
    } catch (err: any) {
        return res.status(500).json({ error: err.message });
    }
};

// Send password reset link (dummy nodemailer setup)
export const passwordResetLink = async (req: Request, res: Response) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Setup transport (example using Gmail SMTP)
        sendmail(user.email,user.id);

        return res.json({
            message: "If the account exists, a reset link was sent",
        });
    } catch (err: any) {
        return res.status(500).json({ error: err.message });
    }
};

// Change password
export const passwordChange = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { password } = req.body;

        const hashedPassword = await bcrypt.hash(password, 10);

        await User.findByIdAndUpdate(id, { password: hashedPassword });

        return res.json({ message: "Password changed successfully" });
    } catch (err: any) {
        return res.status(500).json({ error: err.message });
    }
};
