import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import NetflixLogo from "@/components/logo/netflix";
import Spotify from "@/components/logo/spotify";
import YoutubeLogo from "@/components/logo/youtube";
import AppleLogo from "@/components/logo/apple";
import GameLogo from "@/components/logo/game";
import SubscriptionDetails from "./subscription-details";
import { useMediaQuery } from "@/hooks/use-media-query";
import type { subscriptionSelectType } from "@/server/db/schema";
import { useQuery } from "@tanstack/react-query";
import { getAllSubscriptions } from "@/server/actions/subscriptions";

const platformIcons = {
  netflix: NetflixLogo,
  spotify: Spotify,
  youtube: YoutubeLogo,
  apple: AppleLogo,
  games: GameLogo,
};

const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

type CalendarGridProps = {
  calendarDays: Date[];
  // subscriptions: subscriptionSelectType[];
  isDragging: boolean;
};

export function CalendarGrid({ calendarDays, isDragging }: CalendarGridProps) {
  const isMobile = useMediaQuery("(max-width: 640px)");

  const { data: allSubscriptions } = useQuery({
    queryKey: ["subscriptions"],
    queryFn: () => getAllSubscriptions(),
  });

  const getSubscriptionsForDate = (date: Date) => {
    return allSubscriptions?.filter((sub) =>
      isSubscriptionActiveOnDate(sub, date),
    );
  };

  const renderSubscriptionIcons = (
    subs: subscriptionSelectType[] | undefined,
  ) => {
    const maxIcons = isMobile ? 1 : 3;
    const iconsToShow = subs?.slice(0, maxIcons);
    const remainingCount = subs ? subs.length - maxIcons : 0;

    if (!iconsToShow) return null;

    return (
      <>
        {iconsToShow.map((sub) => {
          const Icon =
            platformIcons[sub.platform as keyof typeof platformIcons];
          return (
            <div key={sub.id} className="w-6 h-6">
              <Icon className="sm:w-6" />
            </div>
          );
        })}
        {remainingCount > 0 && (
          <div className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xs font-medium">
            +{remainingCount}
          </div>
        )}
      </>
    );
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
                  {renderSubscriptionIcons(subs)}
                </div>
                <span className="text-sm font-medium">{date.getDate()}</span>
              </div>
            </PopoverTrigger>
            {!isDragging && hasSubscriptions && (
              <PopoverContent className="p-0 w-full max-w-md">
                <SubscriptionDetails subscriptions={subs} />
              </PopoverContent>
            )}
          </Popover>
        );
      })}
    </div>
  );
}

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
    console.log("not in range for ", date);
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
