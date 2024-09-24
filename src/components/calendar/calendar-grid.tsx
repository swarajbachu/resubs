import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import SubscriptionDetails from "./subscription-details";
import { useMediaQuery } from "@/hooks/use-media-query";
import {
  type subscriptionInsertTypeWithoutUserId,
  subscriptions,
  type subscriptionSelectType,
} from "@/server/db/schema";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  deleteSubscription,
  getAllSubscriptions,
  updateSubscription,
} from "@/server/actions/subscriptions";
import { toast } from "sonner";
import platformOptions from "@/lib/platforms";
import { CircleArrowOutUpRight } from "lucide-react";

const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

type CalendarGridProps = {
  calendarDays: Date[];
  subscriptions: subscriptionSelectType[];
  isDragging: boolean;
};

export function CalendarGrid({
  calendarDays,
  isDragging,
  subscriptions: allSubscriptions,
}: CalendarGridProps) {
  const isMobile = useMediaQuery("(max-width: 640px)");

  const queryClient = useQueryClient();

  // const { data: allSubscriptions } = useQuery({
  //   queryKey: ["subscriptions"],
  //   queryFn: () => getAllSubscriptions(),
  // });

  const { mutateAsync: updateSubscriptionMutation } = useMutation({
    mutationFn: (sub: subscriptionInsertTypeWithoutUserId) =>
      // biome-ignore lint/style/noNonNullAssertion: <explanation>
      updateSubscription(sub.id!, sub),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["subscriptions"] });
    },
  });

  const { mutateAsync: deleteSubscriptionMutation } = useMutation({
    mutationFn: (id: number) => deleteSubscription(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["subscriptions"] });
    },
  });

  const getSubscriptionsForDate = (date: Date) => {
    return allSubscriptions?.filter((sub) =>
      isSubscriptionActiveOnDate(sub, date),
    );
  };

  const updateSubscriptionFunction = async (
    subscription: subscriptionInsertTypeWithoutUserId,
  ) => {
    toast.promise(updateSubscriptionMutation(subscription), {
      loading: "Updating subscription...",
      success: "Subscription updated successfully!",
      error: "Failed to update subscription",
    });
  };

  const deleteSubscriptionFunction = async (id: number) => {
    toast.promise(deleteSubscriptionMutation(id), {
      loading: "Deleting subscription...",
      success: "Subscription deleted successfully!",
      error: "Failed to delete subscription",
    });
  };

  return (
    <div className="grid grid-cols-7 gap-2">
      {daysOfWeek.map((day) => (
        <div
          key={day}
          className="text-center bg-card/70 rounded-md font-semibold text-sm py-2"
        >
          {day}
        </div>
      ))}
      {calendarDays.map((date) => {
        const subs = getSubscriptionsForDate(date);
        const hasSubscriptions = subs && subs.length > 0;

        return (
          <Popover key={date.toISOString()}>
            <PopoverTrigger asChild>
              <div
                className={`aspect-[1/1.7] sm:aspect-square rounded-lg bg-card p-2 flex flex-col items-center justify-between ${
                  hasSubscriptions ? "cursor-pointer" : ""
                }`}
              >
                <div className="flex flex-wrap gap-1 justify-center">
                  {renderSubscriptionIcons(subs, isMobile)}
                </div>
                <span className="text-sm font-medium">{date.getDate()}</span>
              </div>
            </PopoverTrigger>
            {!isDragging && hasSubscriptions && (
              <PopoverContent className="p-0 w-full max-w-md">
                <SubscriptionDetails
                  onDeleteSubscription={(id: number) =>
                    deleteSubscriptionFunction(id)
                  }
                  onUpdateSubscription={(
                    sub: subscriptionInsertTypeWithoutUserId,
                  ) => updateSubscriptionFunction(sub)}
                  subscriptions={subs}
                />
              </PopoverContent>
            )}
          </Popover>
        );
      })}
    </div>
  );
}

const renderSubscriptionIcons = (
  subs: subscriptionSelectType[] | undefined,
  isMobile: boolean,
) => {
  const maxIcons = isMobile ? 0 : 1;
  const iconsToShow = subs?.slice(0, maxIcons);
  const remainingCount = subs ? subs.length - maxIcons : 0;

  if (!iconsToShow) return null;

  return (
    <div className="flex gap-1 flex-wrap items-center justify-center">
      {iconsToShow.map((sub) => {
        const Icon =
          platformOptions.find((platform) => platform.value === sub.platform)
            ?.icon ?? CircleArrowOutUpRight;
        return <Icon key={sub.id} className="sm:w-6" />;
      })}
      {remainingCount > 0 && (
        <div className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xs font-medium">
          +{remainingCount}
        </div>
      )}
    </div>
  );
};

const isSubscriptionActiveOnDate = (
  subscription: subscriptionSelectType | undefined,
  date: Date,
): boolean => {
  if (!subscription) return false;
  const startDate = new Date(subscription.startDate);
  const endDate = subscription.endDate ? new Date(subscription.endDate) : null;

  if (isSameDay(date, startDate)) {
    return true;
  }

  // Check if the date is within the overall subscription period
  if (date < startDate || (endDate && date > endDate)) {
    return false;
  }

  // For monthly subscriptions
  if (subscription.billingCycle === "monthly") {
    // Check if the day of the month matches the start date
    return date.getDate() === startDate.getDate();
  }

  // For yearly subscriptions
  if (subscription.billingCycle === "yearly") {
    // Check if the month and day match the start date
    return (
      date.getMonth() === startDate.getMonth() &&
      date.getDate() === startDate.getDate()
    );
  }

  return false; // For any other billing cycle types
};

const isSameDay = (date1: Date, date2: Date): boolean => {
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  );
};

const nthNumber = (number: number) => {
  if (number > 3 && number < 21) return "th";
  switch (number % 10) {
    case 1:
      return "st";
    case 2:
      return "nd";
    case 3:
      return "rd";
    default:
      return "th";
  }
};
