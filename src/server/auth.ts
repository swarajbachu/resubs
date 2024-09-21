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
	trustHost: true,
	secret: process.env.AUTH_SECRET,
	adapter: DrizzleAdapter(db, {
		usersTable: user,
		accountsTable: account,
		sessionsTable: session,
		verificationTokensTable: verificationTokens,
	}),
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
	providers: [
		Google({
			allowDangerousEmailAccountLinking: true,
		}),
	],
} as NextAuthConfig);
