import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Plus, Check, CalendarIcon } from "lucide-react";
import type { subscriptionInsertType } from "@/server/db/schema";
import NetflixLogo from "@/components/logo/netflix";
import Spotify from "@/components/logo/spotify";
import YoutubeLogo from "@/components/logo/youtube";
import AppleLogo from "@/components/logo/apple";
import GameLogo from "@/components/logo/game";
import { PriceInput } from "../ui/currency-input";

type AddSubscriptionDialogProps = {
  onAddSubscription: (
    subscription: Omit<subscriptionInsertType, "userId">,
  ) => void;
};

const platformOptions = [
  { value: "netflix", label: "Netflix", icon: NetflixLogo },
  { value: "spotify", label: "Spotify", icon: Spotify },
  { value: "youtube", label: "YouTube", icon: YoutubeLogo },
  { value: "apple", label: "Apple", icon: AppleLogo },
  { value: "games", label: "Games", icon: GameLogo },
  { value: "other", label: "Other", icon: Plus },
];

const billingCycles = [
  { value: "monthly", label: "Monthly" },
  { value: "yearly", label: "Yearly" },
  { value: "weekly", label: "Weekly" },
];

export function AddSubscriptionDialog({
  onAddSubscription,
}: AddSubscriptionDialogProps) {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);
  const [platform, setPlatform] = useState("");
  const [isOngoing, setIsOngoing] = useState(true);
  const [billingCycle, setBillingCycle] = useState("monthly");
  const [openStartDatePicker, setOpenStartDatePicker] = useState(false);
  const [openEndDatePicker, setOpenEndDatePicker] = useState(false);
  const [openPlatformSelect, setOpenPlatformSelect] = useState(false);
  const [customPlatform, setCustomPlatform] = useState("");

  const handleAddSubscription = () => {
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
      });
      resetForm();
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
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Add Subscription
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Subscription</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <Input
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full"
            placeholder="Subscription Name"
          />
          {/* <Input
            id="price"
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="w-full"
            placeholder="Price"
          /> */}
          <PriceInput value={price} onChange={setPrice} />
          <Select value={billingCycle} onValueChange={setBillingCycle}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select billing cycle" />
            </SelectTrigger>
            <SelectContent>
              {billingCycles.map((cycle) => (
                <SelectItem key={cycle.value} value={cycle.value}>
                  {cycle.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Popover
            modal={true}
            open={openStartDatePicker}
            onOpenChange={setOpenStartDatePicker}
          >
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="w-full justify-start text-left font-normal"
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {startDate
                  ? startDate.toLocaleDateString()
                  : "Pick a start date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={startDate}
                onSelect={(date) => {
                  setStartDate(date);
                  setOpenStartDatePicker(false);
                }}
                initialFocus
              />
            </PopoverContent>
          </Popover>
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">
              Ongoing Subscription
            </span>
            <Switch
              id="ongoing"
              checked={isOngoing}
              onCheckedChange={setIsOngoing}
            />
          </div>
          {!isOngoing && (
            <Popover
              open={openEndDatePicker}
              onOpenChange={setOpenEndDatePicker}
            >
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-start text-left font-normal"
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {endDate ? endDate.toLocaleDateString() : "Pick an end date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={endDate}
                  onSelect={(date) => {
                    setEndDate(date);
                    setOpenEndDatePicker(false);
                  }}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          )}
          <Popover
            open={openPlatformSelect}
            onOpenChange={setOpenPlatformSelect}
          >
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={openPlatformSelect}
                className="w-full justify-between"
              >
                {platform
                  ? platformOptions.find((option) => option.value === platform)
                      ?.label
                  : "Select platform"}
                <Check className={"ml-auto h-4 w-4 opacity-0"} />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[200px] p-0">
              <Command>
                <CommandInput placeholder="Search platform..." />
                <CommandList>
                  <CommandEmpty>No platform found.</CommandEmpty>
                  <CommandGroup>
                    {platformOptions.map((option) => (
                      <CommandItem
                        key={option.value}
                        onSelect={() => {
                          setPlatform(option.value);
                          setOpenPlatformSelect(false);
                        }}
                      >
                        <option.icon className="mr-2 sm:size-4" />
                        {option.label}
                        <Check
                          className={`ml-auto h-4 w-4 ${
                            platform === option.value
                              ? "opacity-100"
                              : "opacity-0"
                          }`}
                        />
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
          {platform === "other" && (
            <Input
              id="customPlatform"
              value={customPlatform}
              onChange={(e) => setCustomPlatform(e.target.value)}
              placeholder="Enter custom platform"
              className="w-full"
            />
          )}
          <DialogClose asChild>
            <Button onClick={handleAddSubscription} className="w-full">
              Add Subscription
            </Button>
          </DialogClose>
        </div>
      </DialogContent>
    </Dialog>
  );
}
