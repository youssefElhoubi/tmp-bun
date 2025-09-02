import { Schema, model, Document } from "mongoose";

export interface IUser extends Document {
    name: string;
    email: string;
    password: string;
    role: "user" | "admine";
    tier: "free" | "premium";
    createdAt?: Date;
    updatedAt?: Date;
    UserImage?: string;
}

const userSchema = new Schema<IUser>(
    {
        name: { type: String, required: true },
        email: { type: String, required: true, unique: true },
        password: { type: String, required: true },
        role: { type: String, enum: ["user", "admine"], default: "user" },
        tier: { type: String, enum: ["free", "premium"], default: "free" },
        UserImage: { type: String, required: false, default:"https://static.vecteezy.com/system/resources/previews/019/879/186/non_2x/user-icon-on-transparent-background-free-png.png" },
    },
    { timestamps: true }
);

export const User = model<IUser>("User", userSchema);
