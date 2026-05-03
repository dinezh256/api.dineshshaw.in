import mongoose, { Document, Schema, Model } from "mongoose";
import jwt from "jsonwebtoken";

export interface IUser extends Document {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  generateAuthToken: () => string;
}

const userSchema: Schema<IUser> = new Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true, minlength: 6 },
});

userSchema.methods.generateAuthToken = function () {
  const token = jwt.sign(
    { _id: this.id },
    process.env.JWT_PRIVATE_KEY as string,
    {
      expiresIn: "7d",
    }
  );

  return token;
};

export const User = mongoose.model<IUser>("users", userSchema);
