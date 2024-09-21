import SignOut from "@/components/dashboard/signout";
import { SubscriptionTracker } from "@/components/dashboard/subscription-tracker";
import React from "react";

export default function page() {
  return (
    <>
      <SignOut />
      <SubscriptionTracker />
    </>
  );
}
