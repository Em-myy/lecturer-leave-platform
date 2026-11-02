import "dotenv/config";
import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dns from "node:dns";
import leaveRoutes from "./routes/leaveRoutes.js";

dns.setServers(["8.8.8.8", "1.1.1.1"]);

const server = express();

try {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log("Connected to database");
} catch (error) {
  console.log("Database error", error);
  process.exit(1);
}

const { auth } = await import("./utils/auth.js");
const { toNodeHandler } = await import("better-auth/node");

server.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  }),
);

server.all("/api/auth/{*any}", toNodeHandler(auth));

server.use("/api/leaves", leaveRoutes);

server.use(express.json());

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
