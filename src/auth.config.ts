import type { NextAuthConfig } from "next-auth";
import Google from "next-auth/providers/google";
import GitHub from "next-auth/providers/github";

/**
 * Edge-safe Auth.js config (no Prisma import). Used by middleware.
 * The full config with the DB adapter lives in auth.ts.
 */
export default {
  pages: { signIn: "/login" },
  providers: [Google, GitHub],
  callbacks: {
    session({ session, token }) {
      if (session.user) {
        session.user.id = (token.id as string) ?? token.sub ?? "";
        session.user.role = (token.role as "USER" | "ADMIN") ?? "USER";
      }
      return session;
    },
  },
} satisfies NextAuthConfig;
