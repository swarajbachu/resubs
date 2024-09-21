import { relations } from "drizzle-orm";
import {
	integer,
	primaryKey,
	sqliteTable,
	text,
} from "drizzle-orm/sqlite-core";
import { nanoid } from "nanoid";
import type { AdapterAccountType } from "next-auth/adapters";

export const user = sqliteTable("user", {
	id: text("id")
		.notNull()
		.primaryKey()
		.$defaultFn(() => `users_${nanoid(12)}`),
	name: text("name", { length: 255 }),
	email: text("email", { length: 255 }).notNull(),
	emailVerified: integer("emailVerified", {
		mode: "timestamp_ms",
	}),
	image: text("image", { length: 255 }),
	createdAt: integer("created", {
		mode: "timestamp_ms",
	})
		.notNull()
		.$defaultFn(() => new Date()),
	updatedAt: integer("updatedAt", {
		mode: "timestamp_ms",
	})
		.notNull()
		.$defaultFn(() => new Date()),
});

export const UserRelations = relations(user, ({ many }) => ({
	accounts: many(account),
}));

export const account = sqliteTable(
	"account",
	{
		userId: text("userId")
			.notNull()
			.references(() => user.id, { onDelete: "cascade" }),
		type: text("type").$type<AdapterAccountType>().notNull(),
		provider: text("provider", { length: 255 }).notNull(),
		providerAccountId: text("providerAccountId", { length: 255 }).notNull(),
		refresh_token: text("refresh_token", { length: 255 }),
		access_token: text("access_token"),
		expires_at: integer("expires_at"),
		token_type: text("token_type", { length: 255 }),
		scope: text("scope", { length: 255 }),
		id_token: text("id_token"),
		session_state: text("session_state", { length: 255 }),
	},
	(account) => ({
		compoundKey: primaryKey({
			columns: [account.provider, account.providerAccountId],
		}),
	}),
);

export const AccountRelations = relations(account, ({ one }) => ({
	user: one(user, { fields: [account.userId], references: [user.id] }),
}));

export const session = sqliteTable("session", {
	sessionToken: text("sessionToken", { length: 255 }).notNull().primaryKey(),
	userId: text("userId")
		.notNull()
		.references(() => user.id, { onDelete: "cascade" }),
	expires: integer("expires", {
		mode: "timestamp_ms",
	}).notNull(),
});

export const sessionRelations = relations(session, ({ one }) => ({
	user: one(user, { fields: [session.userId], references: [user.id] }),
}));

export const verificationTokens = sqliteTable(
	"verificationToken",
	{
		identifier: text("identifier").notNull(),
		token: text("token").notNull(),
		expires: integer("expires", { mode: "timestamp_ms" }).notNull(),
	},
	(verificationToken) => ({
		compositePk: primaryKey({
			columns: [verificationToken.identifier, verificationToken.token],
		}),
	}),
);

export const authenticators = sqliteTable(
	"authenticator",
	{
		credentialID: text("credentialID").notNull().unique(),
		userId: text("userId")
			.notNull()
			.references(() => user.id, { onDelete: "cascade" }),
		providerAccountId: text("providerAccountId").notNull(),
		credentialPublicKey: text("credentialPublicKey").notNull(),
		counter: integer("counter").notNull(),
		credentialDeviceType: text("credentialDeviceType").notNull(),
		credentialBackedUp: integer("credentialBackedUp", {
			mode: "boolean",
		}).notNull(),
		transports: text("transports"),
	},
	(authenticator) => ({
		compositePK: primaryKey({
			columns: [authenticator.userId, authenticator.credentialID],
		}),
	}),
);
