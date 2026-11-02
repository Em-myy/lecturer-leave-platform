import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import mongoose from "mongoose";
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export const auth = betterAuth({
  database: mongodbAdapter(mongoose.connection.db),
  baseURL: process.env.BETTER_AUTH_URL,
  secret: process.env.BETTER_AUTH_SECRET,
  trustedOrigins: [process.env.FRONTEND_URL],

  emailAndPassword: { enabled: true, requireEmailVerification: true },

  emailVerification: {
    sendOnSignUp: true,
    sendVerificationEmail: async ({ user, url, token }, request) => {
      await transporter.sendMail({
        from: `"Lecturer Leave Platform" <${process.env.EMAIL_USER}>`,
        to: user.email,
        subject: "Verify Your Email Address",
        html: `
          <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
            <h2>Verify Your Account</h2>
            <p>Hello ${user.name},</p>
            <p>Thank you for signing up. Please click the button below to verify your email address:</p>
            <a 
              href="${url}" 
              style="display: inline-block; padding: 10px 20px; background-color: #2563eb; color: #ffffff; text-decoration: none; border-radius: 5px; margin: 15px 0;"
            >
              Verify Email Address
            </a>
            <p>If the button doesn't work, copy and paste this link into your browser:</p>
            <p><a href="${url}">${url}</a></p>
          </div>        
        `,
      });
    },
  },

  user: {
    additionalFields: {
      role: { type: "string", defaultValue: "lecturer", input: false },
      department: { type: "string", required: true, input: true },
    },
  },
  databaseHooks: {
    user: {
      create: {
        before: async (user) => {
          return {
            data: {
              ...user,
              role: "lecturer",
            },
          };
        },
      },
    },
  },
});
