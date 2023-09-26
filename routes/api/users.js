import express from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import {
  getUser,
  addUser,
  loginUser,
  patchUser,
  patchAvatar,
  verifyEmail,
  sendVerificationMail,
} from "../../models/users.js";
import { auth } from "../../config/config-pasport.js";
import { uploadImage } from "../../config/config-multer.js";

dotenv.config();
const secret = process.env.JWT_SECRET;
export const usersRouter = express.Router();

usersRouter.get("/current", auth, async (req, res, next) => {
  const { id: userId } = req.user;
  try {
    const user = await getUser(userId);
    if (!user) {
      return res.status(404).json("user not found");
    }
    const { email, subscription } = user;
    return res.status(200).json({
      status: "success",
      code: 200,
      data: { email, subscription },
    });
  } catch (err) {
    res.status(500).json(`Error getting user ${err}`);
  }
});

usersRouter.post("/signup", async (req, res, next) => {
  const { body } = req;
  if (Object.keys(body).length === 0) {
    return res.status(400).json("Error, empty request is not allowed");
  }
  try {
    const user = await addUser(body);
    if (user === 409) {
      return res.status(409).json({ message: "Email in use" });
    }
    const { email, subscription } = user;
    return res.status(201).json({
      status: "success",
      code: 201,
      user: { email, subscription },
    });
  } catch (err) {
    res.status(500).json(`Error adding the user: ${err}`);
  }
});

usersRouter.post("/login", async (req, res, next) => {
  const { body } = req;
  if (Object.keys(body).length === 0) {
    return res.status(400).json("Error, empty request is not allowed");
  }
  try {
    const user = await loginUser(body);
    if (!user) {
      return res.status(400).json(`Email or password is wrong`);
    }
    if (!user.verify) {
      return res
        .status(401)
        .json(
          `Email not verified. Please check your email for verification instructions.`
        );
    }
    const payload = {
      id: user.id,
      username: user.email,
    };
    const token = jwt.sign(payload, secret, { expiresIn: "1h" });
    user.token = token;
    await user.save();
    const { email, subscription } = user;
    res.status(200).json({
      status: "success",
      code: 200,
      token: token,
      user: { email, subscription },
    });
  } catch (err) {
    res.status(500).json({
      status: "error",
      code: 500,
      message: "Error login",
    });
  }
});

usersRouter.post("/logout", auth, async (req, res, next) => {
  try {
    const userId = req.user.id;
    const user = await getUser(userId);
    if (!user) {
      return res.status(401).json({
        status: "error",
        code: 401,
        message: "Not authorized",
      });
    }
    user.token = null;
    await user.save();
    res.status(204).json();
  } catch (err) {
    res.status(500).json({
      status: "error",
      code: 500,
      message: "Error logout",
    });
  }
});

usersRouter.patch("/", auth, async (req, res, next) => {
  const { id: userId } = req.user;
  const { body } = req;
  const { subscription } = body;

  if (!("subscription" in body) || Object.keys(body).length === 0) {
    return res.status(400).json("Error value subscription!");
  }

  try {
    const updatedStatus = await patchUser(subscription, userId);
    if (updatedStatus === 400) {
      return res.status(400).json("invalid subscription type");
    }
    return res.json({
      status: "success",
      code: 200,
      data: { updatedStatus },
    });
  } catch (err) {
    res.status(500).json(`Error updating : ${err}`);
  }
});

usersRouter.patch(
  "/avatars",
  auth,
  uploadImage.single("avatar"),
  async (req, res, next) => {
    const file = req.file;
    if (!file) {
      return res.status(400).json("no file");
    }
    const { path } = file;
    const { id: userId } = req.user;
    try {
      const avatarPath = await patchAvatar(path, userId);
      return res.status(200).json({
        status: "success",
        code: 200,
        avatarURL: avatarPath,
      });
    } catch (err) {
      res.status(500).json(`error updating avatar ${err}`);
    }
  }
);

usersRouter.get("/verify/:verificationToken", async (req, res, next) => {
  const { verificationToken } = req.params;
  try {
    await verifyEmail(verificationToken);
    return res.status(200).json({ message: "Verification successful" });
  } catch (err) {
    res.status(500).json({ message: `error verification ${err.message}` });
  }
});

usersRouter.post("/verify/", async (req, res, next) => {
  const { body } = req;
  const { email } = body;
  try {
    await sendVerificationMail(email);
    return res.status(200).json({ message: "Verification email sent" });
  } catch (err) {
    res.status(500).json({ message: `error verification ${err.message}` });
  }
});
