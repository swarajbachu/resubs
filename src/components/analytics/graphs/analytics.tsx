"use client";

import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { PieChart, type PieChartItem } from "./pichart";
import { ScrollArea } from "@/components/ui/scroll-area";

// Dummy subscription data
const subscriptions = [
  {
    id: 1,
    name: "Netflix",
    price: 15.99,
    platform: "Streaming",
    nextPayment: "2023-07-15",
  },
  {
    id: 2,
    name: "Spotify",
    price: 9.99,
    platform: "Music",
    nextPayment: "2023-07-20",
  },
  {
    id: 3,
    name: "Amazon Prime",
    price: 12.99,
    platform: "Shopping",
    nextPayment: "2023-07-05",
  },
  {
    id: 4,
    name: "Disney+",
    price: 7.99,
    platform: "Streaming",
    nextPayment: "2023-07-18",
  },
  {
    id: 5,
    name: "GitHub",
    price: 4.99,
    platform: "Development",
    nextPayment: "2023-07-10",
  },
];

// Calculate total spending by platform
const spendingByPlatform = subscriptions.reduce(
  (acc, sub) => {
    acc[sub.platform] = (acc[sub.platform] || 0) + sub.price;
    return acc;
  },
  {} as Record<string, number>,
);

// Prepare data for pie chart
const pieChartData: PieChartItem[] = Object.entries(spendingByPlatform).map(
  ([name, value]) => ({
    name,
    value,
  }),
);

// Sort upcoming payments
const upcomingPayments = [...subscriptions].sort(
  (a, b) =>
    new Date(a.nextPayment).getTime() - new Date(b.nextPayment).getTime(),
);

export function SubscriptionAnalytics() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
      <Card className="col-span-4">
        <CardHeader>
          <CardTitle>Monthly Spending by Platform</CardTitle>
          <CardDescription>
            Distribution of your subscription costs across different platforms
          </CardDescription>
        </CardHeader>
        <CardContent className="pl-2">
          <PieChart data={pieChartData} />
        </CardContent>
      </Card>
      <Card className="col-span-3">
        <CardHeader>
          <CardTitle>Upcoming Payments</CardTitle>
          <CardDescription>
            Your subscription payments due this month
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[300px]">
            <div className="space-y-4">
              {upcomingPayments.map((sub) => (
                <div key={sub.id} className="flex justify-between items-center">
                  <div>
                    <p className="font-medium">{sub.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {sub.platform}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">${sub.price.toFixed(2)}</p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(sub.nextPayment).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
}
