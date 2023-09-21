import User from "../services/schemas/users.js";
import bcrypt from "bcrypt";

export const getAllUsers = async () => {
  try {
    return await User.find();
  } catch (err) {
    console.error("error getting users", err);
    throw err;
  }
};

export const getUser = async (id) => {
  try {
    return await User.findById(id);
  } catch (err) {
    console.error("error getting user", err);
    throw err;
  }
};

export const addUser = async (body) => {
  const { email, password } = body;
  const users = await User.find();
  const userExist = users.find((user) => user.email === email);
  if (userExist) return 409;
  try {
    const salt = await bcrypt.genSalt();
    const passwordHash = await bcrypt.hash(password, salt);
    const user = { ...body, password: passwordHash };
    await User.create(user);
    return user;
  } catch (err) {
    console.error("error adding user", err);
    throw err;
  }
};

export const loginUser = async (body) => {
  const { email, password } = body;
  const users = await User.find();
  const user = users.find((user) => user.email === email);
  if (!user) return false;
  try {
    const isUser = await bcrypt.compare(password, user.password);
    if (!isUser) return false;
    return user;
  } catch (err) {
    console.error("error login", err);
    throw err;
  }
};

export const patchUser = async (subscription, userId) => {
  const subscriptions = User.schema.path("subscription").enumValues;
  if (!subscription || subscriptions.includes(subscription)) {
    return 400;
  }
  try {
    return await User.findByIdAndUpdate(
      { _id: userId },
      { $set: { subscription: subscription } },
      { new: true, select: "email subscription" }
    );
  } catch (err) {
    console.error("error updating user", err);
    throw err;
  }
};
