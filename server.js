import { app } from "./app.js";
import mongoose from "mongoose";
import { config } from "dotenv";

config();

const uri = process.env.DB_URL;

const startServer = async () => {
  try {
    const connection = await mongoose.connect(uri);
    console.log("Database connection successfull");

    app.listen(3000, () => {
      console.log("Server running. Use our API on port: 3000");
    });
  } catch (err) {
    console.error("Connection failed");
    console.error(err);
    process.exit(1);
  }
};

startServer();
