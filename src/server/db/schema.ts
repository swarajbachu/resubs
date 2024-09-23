import { relations } from "drizzle-orm";
import {
  integer,
  primaryKey,
  sqliteTable,
  text,
} from "drizzle-orm/sqlite-core";
import { nanoid } from "nanoid";
import type { AdapterAccountType } from "next-auth/adapters";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import type { z } from "zod";

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

export const subscriptions = sqliteTable("subscriptions", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  price: text("price").notNull(),
  currency: text("currency").notNull().default("USD"),
  billingCycle: text("billing_cycle").notNull(),
  platform: text("platform").notNull(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  startDate: integer("start_date", {
    mode: "timestamp_ms",
  }).notNull(),
  endDate: integer("end_date", {
    mode: "timestamp_ms",
  }),
  trialEndDate: integer("trial_end_date", {
    mode: "timestamp_ms",
  }),
  isActive: integer("is_active", { mode: "boolean" }).notNull().default(true),
  createdAt: integer("created_at", {
    mode: "timestamp_ms",
  })
    .notNull()
    .default(new Date()),
  updatedAt: integer("updated_at", {
    mode: "timestamp_ms",
  })
    .notNull()
    .default(new Date()),
});

export const subscriptionRelations = relations(subscriptions, ({ one }) => ({
  user: one(user, { fields: [subscriptions.userId], references: [user.id] }),
}));

export const subscriptionInsertSchema = createInsertSchema(subscriptions);
export type subscriptionInsertType = z.infer<typeof subscriptionInsertSchema>;
export type subscriptionInsertTypeWithoutUserId = Omit<
  subscriptionInsertType,
  "userId"
>;

export const subscriptionSelectSchema = createSelectSchema(subscriptions);
export type subscriptionSelectType = z.infer<typeof subscriptionSelectSchema>;

export const reminders = sqliteTable("reminders", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  subscriptionId: integer("subscription_id").notNull(),
  reminderDate: integer("reminder_date", {
    mode: "timestamp_ms",
  }).notNull(),
  reminderType: text("reminder_type").notNull(),
  isAcknowledged: integer("is_acknowledged", { mode: "boolean" })
    .notNull()
    .default(false),
  createdAt: integer("created_at", {
    mode: "timestamp_ms",
  })
    .notNull()
    .default(new Date()),
  updatedAt: integer("updated_at", {
    mode: "timestamp_ms",
  })
    .notNull()
    .default(new Date()),
});

export const reminderRelations = relations(reminders, ({ one }) => ({
  subscription: one(subscriptions, {
    fields: [reminders.subscriptionId],
    references: [subscriptions.id],
  }),
}));
