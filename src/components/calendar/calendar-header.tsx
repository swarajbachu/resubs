import { Button } from "@/components/ui/button";
import {
  AnimatePresence,
  motion,
  useSpring,
  useTransform,
} from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils"; // Adjust your import for cn utility if necessary
import { useEffect } from "react";
import { addTestSubscription } from "@/server/actions/subscriptions";

type CalendarHeaderProps = {
  currentMonth: Date;
  onPrevMonth: () => void;
  onNextMonth: () => void;
  slideDirection: "up" | "down";
  totalMoneySpent: number;
  onTotalMoneyClick: () => void;
};

export function CalendarHeader({
  currentMonth,
  onPrevMonth,
  onNextMonth,
  slideDirection,
  totalMoneySpent,
  onTotalMoneyClick,
}: CalendarHeaderProps) {
  const monthSpring = useSpring(currentMonth.getMonth(), {
    stiffness: 100,
    damping: 20,
  });
  const yearSpring = useSpring(currentMonth.getFullYear(), {
    stiffness: 100,
    damping: 20,
  });

  const totalMoneySpentSpring = useSpring(totalMoneySpent, {
    stiffness: 100,
    damping: 20,
  });

  const monthDisplay = useTransform(monthSpring, (current) =>
    new Date(0, Math.round(current)).toLocaleString("default", {
      month: "long",
    }),
  );
  const yearDisplay = useTransform(yearSpring, (current) =>
    Math.round(current).toString(),
  );

  const totalMoneySpentDisplay = useTransform(
    totalMoneySpentSpring,
    (current) => current.toFixed(2),
  );

  useEffect(() => {
    monthSpring.set(currentMonth.getMonth());
    yearSpring.set(currentMonth.getFullYear());
    totalMoneySpentSpring.set(totalMoneySpent);
  }, [
    currentMonth,
    monthSpring,
    yearSpring,
    totalMoneySpent,
    totalMoneySpentSpring,
  ]);

  return (
    <div className="flex items-center justify-between space-x-4 w-full">
      <div className="flex items-center space-x-2">
        <Button variant="outline" size="icon" onClick={onPrevMonth}>
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <Button variant="outline" size="icon" onClick={onNextMonth}>
          <ChevronRight className="h-4 w-4" />
        </Button>
        <h1 className="sm:text-3xl font-bold space-x-2">
          <motion.span className={cn("tabular-nums")}>
            {monthDisplay}
          </motion.span>{" "}
          <motion.span className={cn("tabular-nums")}>
            {yearDisplay}
          </motion.span>
        </h1>
      </div>
      <Button
        variant="ghost"
        className="cursor-pointer"
        onClick={onTotalMoneyClick}
      >
        <span className="text-xl font-bold mr-1">$</span>
        <motion.span className="text-xl font-bold tabular-nums">
          {totalMoneySpentDisplay}
        </motion.span>
      </Button>
    </div>
  );
}
