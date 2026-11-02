import "dotenv/config";
import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import { toNodeHandler } from "better-auth/node";
import { auth } from "./utils/auth.js";
import dns from "node:dns";

dns.setServers(["8.8.8.8", "1.1.1.1"]);

const server = express();

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("Connected to database"))
  .catch((err) => console.log("Database error", err));

server.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  }),
);

server.all("/api/auth/*splat", toNodeHandler(auth));

server.use(express.json());

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
