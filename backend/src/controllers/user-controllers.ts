import { NextFunction, Request, Response } from "express";
import User from "../models/User.js";
import { hash, compare } from "bcrypt";

export const getAllUsers = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const users = await User.find();
    return res.status(200).json({ message: "OK", users });
  } catch (error) {
    return res.status(200).json({ message: "ERROR", cause: error.message });
  }
};
export const userSignup = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { name, email, password } = req.body;
    const existingUser = await User.findOne({ emai: email });
    if (existingUser) return res.status(401).send("User already exists");
    const hashedPassword = await hash(password, 10);
    const user = new User({ name, email, password: hashedPassword });
    await user.save();
    return res.status(201).json({ message: "OK", id: user._id.toString() });
  } catch (error) {
    return res.status(200).json({ message: "ERROR", cause: error.message });
  }
};
export const userLogin = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email: email });
    if (!user) {
      return res.status(401).send("User not exists");
    }
    const isPasswordCorrect = await compare(password, user.password);
    if (!isPasswordCorrect) {
      return res.status(403).send("Password incorrect");
    }

    return res.status(201).json({ message: "OK", id: user._id.toString() });
  } catch (error) {
    return res.status(200).json({ message: "ERROR", cause: error.message });
  }
};
