import "dotenv/config";
import express from "express";
import cors from "cors";
import leaveRoutes from "./routes/leaveRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";

const server = express();

server.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  }),
);

server.use(express.json());

server.use("/api/leaves", leaveRoutes);
server.use("/api/hod", adminRoutes);

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
