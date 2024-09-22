import { Button } from "@/components/ui/button";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";

type CalendarHeaderProps = {
  currentMonth: Date;
  onPrevMonth: () => void;
  onNextMonth: () => void;
  slideDirection: "left" | "right";
};

export function CalendarHeader({
  currentMonth,
  onPrevMonth,
  onNextMonth,
  slideDirection,
}: CalendarHeaderProps) {
  return (
    <div className="flex items-center space-x-4">
      <Button variant="outline" size="icon" onClick={onPrevMonth}>
        <ChevronLeft className="h-4 w-4" />
      </Button>
      <AnimatePresence mode="wait">
        <motion.h1
          key={`${currentMonth.toLocaleString("default", {
            month: "long",
          })}-${slideDirection}`}
          initial={{
            filter: "blur(10px)",
            y: slideDirection === "left" ? "100%" : "-100%",
            opacity: 0,
          }}
          animate={{
            filter: "blur(0px)",
            y: 0,
            opacity: 1,
          }}
          // exit={{
          //   y: slideDirection === "left" ? "-100%" : "100%",
          //   opacity: 0,
          // }}
          transition={{
            type: "spring",
            stiffness: 100,
            damping: 20,
            duration: 0.3,
          }}
          className="text-3xl font-bold space-x-2"
        >
          {currentMonth.toLocaleString("default", { month: "long" })}{" "}
          {currentMonth.getFullYear()}
        </motion.h1>
      </AnimatePresence>
      <Button variant="outline" size="icon" onClick={onNextMonth}>
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  );
}
