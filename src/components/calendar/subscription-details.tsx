import { useState } from "react";
import { format } from "date-fns";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  CalendarIcon,
  CreditCardIcon,
  ClockIcon,
  DollarSignIcon,
} from "lucide-react";
import NetflixLogo from "@/components/logo/netflix";
import Spotify from "@/components/logo/spotify";
import YoutubeLogo from "@/components/logo/youtube";
import AppleLogo from "@/components/logo/apple";
import GameLogo from "@/components/logo/game";
import type { subscriptionSelectType } from "@/server/db/schema";

const platformIcons = {
  netflix: NetflixLogo,
  spotify: Spotify,
  youtube: YoutubeLogo,
  apple: AppleLogo,
  games: GameLogo,
};

function SubscriptionCard({
  subscription,
}: {
  subscription: subscriptionSelectType;
}) {
  const [totalSpent, setTotalSpent] = useState(
    calculateTotalSpent(subscription),
  );

  function calculateTotalSpent(sub: subscriptionSelectType) {
    const start = new Date(sub.startDate);
    const end = sub.endDate ? new Date(sub.endDate) : new Date();
    const monthsDiff =
      (end.getFullYear() - start.getFullYear()) * 12 +
      end.getMonth() -
      start.getMonth();
    return (Number.parseFloat(sub.price) * monthsDiff).toFixed(2);
  }

  const PlatformIcon =
    platformIcons[subscription.platform as keyof typeof platformIcons] ||
    GameLogo;

  return (
    <Card className="w-full shadow-none p-0 ">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-lg sm:text-2xl font-bold">
          {subscription.name}
        </CardTitle>
        <PlatformIcon className="sm:size-7" />
      </CardHeader>
      <CardContent className="pt-1 sm:pt-4">
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">Status</span>
            <Badge variant={subscription.isActive ? "default" : "secondary"}>
              {subscription.isActive ? "Active" : "Inactive"}
            </Badge>
          </div>
          <div className="flex items-center space-x-2">
            <CalendarIcon className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm">
              Started on{" "}
              {format(new Date(subscription.startDate), "MMM d, yyyy")}
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <CreditCardIcon className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm">
              Billing cycle: {subscription.billingCycle}
            </span>
          </div>
          {subscription.endDate && (
            <div className="flex items-center space-x-2">
              <ClockIcon className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm">
                Ending on{" "}
                {format(new Date(subscription.endDate), "MMM d, yyyy")}
              </span>
            </div>
          )}
          <div className="flex items-center space-x-2">
            <DollarSignIcon className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm">Total spent: ${totalSpent}</span>
          </div>
        </div>
      </CardContent>
      <Separator className="my-4" />
      <CardFooter>
        <div className="flex justify-between items-center w-full">
          <span className="text-base sm:text-lg font-semibold">
            Monthly Cost
          </span>
          <span className="text-xl sm:text-2xl font-bold">
            ${subscription.price}
          </span>
        </div>
      </CardFooter>
    </Card>
  );
}

export default function SubscriptionDetails({
  subscriptions,
}: {
  subscriptions: subscriptionSelectType[];
}) {
  return (
    <Tabs
      defaultValue={subscriptions[0].name}
      className="w-full max-w-md mx-auto "
    >
      <TabsList className="grid w-full grid-cols-3 bg-card p-2">
        {subscriptions.map((sub) => {
          const PlatformIcon =
            platformIcons[sub.platform as keyof typeof platformIcons] ||
            GameLogo;
          return (
            <TabsTrigger
              key={sub.id}
              value={sub.name}
              className="flex gap-1 rounded-sm items-center"
            >
              <PlatformIcon className="sm:size-3" />
              <span className="text-xs">{sub.platform}</span>
            </TabsTrigger>
          );
        })}
      </TabsList>
      {subscriptions.map((sub) => (
        <TabsContent key={sub.id} value={sub.name}>
          <SubscriptionCard subscription={sub} />
        </TabsContent>
      ))}
    </Tabs>
  );
}
