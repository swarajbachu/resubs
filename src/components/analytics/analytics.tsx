"use client";

import * as React from "react";
import { PieChart, Pie, Cell, Label } from "recharts";
import { format } from "date-fns";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import type { subscriptionSelectType } from "@/server/db/schema";

interface MonthlySubscriptionOverviewProps {
  month: Date;
  subscriptions: subscriptionSelectType[];
}

const COLORS = [
  "hsl(217, 91%, 60%)", // Sapphire Blue
  "hsl(215, 100%, 50%)", // Electric Blue
  "hsl(199, 89%, 48%)", // Sky Blue
  "hsl(190, 90%, 50%)", // Cyan
  "hsl(183, 100%, 35%)", // Teal
];

export function MonthlySubscriptionOverview({
  month,
  subscriptions,
}: MonthlySubscriptionOverviewProps) {
  const activeSubscriptions = React.useMemo(() => {
    return subscriptions.filter((sub) => {
      const startDate = new Date(sub.startDate);
      const endDate = sub.endDate ? new Date(sub.endDate) : null;
      return (
        startDate <= month &&
        (endDate === null || endDate >= month) &&
        sub.isActive
      );
    });
  }, [month, subscriptions]);

  const chartData = React.useMemo(() => {
    const platformSpending: { [key: string]: number } = {};
    // biome-ignore lint/complexity/noForEach: <explanation>
    activeSubscriptions.forEach((sub) => {
      const price = Number.parseFloat(sub.price);
      if (platformSpending[sub.platform]) {
        platformSpending[sub.platform] += price;
      } else {
        platformSpending[sub.platform] = price;
      }
    });
    return Object.entries(platformSpending).map(([platform, amount]) => ({
      platform,
      amount,
    }));
  }, [activeSubscriptions]);

  const totalSpending = React.useMemo(() => {
    return chartData.reduce((total, item) => total + item.amount, 0);
  }, [chartData]);

  const chartConfig = chartData.reduce((config, item, index) => {
    config[item.platform] = {
      label: item.platform,
      color: COLORS[index % COLORS.length],
    };
    return config;
  }, {} as ChartConfig);

  return (
    <Card className="flex flex-col bg-background  overflow-y-auto">
      <div className="flex-1">
        <CardHeader>
          <CardTitle>Monthly Subscription Overview</CardTitle>
          <CardDescription>{format(month, "MMMM yyyy")}</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer
            config={chartConfig}
            className="mx-auto aspect-square max-h-[300px]"
          >
            <PieChart>
              <ChartTooltip content={<ChartTooltipContent />} />
              <Pie
                data={chartData}
                dataKey="amount"
                nameKey="platform"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
              >
                {chartData.map((entry, index) => (
                  <Cell
                    key={`cell-${entry.amount}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
                <Label
                  content={({ viewBox }) => {
                    if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                      return (
                        <text
                          x={viewBox.cx}
                          y={viewBox.cy}
                          textAnchor="middle"
                          dominantBaseline="middle"
                        >
                          <tspan
                            x={viewBox.cx}
                            y={viewBox.cy}
                            className="fill-foreground text-2xl font-bold"
                          >
                            ${totalSpending.toFixed(2)}
                          </tspan>
                          <tspan
                            x={viewBox.cx}
                            y={(viewBox.cy || 0) + 20}
                            className="fill-muted-foreground text-sm"
                          >
                            Total
                          </tspan>
                        </text>
                      );
                    }
                  }}
                />
              </Pie>
            </PieChart>
          </ChartContainer>
        </CardContent>
      </div>
      <div className="flex-1 border-t lg:border-l lg:border-t-0">
        <CardHeader>
          <CardTitle>Active Subscriptions</CardTitle>
          <CardDescription>
            {activeSubscriptions.length} active subscription
            {activeSubscriptions.length !== 1 ? "s" : ""}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[300px] pr-4">
            {activeSubscriptions.map((sub) => (
              <div
                key={sub.id}
                className="mb-4 flex items-center justify-between"
              >
                <div>
                  <h4 className="font-semibold">{sub.name}</h4>
                  <p className="text-sm text-muted-foreground">
                    {sub.platform}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-medium">${sub.price}</p>
                  <Badge variant="outline">{sub.billingCycle}</Badge>
                </div>
              </div>
            ))}
          </ScrollArea>
        </CardContent>
      </div>
      <CardFooter className="flex-col gap-2 text-sm">
        <div className="leading-none text-muted-foreground">
          Showing active subscriptions for {format(month, "MMMM yyyy")}
        </div>
      </CardFooter>
    </Card>
  );
}
