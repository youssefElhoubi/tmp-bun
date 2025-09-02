import { Schema, model } from "mongoose";
import { User, IUser } from "./userSchema";

export interface IAdmin extends IUser {
  // extra fields for Admin if needed
}

const adminSchema = new Schema<IAdmin>({}, { timestamps: true });

export const Admin = User.discriminator<IAdmin>("Admin", adminSchema);
