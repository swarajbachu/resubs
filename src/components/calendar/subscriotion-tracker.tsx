"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import {
  addSubscriptions,
  getAllSubscriptions,
} from "@/server/actions/subscriptions";
import { AddSubscriptionDialog } from "./add-subscription-dialog";
import { CalendarHeader } from "./calendar-header";
import { AnimatePresence, motion, useAnimation } from "framer-motion";
import type {
  subscriptionInsertTypeWithoutUserId,
  subscriptionSelectType,
} from "@/server/db/schema";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { CalendarGrid } from "./calendar-grid";
import { MonthlySubscriptionOverview } from "../analytics/analytics";

export function SubscriptionTracker() {
  const [subscriptions, setSubscriptions] = useState<
    subscriptionInsertTypeWithoutUserId[]
  >([]);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [calendarDays, setCalendarDays] = useState<Date[]>([]);
  const [slideDirection, setSlideDirection] = useState<"up" | "down">("down");
  const [view, setView] = useState<"calendar" | "analytics">("calendar");

  const { data: fetchedSubscriptions } = useQuery({
    queryKey: ["subscriptions"],
    queryFn: () => getAllSubscriptions(),
  });

  useEffect(() => {
    if (fetchedSubscriptions) {
      setSubscriptions(fetchedSubscriptions);
    }
  }, [fetchedSubscriptions]);

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

  const queryClient = useQueryClient();

  const { mutateAsync: addSubscriptionMutation } = useMutation({
    mutationFn: (subscription: subscriptionInsertTypeWithoutUserId) =>
      addSubscriptions(subscription),
    onSuccess: () => {
      console.log("Subscription added");
      queryClient.invalidateQueries({ queryKey: ["subscriptions"] });
    },
  });

  const addSubscriptionFunction = async (
    newSubscription: subscriptionInsertTypeWithoutUserId,
  ) => {
    // setSubscriptions([...subscriptions, newSubscription]);
    console.log("newSubscription", newSubscription);
    toast.promise(addSubscriptionMutation(newSubscription), {
      loading: "Adding subscription...",
      success: "Subscription added successfully!",
      error: "Failed to add subscription",
    });
  };

  const changeMonth = (increment: number) => {
    setSlideDirection(increment > 0 ? "up" : "down");
    setCurrentMonth((prevMonth) => {
      const newMonth = new Date(prevMonth);
      newMonth.setMonth(newMonth.getMonth() + increment);
      return newMonth;
    });
  };

  const totalMoneySpent = subscriptions
    .filter((sub) => {
      const startDate = new Date(sub.startDate);
      const endDate = sub.endDate ? new Date(sub.endDate) : null;
      return (
        startDate <= currentMonth &&
        (endDate === null || endDate >= currentMonth) &&
        sub.isActive
      );
    })
    .reduce((total, sub) => total + Number.parseFloat(sub.price), 0);

  return (
    <div className="container mx-auto p-4 max-w-3xl">
      <CalendarHeader
        slideDirection={slideDirection}
        currentMonth={currentMonth}
        onPrevMonth={() => changeMonth(-1)}
        onNextMonth={() => changeMonth(1)}
        totalMoneySpent={totalMoneySpent}
        onTotalMoneyClick={() =>
          setView(view === "analytics" ? "calendar" : "analytics")
        }
      />
      <div className="fixed bottom-4 right-16">
        <AddSubscriptionDialog onAddSubscription={addSubscriptionFunction} />
      </div>
      <Card className="bg-background overflow-hidden shadow-none">
        <CardContent className="sm:p-6 p-1">
          <CalendarSwitcher
            view={view}
            currentMonth={currentMonth}
            slideDirection={slideDirection}
            calendarDays={calendarDays}
            subscriptions={fetchedSubscriptions ?? []}
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
  view: "calendar" | "analytics";
  subscriptions: subscriptionSelectType[];
  onChangeMonth: (increment: number) => void;
}

function CalendarSwitcher({
  currentMonth,
  slideDirection,
  calendarDays,
  view,
  onChangeMonth,
  subscriptions,
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
        initial={{ y: slideDirection === "up" ? "20%" : "-20%", opacity: 0 }}
        exit={{ y: slideDirection === "up" ? "-20%" : "20%", opacity: 0 }}
        transition={{ type: "spring", stiffness: 100, damping: 20 }}
        drag="y"
        draggable
        dragConstraints={{ top: 0, bottom: 0 }}
        dragElastic={0.1}
        onDragStart={() => setIsDragging(true)}
        onDragEnd={handleDragEnd}
        style={{ touchAction: "none" }}
        className="h-[68vh] overflow-y-auto"
      >
        {view === "calendar" && (
          <CalendarGrid
            calendarDays={calendarDays}
            subscriptions={subscriptions}
            isDragging={isDragging}
          />
        )}
        {view === "analytics" && (
          <MonthlySubscriptionOverview
            month={currentMonth}
            subscriptions={subscriptions}
          />
        )}
      </motion.div>
    </AnimatePresence>
  );
}
