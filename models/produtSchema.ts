import { Schema, model, Document, Types } from "mongoose";

export interface IProduct extends Document {
    url: string;
    name: string;
    curentPrice: string; // keeping as string like in migration
    platformName: string;
    productImage: string;
    user: Types.ObjectId;
    createdAt?: Date;
    updatedAt?: Date;
}

const productSchema = new Schema<IProduct>(
    {
        url: { type: String, required: true },
        name: { type: String, required: true },
        curentPrice: { type: String, required: true },
        platformName: { type: String, required: true },
        productImage: { type: String, required: true },
        user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    },
    { timestamps: true }
);

export const Product = model<IProduct>("Product", productSchema);
