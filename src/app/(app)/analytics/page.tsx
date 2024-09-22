import { SubscriptionAnalytics } from "@/components/analytics/graphs/analytics";
import React from "react";

export default function Analytics() {
  return (
    <section className="flex flex-col gap-4 justify-center items-center">
      <h1 className="text-2xl font-bold">Analytics</h1>
      <div className="max-w-screen-lg p-5">
        <SubscriptionAnalytics />
      </div>
    </section>
  );
}
