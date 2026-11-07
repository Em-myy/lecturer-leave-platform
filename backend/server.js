import "dotenv/config";
import express from "express";
import cors from "cors";
// import dns from "node:dns";
import leaveRoutes from "./routes/leaveRoutes.js";

// dns.setServers(["8.8.8.8", "1.1.1.1"]);

const server = express();

server.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  }),
);

server.use(express.json());

server.use("/api/leaves", leaveRoutes);

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
