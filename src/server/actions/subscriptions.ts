"use server";

import { db } from "@/server/db";
import {
  subscriptionInsertSchema,
  type subscriptionInsertType,
  type subscriptionInsertTypeWithoutUserId,
  subscriptions,
} from "@/server/db/schema";
import { eq } from "drizzle-orm";
import { auth } from "@/server/auth";
import { google } from "googleapis";

export async function addTestSubscription() {
  const session = await auth();

  if (!session?.user?.id) {
    throw new Error("You must be logged in to add a subscription");
  }

  const newSubscription = await db
    .insert(subscriptions)
    .values({
      billingCycle: "MONTHLY",
      name: "Test Subscription",
      platform: "Spotify",
      price: "10",
      currency: "USD",
      startDate: new Date(),
      endDate: new Date(),
      userId: session.user.id,
    })
    .returning()
    .catch(console.error);

  console.log("New subscription added:", newSubscription);

  return newSubscription;
}

export async function addSubscriptions(
  formData: subscriptionInsertTypeWithoutUserId,
) {
  const session = await auth();
  console.log("session", session);
  if (!session) {
    throw new Error("You must be logged in to add a subscription");
  }
  if (!session.user) {
    throw new Error("You must be logged in to add a subscription");
  }
  if (!session.user.id) {
    throw new Error("You must be logged in to add a subscription");
  }

  console.log("Form data:", formData);

  try {
    // Add subscription to database
    const newSubscription = await db
      .insert(subscriptions)
      .values({
        billingCycle: formData.billingCycle,
        name: formData.name,
        platform: formData.platform,
        price: formData.price,
        currency: formData.currency,
        startDate: formData.startDate,
        endDate: formData.endDate,
        userId: session.user.id,
      })
      .returning()
      .catch(console.error);

    console.log("New subscription added:", newSubscription);

    // Add to Google Calendar if checkbox is checked
    // if (addToGoogleCalendar) {
    //   const oauth2Client = new google.auth.OAuth2();
    //   oauth2Client.setCredentials({
    //     access_token: session.user.accessToken,
    //     refresh_token: session.user.refreshToken,
    //   });

    //   const calendar = google.calendar({ version: "v3", auth: oauth2Client });

    //   const event = {
    //     summary: `${name} Subscription`,
    //     description: description,
    //     start: {
    //       dateTime: new Date(startDate).toISOString(),
    //     },
    //     end: {
    //       dateTime: new Date(startDate + 3600000).toISOString(), // End time is start time + 1 hour
    //     },
    //     reminders: {
    //       useDefault: false,
    //       overrides: [
    //         { method: "email", minutes: 24 * 60 }, // 1 day before
    //         { method: "popup", minutes: 10 }, // 10 minutes before
    //       ],
    //     },
    //     recurrence: [
    //       `RRULE:FREQ=${billingCycle.toUpperCase()};UNTIL=${new Date(
    //         endDate || "2099-12-31"
    //       )
    //         .toISOString()
    //         .split("T")[0]
    //         .replace(/-/g, "")}`,
    //     ],
    //   };

    //   await calendar.events.insert({
    //     calendarId: "primary",
    //     requestBody: event,
    //   });
    // }

    return { success: true, subscription: newSubscription };
  } catch (error) {
    console.error("Error adding subscription:", error);
    throw error;
    // return { success: false, error: "Failed to add subscription" };
  }
}

export async function getAllSubscriptions() {
  const session = await auth();
  if (!session) {
    throw new Error("You must be logged in to add a subscription");
  }
  if (!session.user) {
    throw new Error("You must be logged in to add a subscription");
  }
  if (!session.user.id) {
    throw new Error("You must be logged in to add a subscription");
  }

  const allSubscriptions = await db.query.subscriptions.findMany({
    where: eq(subscriptions.userId, session.user.id),
  });

  return allSubscriptions;
}

export async function deleteSubscription(id: number) {
  const session = await auth();
  if (!session) {
    throw new Error("You must be logged in to delete a subscription");
  }
  if (!session.user) {
    throw new Error("You must be logged in to delete a subscription");
  }
  if (!session.user.id) {
    throw new Error("You must be logged in to delete a subscription");
  }

  await db.delete(subscriptions).where(eq(subscriptions.id, Number(id)));
}

export async function updateSubscription(
  id: number,
  formData: subscriptionInsertTypeWithoutUserId,
) {
  const session = await auth();
  if (!session) {
    throw new Error("You must be logged in to update a subscription");
  }
  if (!session.user) {
    throw new Error("You must be logged in to update a subscription");
  }
  if (!session.user.id) {
    throw new Error("You must be logged in to update a subscription");
  }

  await db
    .update(subscriptions)
    .set({ ...formData })
    .where(eq(subscriptions.id, id));
}
