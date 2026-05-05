import mongoose, { Document, Schema, Model } from "mongoose";
import jwt, { type SignOptions } from "jsonwebtoken";
import { config, requireJwtPrivateKey } from "../config.js";

export interface IUser extends Document {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  generateAuthToken: () => string;
}

const userSchema: Schema<IUser> = new Schema(
  {
    firstName: { type: String, required: true, trim: true },
    lastName: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true, index: true },
    password: { type: String, required: true, minlength: 8, select: false },
  },
  {
    timestamps: true,
  }
);

userSchema.methods.generateAuthToken = function () {
  const signOptions: SignOptions = {
    expiresIn: config.auth.jwtExpiresIn as SignOptions["expiresIn"],
  };

  const token = jwt.sign(
    { _id: this.id },
    requireJwtPrivateKey(),
    signOptions
  );

  return token;
};

export const User = mongoose.model<IUser>("users", userSchema);
