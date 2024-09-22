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
import { useQuery } from "@tanstack/react-query";
import { getAllSubscriptions } from "@/server/actions/subscriptions";
import type { subscriptionSelectType } from "@/server/db/schema";

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
  subscriptions: {
    name: string;
    price: number;
    date: Date;
    platform: string;
  }[];
  isDragging: boolean;
};

export function CalendarGrid({
  calendarDays,
  subscriptions,
  isDragging,
}: CalendarGridProps) {
  const { data: allSubscriptions } = useQuery({
    queryKey: ["subscriptions"],
    queryFn: () => getAllSubscriptions(),
  });

  const getSubscriptionsForDate = (date: Date) => {
    return allSubscriptions?.filter((sub) =>
      isSubscriptionActiveOnDate(sub, date),
    );
  };

  console.log(
    isSubscriptionActiveOnDate(allSubscriptions?.[0], new Date(1726919872627)),
    "isActive",
  );

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
      {calendarDays.map((date, index) => {
        const subs = getSubscriptionsForDate(date);
        return (
          <Popover key={date.toISOString()}>
            <PopoverTrigger asChild>
              <div className="aspect-square rounded-lg bg-card p-2 flex flex-col items-center justify-between cursor-pointer">
                <div className="flex flex-wrap gap-1 justify-center">
                  {subs?.map((sub, subIndex) => {
                    const Icon =
                      platformIcons[sub.platform as keyof typeof platformIcons];
                    return (
                      <div key={sub.name}>
                        <Icon />
                      </div>
                    );
                  })}
                </div>
                <span className="text-sm font-medium">{date.getDate()}</span>
              </div>
            </PopoverTrigger>
            {!isDragging && subs && subs.length > 0 && (
              <PopoverContent className="w-64">
                <div className="grid gap-2">
                  {subs.map((sub, subIndex) => {
                    const Icon =
                      platformIcons[sub.platform as keyof typeof platformIcons];
                    return (
                      <div
                        key={sub.name}
                        className="flex flex-col justify-between items-start w-full"
                      >
                        <h4 className="text-sm font-medium">{sub.name}</h4>
                        <div className="flex flex-row justify-between items-start w-full">
                          <div className="flex flex-col gap-2 mt-1">
                            <span className="flex flex-row items-center space-x-2">
                              <Icon /> <span>{sub.platform}</span>
                            </span>
                            <span className="text-muted-foreground text-xs">
                              every month on {sub.startDate.getDate()}{" "}
                              {nthNumber(sub.startDate.getDate())}
                            </span>
                          </div>
                          <span className="mt-2">${sub.price}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
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
