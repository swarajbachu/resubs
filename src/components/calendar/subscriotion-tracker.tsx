"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import { addSubscriptions } from "@/server/actions/subscription";
import { AddSubscriptionDialog } from "./add-subscription-dialog";
import { CalendarHeader } from "./calendar-header";
import { CalendarGrid } from "./calendar-grid";
import { AnimatePresence, motion } from "framer-motion";

type Subscription = {
  name: string;
  price: number;
  date: Date;
  platform: string;
};

export function SubscriptionTracker() {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [calendarDays, setCalendarDays] = useState<Date[]>([]);
  const [slideDirection, setSlideDirection] = useState<"left" | "right">(
    "left",
  );

  useEffect(() => {
    console.log("slideDirection updated to:", slideDirection);
  }, [slideDirection]);

  useEffect(() => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const days = [];

    for (let d = firstDay; d <= lastDay; d.setDate(d.getDate() + 1)) {
      days.push(new Date(d));
    }

    setCalendarDays(days);
  }, [currentMonth]);

  const addSubscription = async (newSubscription: Subscription) => {
    setSubscriptions([...subscriptions, newSubscription]);
    toast.promise(
      addSubscriptions({
        billingCycle: "monthly",
        startDate: new Date(),
        name: newSubscription.name,
        price: newSubscription.price.toString(),
        description: newSubscription.platform,
      }),
      {
        loading: "Adding subscription...",
        success: "Subscription added successfully!",
        error: "Failed to add subscription",
      },
    );
  };

  const changeMonth = (increment: number) => {
    setSlideDirection(increment > 0 ? "left" : "right");
    console.log(slideDirection, "slideDirection");
    setCurrentMonth((prevMonth) => {
      const newMonth = new Date(prevMonth);
      newMonth.setMonth(newMonth.getMonth() + increment);
      return newMonth;
    });
  };

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <div className="flex justify-between items-center mb-6 px-6">
        <CalendarHeader
          currentMonth={currentMonth}
          slideDirection={slideDirection}
          onPrevMonth={() => changeMonth(-1)}
          onNextMonth={() => changeMonth(1)}
        />
        <AddSubscriptionDialog onAddSubscription={addSubscription} />
      </div>
      <Card className="bg-background overflow-hidden">
        <CardContent>
          <CalendarSwitcher
            currentMonth={currentMonth}
            slideDirection={slideDirection}
            calendarDays={calendarDays}
            subscriptions={subscriptions}
          />
        </CardContent>
      </Card>
    </div>
  );
}

interface CalendarSwitcherProps {
  currentMonth: Date;
  slideDirection: "left" | "right";
  calendarDays: Date[];
  subscriptions: Subscription[];
}

function CalendarSwitcher({
  currentMonth,
  slideDirection,
  calendarDays,
  subscriptions,
}: CalendarSwitcherProps) {
  return (
    <AnimatePresence mode="popLayout">
      <motion.div
        key={`${currentMonth.toISOString()}-${slideDirection}`} // Include slideDirection in the key
        initial={{
          y: slideDirection === "left" ? "-50%" : "50%",
          opacity: 0,
        }}
        animate={{ y: 0, opacity: 1 }}
        exit={{
          y: slideDirection === "left" ? "50%" : "-50%",
          opacity: 0,
        }}
        transition={{
          type: "spring",
          stiffness: 100,
          damping: 20,
          duration: 0.3,
        }}
      >
        <CalendarGrid
          calendarDays={calendarDays}
          subscriptions={subscriptions}
        />
      </motion.div>
    </AnimatePresence>
  );
}
