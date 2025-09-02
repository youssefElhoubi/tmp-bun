import { Request, Response } from "express";
import { User } from "../models/userSchema";
import { Product } from "../models/produtSchema";
import { ProductHistory } from "../models/productHestorySchema";

// ✅ Get all users
export const allUsers = async (req: Request, res: Response) => {
    try {
        const users = await User.find();
        return res.json({ success: true, data: users });
    } catch (err: any) {
        return res.status(500).json({ success: false, error: err.message });
    }
};

// ✅ Ban a user
export const banUser = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        await User.findByIdAndUpdate(id, { accountStatus: "disactive" });

        return res.json({ success: true, message: "User has been banned" });
    } catch (err: any) {
        return res.status(500).json({ success: false, error: err.message });
    }
};

// ✅ Approve a user
export const approveUser = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        await User.findByIdAndUpdate(id, { accountStatus: "active" });

        return res.json({ success: true, message: "User has been approved" });
    } catch (err: any) {
        return res.status(500).json({ success: false, error: err.message });
    }
};

// ✅ Statistics
export const statistics = async (req: Request, res: Response) => {
    try {
        const totalUsers = await User.countDocuments();
        const totalProducts = await Product.countDocuments();

        const totalPriceDrops = await ProductHistory.countDocuments({
            priceDiff: { $lt: 0 },
            createdAt: {
                $gte: new Date(new Date().getFullYear(), 0, 1), // start of year
                $lte: new Date(), // now
            },
        });

        return res.json({
            total_users: totalUsers,
            total_products: totalProducts,
            total_price_drops: totalPriceDrops,
        });
    } catch (err: any) {
        return res.status(500).json({ success: false, error: err.message });
    }
};

// ✅ Last created user
export const lastUser = async (req: Request, res: Response) => {
    try {
        const user = await User.findOne().sort({ _id: -1 });
        return res.json({ userInfo: user });
    } catch (err: any) {
        return res.status(500).json({ success: false, error: err.message });
    }
};
