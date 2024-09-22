"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import { addSubscriptions } from "@/server/actions/subscriptions";
import { AddSubscriptionDialog } from "./add-subscription-dialog";
import { CalendarHeader } from "./calendar-header";
import { CalendarGrid } from "./calendar-grid";
import { AnimatePresence, motion, useAnimation } from "framer-motion";

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
  const [slideDirection, setSlideDirection] = useState<"up" | "down">("down");

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
        platform: newSubscription.platform,
      }),
      {
        loading: "Adding subscription...",
        success: "Subscription added successfully!",
        error: "Failed to add subscription",
      }
    );
  };

  const changeMonth = (increment: number) => {
    setSlideDirection(increment > 0 ? "up" : "down");
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
          slideDirection={slideDirection}
          currentMonth={currentMonth}
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
            onChangeMonth={changeMonth}
          />
        </CardContent>
      </Card>
    </div>
  );
}

interface CalendarSwitcherProps {
  currentMonth: Date;
  slideDirection: "up" | "down";
  calendarDays: Date[];
  subscriptions: Subscription[];
  onChangeMonth: (increment: number) => void;
}

function CalendarSwitcher({
  currentMonth,
  slideDirection,
  calendarDays,
  subscriptions,
  onChangeMonth,
}: CalendarSwitcherProps) {
  const controls = useAnimation();
  const [isDragging, setIsDragging] = useState(false);

  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  const handleDragEnd = (event: any, info: any) => {
    const threshold = 200; // Minimum distance to trigger month change
    setIsDragging(false);

    if (info.offset.y < -threshold) {
      onChangeMonth(1); // Swipe up, go to next month
    } else if (info.offset.y > threshold) {
      onChangeMonth(-1); // Swipe down, go to previous month
    } else {
      // If the drag didn't exceed the threshold, animate back to the starting position
      controls.start({ y: 0 });
    }
  };

  return (
    <AnimatePresence mode="popLayout">
      <motion.div
        key={currentMonth.toISOString()}
        animate={{ y: 0, opacity: 1 }}
        initial={{ y: slideDirection === "up" ? "100%" : "-100%", opacity: 0 }}
        exit={{ y: slideDirection === "up" ? "-100%" : "100%", opacity: 0 }}
        transition={{ type: "spring", stiffness: 100, damping: 20 }}
        drag="y"
        draggable
        dragConstraints={{ top: 0, bottom: 0 }}
        dragElastic={0.1}
        onDragStart={() => setIsDragging(true)}
        onDragEnd={handleDragEnd}
        style={{ touchAction: "none" }}
      >
        <CalendarGrid
          calendarDays={calendarDays}
          subscriptions={subscriptions}
          isDragging={isDragging}
        />
      </motion.div>
    </AnimatePresence>
  );
}
