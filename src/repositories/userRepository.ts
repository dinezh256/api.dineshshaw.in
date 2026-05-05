import { User } from "../models/user.js";

export const findUserByEmail = (email: string) => {
  return User.findOne({ email });
};

export const findUserByEmailWithPassword = (email: string) => {
  return User.findOne({ email }).select("+password");
};

export const createUser = (user: {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}) => {
  return User.create(user);
};
