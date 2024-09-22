import { useState } from "react";
import { Button } from "@/components/ui/button";
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
import type { subscriptionInsertType } from "@/server/db/schema";

type AddSubscriptionDialogProps = {
  onAddSubscription: (
    subscription: Omit<subscriptionInsertType, "userId">,
  ) => void;
};

export function AddSubscriptionDialog({
  onAddSubscription,
}: AddSubscriptionDialogProps) {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [platform, setPlatform] = useState("");
  const [openDatePicker, setOpenDatePicker] = useState(false);

  const handleAddSubscription = () => {
    console.log(name, price, date, platform);
    if (name && price && date && platform) {
      onAddSubscription({
        billingCycle: "monthly",

        name,
        price: price,
        startDate: date,
        platform,
      });
      setName("");
      setPrice("");
      setDate(undefined);
      setPlatform("");
    }
  };

  return (
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
            <Button onClick={handleAddSubscription}>Add Subscription</Button>
          </DialogClose>
        </div>
      </DialogContent>
    </Dialog>
  );
}
