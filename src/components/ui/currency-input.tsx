import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Check } from "lucide-react";
import { currencyList, getUserCurrency } from "@/lib/currencies";

type Currency = {
  code: string;
  symbol: string;
  name: string;
};

type PriceInputProps = {
  value: string;
  onChange: (value: string, currency: string) => void;
  currency: string;
  setCurrency: (currency: string) => void;
};

export function PriceInput({
  value,
  onChange,
  currency,
  setCurrency,
}: PriceInputProps) {
  const [selectedCurrency, setSelectedCurrency] = useState<Currency | null>(
    null,
  );
  const [openCurrencySelect, setOpenCurrencySelect] = useState(false);

  useEffect(() => {
    const defaultCurrencyCode =
      currencyList.find((curr) => curr.code === currency)?.code ||
      getUserCurrency();
    const defaultCurrency =
      currencyList.find((currency) => currency.code === defaultCurrencyCode) ||
      currencyList[0];
    setSelectedCurrency(defaultCurrency);
    setCurrency(defaultCurrency.code);
  }, []);

  const handleCurrencySelect = (currency: Currency) => {
    setSelectedCurrency(currency);
    setOpenCurrencySelect(false);
    onChange(value, currency.code);
    setCurrency(currency.code);
  };

  return (
    <div className="flex gap-2">
      <Popover
        modal={true}
        open={openCurrencySelect}
        onOpenChange={setOpenCurrencySelect}
      >
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={openCurrencySelect}
            className="w-[60px] justify-between py-2"
          >
            {selectedCurrency?.symbol || "$"}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[200px] p-0">
          <Command>
            <CommandInput placeholder="Search currency..." />
            <CommandList>
              <CommandEmpty>No currency found.</CommandEmpty>
              <CommandGroup className="overflow-y-auto">
                {currencyList.map((currency) => (
                  <CommandItem
                    key={currency.code}
                    onSelect={() => handleCurrencySelect(currency)}
                  >
                    <span>{currency.symbol}</span>
                    <span className="ml-2 text-sm text-muted-foreground">
                      {currency.code}
                    </span>
                    <Check
                      className={`ml-auto h-4 w-4 ${
                        selectedCurrency?.code === currency.code
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
      <Input
        type="number"
        value={value}
        onChange={(e) =>
          onChange(e.target.value, selectedCurrency?.code || "USD")
        }
        className="w-full"
        placeholder="Price"
      />
    </div>
  );
}
