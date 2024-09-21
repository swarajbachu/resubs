"use server";

import { db } from "@/server/db";
import {
	subscriptionInsertSchema,
	subscriptionInsertType,
	subscriptions,
} from "@/server/db/schema";
import { eq } from "drizzle-orm";
import { auth } from "@/server/auth";
import { google } from "googleapis";

export async function addSubscriptions(
	formData: Omit<subscriptionInsertType, "userId">,
) {
	const session = await auth();
	if (!session) {
		throw new Error("You must be logged in to add a subscription");
	}
	if (!session.user) {
		throw new Error("You must be logged in to add a subscription");
	}

	try {
		// Add subscription to database
		const [newSubscription] = await db
			.insert(subscriptions)
			.values({ ...formData, userId: session.user.id! })
			.returning();

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
		return { success: false, error: "Failed to add subscription" };
	}
}
