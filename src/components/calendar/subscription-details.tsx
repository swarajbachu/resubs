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
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  CalendarIcon,
  CreditCardIcon,
  ClockIcon,
  DollarSignIcon,
  EditIcon,
  TrashIcon,
  Wallet,
  WalletIcon,
} from "lucide-react";
import NetflixLogo from "@/components/logo/netflix";
import Spotify from "@/components/logo/spotify";
import YoutubeLogo from "@/components/logo/youtube";
import AppleLogo from "@/components/logo/apple";
import GameLogo from "@/components/logo/game";
import type {
  subscriptionInsertTypeWithoutUserId,
  subscriptionSelectType,
} from "@/server/db/schema";
import { AddSubscriptionDialog } from "./add-subscription-dialog";
import { currencyList } from "@/lib/currencies";
import platformOptions from "@/lib/platforms";

function SubscriptionCard({
  subscription,
  onEdit,
  onDelete,
}: {
  subscription: subscriptionSelectType;
  onEdit: (subscription: subscriptionSelectType) => void;
  onDelete: (id: number) => void;
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
    platformOptions.find((platform) => platform.value === subscription.platform)
      ?.icon || GameLogo;

  return (
    <Card className=" shadow-none p-0 w-[280px] sm:w-[350px] sm:max-h-[400px] max-h-[300px] overflow-y-auto">
      <div className="flex gap-1 px-4">
        <Button
          size="sm"
          variant="outline"
          onClick={() => onEdit(subscription)}
        >
          <EditIcon className="w-4 h-4" />
        </Button>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button size="sm" variant="outline">
              <TrashIcon className="w-4 h-4" />
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete your
                subscription and remove it from our servers.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={() => onDelete(subscription.id)}>
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-base sm:text-lg max-w-[150px]  sm:max-w-[250px] font-bold">
          {subscription.name}
        </CardTitle>
        <PlatformIcon className="sm:size-7 size-6" />
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
            <WalletIcon className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm">
              Total spent: {getCurrencySymbol(subscription.currency)}{" "}
              {totalSpent}
            </span>
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
            {getCurrencySymbol(subscription.currency)} {subscription.price}
          </span>
        </div>
      </CardFooter>
    </Card>
  );
}

export default function SubscriptionDetails({
  subscriptions,
  onUpdateSubscription,
  onDeleteSubscription,
}: {
  subscriptions: subscriptionSelectType[];
  onUpdateSubscription: (
    subscription: subscriptionInsertTypeWithoutUserId,
  ) => void;
  onDeleteSubscription: (id: number) => void;
}) {
  const [editingSubscription, setEditingSubscription] =
    useState<subscriptionSelectType | null>(null);

  const handleEdit = (subscription: subscriptionSelectType) => {
    setEditingSubscription(subscription);
  };

  const handleUpdate = (
    updatedSubscription: subscriptionInsertTypeWithoutUserId,
  ) => {
    if (editingSubscription) {
      onUpdateSubscription({
        ...updatedSubscription,
        id: editingSubscription.id,
      });
      setEditingSubscription(null);
    }
  };

  return (
    <>
      <Tabs
        defaultValue={subscriptions[0]?.name}
        className="w-full max-w-md mx-auto"
      >
        <TabsList className="grid w-full grid-cols-3 bg-card p-2">
          {subscriptions.map((sub) => {
            const PlatformIcon =
              platformOptions.find(
                (platform) => platform.value === sub.platform,
              )?.icon || GameLogo;
            return (
              <TabsTrigger
                key={sub.id}
                value={sub.name}
                className="flex gap-1 rounded-sm items-center"
              >
                <PlatformIcon className="sm:size-4" />
                <span className="text-xs">{sub.platform}</span>
              </TabsTrigger>
            );
          })}
        </TabsList>
        {subscriptions.map((sub) => (
          <TabsContent key={sub.id} value={sub.name}>
            <SubscriptionCard
              subscription={sub}
              onEdit={handleEdit}
              onDelete={onDeleteSubscription}
            />
          </TabsContent>
        ))}
      </Tabs>
      {editingSubscription && (
        <AddSubscriptionDialog
          onAddSubscription={handleUpdate}
          initialSubscription={editingSubscription}
          mode="edit"
        />
      )}
    </>
  );
}

const getCurrencySymbol = (code: string) => {
  return (
    currencyList.find((currency) => currency.code === code)?.symbol || code
  );
};
