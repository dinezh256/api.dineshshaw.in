import bcrypt from "bcryptjs";
import { AppError } from "../errors.js";
import { config } from "../config.js";
import { createUser, findUserByEmail, findUserByEmailWithPassword } from "../repositories/userRepository.js";

type SignupInput = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
};

type LoginInput = {
  email: string;
  password: string;
};

export const signupUser = async ({ firstName, lastName, email, password }: SignupInput) => {
  const existingUser = await findUserByEmail(email);

  if (existingUser) {
    throw new AppError(409, "User with this email already exists.", "USER_ALREADY_EXISTS");
  }

  const salt = await bcrypt.genSalt(config.auth.saltRounds);
  const hashedPassword = await bcrypt.hash(password, salt);

  await createUser({
    firstName,
    lastName,
    email,
    password: hashedPassword,
  });

  return { message: "User created successfully." };
};

export const loginUser = async ({ email, password }: LoginInput) => {
  const user = await findUserByEmailWithPassword(email);

  if (!user) {
    throw new AppError(401, "Invalid email/password.", "INVALID_CREDENTIALS");
  }

  const validPassword = await bcrypt.compare(password, user.password);

  if (!validPassword) {
    throw new AppError(401, "Invalid email/password.", "INVALID_CREDENTIALS");
  }

  return {
    sessionToken: user.generateAuthToken(),
    message: "Logged in successfully.",
  };
};
