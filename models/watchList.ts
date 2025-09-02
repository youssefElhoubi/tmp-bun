import { Schema, model, Document, Types } from "mongoose";

export interface IWatchList extends Document {
    user: Types.ObjectId;
    product: Types.ObjectId;
    createdAt?: Date;
    updatedAt?: Date;
}

const watchListSchema = new Schema<IWatchList>(
    {
        user: { type: Schema.Types.ObjectId, ref: "User", required: true },
        product: { type: Schema.Types.ObjectId, ref: "Product", required: true },
    },
    { timestamps: true }
);

export const WatchList = model<IWatchList>("WatchList", watchListSchema);
