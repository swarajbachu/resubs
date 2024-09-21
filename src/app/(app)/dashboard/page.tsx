import SignOut from "@/components/dashboard/signout";
import { SubscriptionTracker } from "@/components/calendar/subscriotion-tracker";
import React from "react";

export default function page() {
	return (
		<>
			<SignOut />
			<SubscriptionTracker />
		</>
	);
}
