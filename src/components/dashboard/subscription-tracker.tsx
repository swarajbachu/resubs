"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import NetflixLogo from "@/components/logo/netflix";
import Spotify from "@/components/logo/spotify";
import YoutubeLogo from "@/components/logo/youtube";
import AppleLogo from "@/components/logo/apple";
import GameLogo from "@/components/logo/game";
import { addSubscriptions } from "@/server/actions/subscriptions";

type Subscription = {
  name: string;
  price: number;
  date: Date;
  platform: string;
};

const platformIcons = {
  netflix: NetflixLogo,
  spotify: Spotify,
  youtube: YoutubeLogo,
  apple: AppleLogo,
  games: GameLogo,
};

const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export function SubscriptionTracker() {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [platform, setPlatform] = useState("");
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [calendarDays, setCalendarDays] = useState<Date[]>([]);
  const [openDatePicker, setOpenDatePicker] = useState(false);

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

  const addSubscription = async () => {
    if (!name || !price || !date || !platform) {
      toast.error("Please fill in all fields");
      return;
    }
    if (name && price && date && platform) {
      setSubscriptions([
        ...subscriptions,
        {
          name,
          price: Number.parseFloat(price),
          date,
          platform,
        },
      ]);
      setName("");
      setPrice("");
      setDate(undefined);
      setPlatform("");
      toast.success("Subscription added successfully!");
    } else {
      toast.error("Please fill in all fields");
    }
    toast.promise(
      addSubscriptions({
        billingCycle: "monthly",
        startDate: new Date(),
        name,
        price,
        description: platform,
      }),
      {
        loading: "Adding subscription...",
        success: "Subscription added successfully!",
        error: "Failed to add subscription",
      },
    );
  };

  const getSubscriptionsForDate = (date: Date) => {
    return subscriptions.filter(
      (sub) =>
        sub.date.getDate() === date.getDate() &&
        sub.date.getMonth() === date.getMonth(),
    );
  };

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <div className="flex justify-between items-center mb-6 px-6">
        <h1 className="text-3xl font-bold space-x-2">
          <span className="text-foreground">
            {currentMonth.toLocaleString("default", {
              month: "long",
            })}
          </span>
          <span className="text-muted-foreground font-light">
            {currentMonth.getFullYear()}
          </span>
        </h1>
        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Add Subscription
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Subscription</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="price">Price</Label>
                <Input
                  id="price"
                  type="number"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="date">Date</Label>
                <Popover open={openDatePicker} onOpenChange={setOpenDatePicker}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      onClick={() => setOpenDatePicker(true)}
                    >
                      {date ? date.toLocaleDateString() : "Pick a date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={date}
                      onSelect={setDate}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="platform">Platform</Label>
                <Select value={platform} onValueChange={setPlatform}>
                  <SelectTrigger id="platform">
                    <SelectValue placeholder="Select platform" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="netflix">Netflix</SelectItem>
                    <SelectItem value="spotify">Spotify</SelectItem>
                    <SelectItem value="youtube">YouTube</SelectItem>
                    <SelectItem value="apple">Apple</SelectItem>
                    <SelectItem value="games">Games</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <DialogClose asChild>
                <Button onClick={addSubscription}>Add Subscription</Button>
              </DialogClose>
            </div>
          </DialogContent>
        </Dialog>
      </div>
      <Card className="bg-background">
        {/* <CardHeader>
          <CardTitle className="text-start space-x-2 text-3xl">
            <span className="text-foreground">
            {currentMonth.toLocaleString("default", {
              month: "long",
            })}
            </span>
            <span className="text-muted-foreground font-light">
              {currentMonth.getFullYear()}
            </span>
          </CardTitle>
        </CardHeader> */}
        <CardContent>
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
                        {subs.map((sub, subIndex) => {
                          const Icon =
                            platformIcons[
                              sub.platform as keyof typeof platformIcons
                            ];
                          return (
                            <div key={sub.name}>
                              <Icon />
                            </div>
                          );
                        })}
                      </div>
                      <span className="text-sm font-medium">
                        {date.getDate()}
                      </span>
                    </div>
                  </PopoverTrigger>
                  {subs.length > 0 && (
                    <PopoverContent className="w-64">
                      <div className="grid gap-2">
                        {subs.map((sub, subIndex) => {
                          const Icon =
                            platformIcons[
                              sub.platform as keyof typeof platformIcons
                            ];
                          return (
                            <div
                              key={sub.name}
                              className="flex flex-col justify-between items-start w-full"
                            >
                              <h4 className="text-sm font-medium">
                                {sub.name}
                              </h4>
                              <div className="flex flex-row justify-between items-start  w-full">
                                <div className="flex flex-col gap-2 mt-1">
                                  <span className="flex flex-row items-center space-x-2">
                                    <Icon /> <span>{sub.platform}</span>
                                  </span>
                                  <span className="text-muted-foreground text-xs">
                                    every month on {sub.date.getDate()}{" "}
                                    {nthNumber(sub.date.getDate())}
                                  </span>
                                </div>
                                <span className="mt-2">
                                  ${sub.price.toFixed(2)}
                                </span>
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
        </CardContent>
      </Card>
    </div>
  );
}

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
