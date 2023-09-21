import passport from "passport";
import passportJWT from "passport-jwt";
import User from "../services/schemas/users.js";
import dotenv from "dotenv";
import { getAllUsers } from "../models/users.js";

dotenv.config();
const secret = process.env.JWT_SECRET;

const ExtractJWT = passportJWT.ExtractJwt;
const Strategy = passportJWT.Strategy;
const params = {
  secretOrKey: secret,
  jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
};

passport.use(
  new Strategy(params, function (payload, done) {
    User.find({ _id: payload.id })
      .then(([user]) => {
        if (!user) {
          return done(new Error("user not found"));
        }
        return done(null, user);
      })
      .catch((err) => done(err));
  })
);

export default passport;
export const auth = async (req, res, next) => {
  try {
    await passport.authenticate(
      "jwt",
      { session: false },
      async (err, user) => {
        if (!user || err) {
          return res.status(401).json({
            status: "error",
            code: 401,
            message: "not authorized1",
            data: "not authorized1",
          });
        }

        const authHeader = req.headers.authorization;
        const token = authHeader && authHeader.split(" ")[1];

        const allUsers = await getAllUsers();
        const tokenExists = allUsers.some((user) => user.token === token);
        if (!tokenExists) {
          return res.status(401).json({
            status: "error",
            code: 401,
            message: "not authorized2",
            data: "not authorized2",
          });
        }

        req.user = user;
        next();
      }
    )(req, res, next);
  } catch (error) {
    res.status(500).json({
      status: "error",
      code: 500,
      message: "An error occurred during authentication.",
    });
  }
};
