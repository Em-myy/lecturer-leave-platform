import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import mongoose from "mongoose";

export const auth = betterAuth({
  database: mongodbAdapter(mongoose.connection.db),
  emailAndPassword: { enabled: true },
  user: {
    additionalFields: {
      username: { type: "string" },
      role: { type: "string" },
      department: { type: "string" },
    },
  },
});
