import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/prisma";
import authConfig from "./auth.config";

const adminEmails = (process.env.ADMIN_EMAILS ?? "")
  .split(",")
  .map((e) => e.trim().toLowerCase())
  .filter(Boolean);

export const { handlers, signIn, signOut, auth } = NextAuth({
  ...authConfig,
  adapter: PrismaAdapter(prisma),
  // JWT sessions keep middleware edge-compatible; the role is re-read
  // from the DB whenever auth() runs on the server, so promotions apply instantly.
  session: { strategy: "jwt" },
  callbacks: {
    ...authConfig.callbacks,
    async jwt({ token, user }) {
      if (user?.id) token.id = user.id;
      if (token.id) {
        const row = await prisma.user.findUnique({
          where: { id: token.id as string },
          select: { role: true },
        });
        token.role = row?.role ?? "USER";
      }
      return token;
    },
  },
  events: {
    // Bootstrap admins from ADMIN_EMAILS (comma-separated) on sign-in.
    async signIn({ user }) {
      if (user.id && user.email && adminEmails.includes(user.email.toLowerCase())) {
        await prisma.user.update({ where: { id: user.id }, data: { role: "ADMIN" } });
      }
    },
  },
});
