import React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
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
import { Check, CalendarIcon } from "lucide-react";
import { PriceInput } from "@/components/ui/currency-input";
import platformOptions from "@/lib/platforms";

const billingCycles = [
  { value: "monthly", label: "Monthly" },
  { value: "yearly", label: "Yearly" },
  { value: "weekly", label: "Weekly" },
];

type SubscriptionFormContentProps = {
  name: string;
  setName: (name: string) => void;
  price: string;
  setPrice: (price: string) => void;
  startDate: Date | undefined;
  setStartDate: (date: Date | undefined) => void;
  endDate: Date | undefined;
  setEndDate: (date: Date | undefined) => void;
  platform: string;
  setPlatform: (platform: string) => void;
  isOngoing: boolean;
  setIsOngoing: (isOngoing: boolean) => void;
  billingCycle: string;
  setBillingCycle: (cycle: string) => void;
  customPlatform: string;
  setCustomPlatform: (platform: string) => void;
  handleSubmit: () => void;
  mode: "add" | "edit";
  currency: string;
  setCurrency: (currency: string) => void;
};

export function SubscriptionFormContent({
  name,
  setName,
  price,
  setPrice,
  startDate,
  setStartDate,
  endDate,
  setEndDate,
  platform,
  setPlatform,
  isOngoing,
  setIsOngoing,
  billingCycle,
  setBillingCycle,
  customPlatform,
  setCustomPlatform,
  handleSubmit,
  mode,
  currency,
  setCurrency,
}: SubscriptionFormContentProps) {
  const [openStartDatePicker, setOpenStartDatePicker] = React.useState(false);
  const [openEndDatePicker, setOpenEndDatePicker] = React.useState(false);
  const [openPlatformSelect, setOpenPlatformSelect] = React.useState(false);

  return (
    <div className="grid gap-4 sm:p-4 sm:px-0 p-4">
      <Input
        id="name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="w-full"
        placeholder="Subscription Name"
      />
      <PriceInput
        value={price}
        onChange={setPrice}
        currency={currency}
        setCurrency={setCurrency}
      />
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
            {startDate ? startDate.toLocaleDateString() : "Pick a start date"}
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
        <Popover open={openEndDatePicker} onOpenChange={setOpenEndDatePicker}>
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
        modal
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
                    <option.icon className="mr-2 size-5 sm:size-5" />
                    {option.label}
                    <Check
                      className={`ml-auto h-4 w-4 ${
                        platform === option.value ? "opacity-100" : "opacity-0"
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
      <Button onClick={handleSubmit} className="w-full">
        {mode === "add" ? "Add Subscription" : "Update Subscription"}
      </Button>
    </div>
  );
}
