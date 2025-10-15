import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import db from "@/lib/db";
import { nextCookies } from "better-auth/next-js";
import VerificationEmail from "@/components/emails/verification-email";
import env from "./env";
import PasswordResetEmail from "@/components/emails/reset-email";
import { resend } from "./resend";
import { admin } from "better-auth/plugins";
export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg", // or "mysql", "sqlite"
  }),
  socialProviders: {
    google: {
      clientId: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET,
    },
  },
  emailAndPassword: {
    enabled: true,
    sendResetPassword: async ({ user, url }) => {
      await resend.emails.send({
        from: "onboarding@resend.dev",
        to: [user.email],
        subject: "Reset your password",
        react: PasswordResetEmail({
          userName: user.name,
          resetUrl: url,
          requestTime: new Date().toLocaleString(),
        }),
      });
    },
  },
  emailVerification: {
    sendVerificationEmail: async ({ user, url }) => {
      const { data, error } = await resend.emails.send({
        from: "onboarding@resend.dev",
        to: [user.email],
        subject: "Verify your email address",
        react: VerificationEmail({
          userName: user.name,
          verificationUrl: url,
        }),
      });
      if (error) {
        console.error("Failed to send verification email:", error);
      } else {
        console.log("Verification email sent successfully", data);
      }
    },
    sendOnSignUp: true,
  },
  user: {
    additionalFields: {
      stripeCustomerId: {
        type: "string",
        input: false,
        required: false,
      },
    },
  },
  plugins: [admin(), nextCookies()],
});

export type Session = typeof auth.$Infer.Session;
export type User = typeof auth.$Infer.Session.user;
