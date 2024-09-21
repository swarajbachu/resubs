import { DrizzleAdapter } from "@auth/drizzle-adapter";
import { db, user, account, session, verificationTokens } from "./db";
import Google from "@auth/core/providers/google";
import NextAuth from "next-auth";
import type { NextAuthConfig } from "next-auth";
import { eq } from "drizzle-orm";
export const {
  handlers: { GET, POST },
  signIn,
  signOut,
  auth,
} = NextAuth({
  secret: process.env.AUTH_SECRET,
  adapter: DrizzleAdapter(db, {
    usersTable: user,
    accountsTable: account,
    sessionsTable: session,
    verificationTokensTable: verificationTokens,
  }),
  pages: {
    signIn: "/login",
  },
  events: {
    async linkAccount({ user: AdapterUser }) {
      await db
        .update(user)
        .set({
          emailVerified: new Date(),
        })
        .where(eq(user.id, AdapterUser.id as string));
    },
  },
  callbacks: {
    async session({ session, user }) {
      const accounts = await db
        .select()
        .from(account)
        .where(eq(account.userId, user.id));
      return {
        ...session,
        user: {
          ...session.user,
          accessToken: accounts[0].access_token,
          refreshToken: accounts[0].refresh_token,
        },
      };
    },
  },
  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET,
      authorization: {
        params: {
          scope:
            "openid email profile https://www.googleapis.com/auth/calendar",
        },
      },
    }),
  ],
} as NextAuthConfig);
