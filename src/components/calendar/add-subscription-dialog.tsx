import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Plus } from "lucide-react";
import type {
  subscriptionInsertTypeWithoutUserId,
  subscriptionSelectType,
} from "@/server/db/schema";
import { SubscriptionFormContent } from "./add-subscription-content";
import { useMediaQuery } from "@/hooks/use-media-query";

type AddSubscriptionDialogProps = {
  onAddSubscription: (
    subscription: subscriptionInsertTypeWithoutUserId,
  ) => void;
  initialSubscription?: subscriptionSelectType;
  mode?: "add" | "edit";
};

export function AddSubscriptionDialog({
  onAddSubscription,
  initialSubscription,
  mode = "add",
}: AddSubscriptionDialogProps) {
  const [name, setName] = useState(initialSubscription?.name || "");
  const [price, setPrice] = useState(initialSubscription?.price || "");
  const [currency, setCurrency] = useState(
    initialSubscription?.currency || "USD",
  );
  const [startDate, setStartDate] = useState<Date | undefined>(
    initialSubscription?.startDate
      ? new Date(initialSubscription.startDate)
      : undefined,
  );
  const [endDate, setEndDate] = useState<Date | undefined>(
    initialSubscription?.endDate
      ? new Date(initialSubscription.endDate)
      : undefined,
  );
  const [platform, setPlatform] = useState(initialSubscription?.platform || "");
  const [isOngoing, setIsOngoing] = useState(
    initialSubscription?.endDate === null,
  );
  const [billingCycle, setBillingCycle] = useState(
    initialSubscription?.billingCycle || "monthly",
  );
  const [customPlatform, setCustomPlatform] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const isMobile = useMediaQuery("(max-width: 640px)");

  useEffect(() => {
    if (initialSubscription) {
      setName(initialSubscription.name);
      setPrice(initialSubscription.price);
      setStartDate(new Date(initialSubscription.startDate));
      setEndDate(
        initialSubscription.endDate
          ? new Date(initialSubscription.endDate)
          : undefined,
      );
      setPlatform(initialSubscription.platform);
      setIsOngoing(initialSubscription.endDate === null);
      setBillingCycle(initialSubscription.billingCycle);
      setCurrency(initialSubscription.currency);
      setIsOpen(true);
    }
  }, [initialSubscription]);

  const handleSubmit = () => {
    if (
      name &&
      price &&
      startDate &&
      (isOngoing || endDate) &&
      (platform || customPlatform)
    ) {
      onAddSubscription({
        billingCycle,
        name,
        price: price,
        startDate: startDate,
        endDate: isOngoing ? null : endDate,
        platform: platform === "other" ? customPlatform : platform,
        currency: currency,
      });
      resetForm();
      setIsOpen(false);
    }
  };

  const resetForm = () => {
    setName("");
    setPrice("");
    setStartDate(undefined);
    setEndDate(undefined);
    setPlatform("");
    setIsOngoing(true);
    setCustomPlatform("");
    setBillingCycle("monthly");
    setCurrency("USD");
  };

  const formContent = (
    <SubscriptionFormContent
      name={name}
      setName={setName}
      price={price}
      setPrice={setPrice}
      startDate={startDate}
      setStartDate={setStartDate}
      endDate={endDate}
      setEndDate={setEndDate}
      platform={platform}
      setPlatform={setPlatform}
      isOngoing={isOngoing}
      setIsOngoing={setIsOngoing}
      billingCycle={billingCycle}
      setBillingCycle={setBillingCycle}
      customPlatform={customPlatform}
      setCustomPlatform={setCustomPlatform}
      handleSubmit={handleSubmit}
      mode={mode}
      currency={currency}
      setCurrency={setCurrency}
    />
  );

  if (isMobile) {
    return (
      <Drawer open={isOpen} onOpenChange={setIsOpen}>
        {mode === "add" && (
          <DrawerTrigger asChild>
            <Button size="sm" className="h-9">
              <Plus className="w-4 h-4 mr-2" />
              Add Subscription
            </Button>
          </DrawerTrigger>
        )}
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>
              {mode === "add" ? "Add New Subscription" : "Edit Subscription"}
            </DrawerTitle>
          </DrawerHeader>
          {formContent}
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      {mode === "add" && (
        <DialogTrigger asChild>
          <Button size="sm" className="h-9">
            <Plus className="w-4 h-4 mr-2" />
            Add Subscription
          </Button>
        </DialogTrigger>
      )}
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {mode === "add" ? "Add New Subscription" : "Edit Subscription"}
          </DialogTitle>
        </DialogHeader>
        {formContent}
      </DialogContent>
    </Dialog>
  );
}
