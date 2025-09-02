import { Schema, model, Document, Types } from "mongoose";

export interface IProductHistory extends Document {
    product: Types.ObjectId;
    CurrentPrice: string;
    priceDiff: number;
    createdAt?: Date;
    updatedAt?: Date;
}

const productHistorySchema = new Schema<IProductHistory>(
    {
        product: { type: Schema.Types.ObjectId, ref: "Product", required: true },
        CurrentPrice: { type: String, required: true },
        priceDiff: { type: Number, required: true },
    },
    { timestamps: true }
);

export const ProductHistory = model<IProductHistory>(
    "ProductHistory",
    productHistorySchema
);
