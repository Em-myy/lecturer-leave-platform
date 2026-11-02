import { inferAdditionalFields } from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000",
  plugins: [
    inferAdditionalFields({
      user: {
        department: { type: "string" },
        role: { type: "string", required: false },
      },
    }),
  ],
});

export const { useSession, signIn, signUp, signOut } = authClient;
