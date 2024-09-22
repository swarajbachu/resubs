"use client";

import React, { useState, useEffect } from "react";
import { format, addMonths, subMonths } from "date-fns";
// import { TotalMonthlyExpenditure } from "./graphs/total-monthly-expenditure";
// import { SpendingBreakdownByPlatform } from "./graphs/spending-breakdown-by-platform";
// import { MonthlySpendingByPlatform } from "./graphs/monthly-spending-by-platform";
// import { AverageSubscriptionPrice } from "./graphs/average-subscription-price";
// import { UpcomingSubscriptionRenewals } from "./graphs/upcoming-subscription-renewals";
// import { LifetimeValueOfSubscriptions } from "./graphs/lifetime-value-of-subscriptions";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { subscriptionSelectType } from "@/server/db/schema";
import { useQuery } from "@tanstack/react-query";
import { getAllSubscriptions } from "@/server/actions/subscriptions";

export function SubscriptionAnalytics() {
  const [currentDate, setCurrentDate] = useState(new Date());

  const { data: subscriptions } = useQuery({
    queryKey: ["subscriptions"],
    queryFn: () => getAllSubscriptions(),
  });

  const handlePreviousMonth = () => {
    setCurrentDate((prevDate) => subMonths(prevDate, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate((prevDate) => addMonths(prevDate, 1));
  };

  if (!subscriptions) return <p>Loading...</p>;

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Subscription Analytics</h1>
        <div className="flex items-center space-x-4">
          <Button onClick={handlePreviousMonth} variant="outline" size="icon">
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="font-medium">
            {format(currentDate, "MMMM yyyy")}
          </span>
          <Button onClick={handleNextMonth} variant="outline" size="icon">
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* <TotalMonthlyExpenditure
        subscriptions={subscriptions}
        currentDate={currentDate}
      />
      <SpendingBreakdownByPlatform
        subscriptions={subscriptions}
        currentDate={currentDate}
      />
      <MonthlySpendingByPlatform
        subscriptions={subscriptions}
        currentDate={currentDate}
      />
      <AverageSubscriptionPrice subscriptions={subscriptions} />
      <UpcomingSubscriptionRenewals
        subscriptions={subscriptions}
        currentDate={currentDate}
      />
      <LifetimeValueOfSubscriptions subscriptions={subscriptions} /> */}
    </div>
  );
}
