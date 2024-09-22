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

type CalendarHeaderProps = {
  currentMonth: Date;
  onPrevMonth: () => void;
  onNextMonth: () => void;
  slideDirection: "up" | "down";
};

export function CalendarHeader({
  currentMonth,
  onPrevMonth,
  onNextMonth,
  slideDirection,
}: CalendarHeaderProps) {
  // Create springs for month and year values
  const monthSpring = useSpring(currentMonth.getMonth(), {
    stiffness: 100,
    damping: 20,
  });
  const yearSpring = useSpring(currentMonth.getFullYear(), {
    stiffness: 100,
    damping: 20,
  });

  // Transform the spring values to display
  const monthDisplay = useTransform(monthSpring, (current) =>
    new Date(0, Math.round(current)).toLocaleString("default", {
      month: "long",
    }),
  );
  const yearDisplay = useTransform(
    yearSpring,
    (current) => Math.round(current).toString(), // Removing the comma formatting
  );

  // Update springs when currentMonth changes
  useEffect(() => {
    monthSpring.set(currentMonth.getMonth());
    yearSpring.set(currentMonth.getFullYear());
  }, [currentMonth, monthSpring, yearSpring]);

  return (
    <div className="flex items-center space-x-4">
      <Button variant="outline" size="icon" onClick={onPrevMonth}>
        <ChevronLeft className="h-4 w-4" />
      </Button>
      <Button variant="outline" size="icon" onClick={onNextMonth}>
        <ChevronRight className="h-4 w-4" />
      </Button>
      <h1 className="sm:text-3xl font-bold space-x-2">
        <motion.span className={cn("tabular-nums")}>{monthDisplay}</motion.span>{" "}
        <motion.span className={cn("tabular-nums")}>{yearDisplay}</motion.span>
      </h1>
    </div>
  );
}
