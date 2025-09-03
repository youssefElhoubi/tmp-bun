import { Request, Response } from "express";

import { Product } from "../models/produtSchema";
import { ProductHistory } from "../models/productHestorySchema";

// ✅ Add new product
export const addProduct = async (req: Request, res: Response) => {
    try {
        const { productTitle, productImage, productPrice, productPlatform, url, user_id } = req.body;

        const existingProduct = await Product.exists({ url });
        if (existingProduct) {
            return res.status(208).json({ message: "This product already exists" });
        }

        const newProduct = await Product.create({
            url,
            name: productTitle,
            curentPrice: productPrice,
            platformName: productPlatform,
            user_id,
            productImage,
        });

        await ProductHistory.create({
            product_id: newProduct._id,
            CurrentPrice: newProduct.curentPrice,
            priceDiff: 0,
        });

        return res.status(201).json({
            success: true,
            message: "Product added successfully",
            productInfo: newProduct,
        });
    } catch (err: any) {
        return res.status(500).json({
            success: false,
            error: "An error occurred while adding the product",
            details: err.message,
        });
    }
};

// ✅ Get all products (paginated)
export const allProducts = async (req: Request, res: Response) => {
    try {
        const page = parseInt(req.query.page as string) || 1;
        const limit = 10;

        const products = await Product.find()
            .populate("history")
            .skip((page - 1) * limit)
            .limit(limit);

        if (!products.length) {
            return res.status(404).json({ success: false, message: "No products found" });
        }

        return res.json({
            success: true,
            message: "All products retrieved successfully",
            data: products,
        });
    } catch (err: any) {
        return res.status(500).json({ success: false, error: err.message });
    }
};

// ✅ Total products count
export const totalProducts = async (req: Request, res: Response) => {
    try {
        const total = await Product.countDocuments();
        return res.json({ total });
    } catch (err: any) {
        return res.status(500).json({ success: false, error: err.message });
    }
};

// ✅ Get products of a user
export const myProducts = async (req: Request, res: Response) => {
    try {
        const { user_id } = req.body;
        const products = await Product.find({ user_id });

        if (!products.length) {
            return res.status(404).json({
                success: false,
                message: "No products found for this user",
            });
        }

        return res.json({
            success: true,
            message: "User products retrieved successfully",
            data: products,
        });
    } catch (err: any) {
        return res.status(500).json({ success: false, error: err.message });
    }
};

// ✅ Product details with history & compare
// export const productInfo = async (req: Request, res: Response) => {
//   try {
//     const { id } = req.params;
//     const product = await Product.findById(id).populate("history");

//     if (!product) {
//       return res.status(404).json({ success: false, message: "Product not found" });
//     }

//     const comparedProducts = await compareService.compare(product.name, product.platformName);

//     return res.json({
//       success: true,
//       message: "Product retrieved successfully",
//       data: product,
//       history: product.history,
//       comparedProducts,
//     });
//   } catch (err: any) {
//     return res.status(500).json({ success: false, error: err.message });
//   }
// };

// ✅ Delete product
export const deleteProduct = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { user_id, user_role } = req.body;

        const product = await Product.findById(id);
        if (!product) {
            return res.status(404).json({ success: false, message: "Product not found" });
        }

        if (product.user._id.toString() !== user_id && user_role !== "admine") {
            return res.json({
                success: false,
                message: "You are not the owner of this product or not an admin",
            });
        }

        await product.deleteOne();

        return res.json({ success: true, message: "Product deleted successfully" });
    } catch (err: any) {
        return res.status(500).json({ success: false, error: err.message });
    }
};

// ✅ Search products
export const searchProducts = async (req: Request, res: Response) => {

    try {
        const search = (req.query.search as string).trim();

        const products = await Product.find({
            name: { $regex: search, $options: "i" },
        })
            .limit(20)
            .select("id name curentPrice productImage");

        return res.json({
            success: true,
            message: products.length ? "Products retrieved successfully" : "No products found",
            data: products,
        });
    } catch (err: any) {
        return res.status(500).json({ success: false, error: err.message });
    }
};

// ✅ Get products with user info
export const productsWithUser = async (req: Request, res: Response) => {
    try {
        const products = await Product.find().populate("owner");
        return res.json({ success: true, data: products });
    } catch (err: any) {
        return res.status(500).json({ success: false, error: err.message });
    }
};
