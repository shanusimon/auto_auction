import { useEffect, useState } from "react";
import { Check, ChevronsUpDown, Car } from "lucide-react";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

const brandList = [
  "Aston Martin", "Audi", "Bentley", "BMW", "Bugatti", "Cadillac",
  "Ferrari", "Jaguar", "Lamborghini", "Land Rover", "Lexus",
  "Maserati", "Maybach", "McLaren", "Mercedes-Benz", "Porsche",
  "Rolls-Royce", "Tesla", "Volvo"
];

export function CreatableBrandCombobox({
  value,
  onChange,
}: {
  value: string;
  onChange: (val: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");

  const filtered = brandList.filter((brand) =>
    brand.toLowerCase().includes(input.toLowerCase())
  );

  const handleSelect = (val: string) => {
    onChange(val);
    setInput(val);
    setOpen(false);
  };

  const handleCreateIfNotFound = () => {
    if (input && !brandList.includes(input)) {
      handleSelect(input);
    }
  };

  useEffect(() => {
    setInput(value || "");
  }, [value]);

  return (
    <div className="relative">
      <Car className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8E9196] h-4 w-4 z-10" />
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <button
            className="w-full pl-10 bg-[#1A1A1A] border border-[#333333] text-white p-2 rounded flex justify-between items-center"
          >
            {value || "Select car make"}
            <ChevronsUpDown className="h-4 w-4" />
          </button>
        </PopoverTrigger>
        <PopoverContent className="p-0 z-50 bg-[#1A1A1A] text-white border border-[#333333]">
          <Command className="bg-[#1A1A1A]">
            <CommandInput
              value={input}
              onValueChange={(val) => setInput(val)}
              placeholder="Search or enter new brand..."
              className="bg-[#1A1A1A] text-white"
            />
            {filtered.length === 0 && (
              <CommandEmpty>
                <div
                  className="cursor-pointer text-sm px-3 py-2 hover:bg-[#333333] text-white"
                  onClick={handleCreateIfNotFound}
                >
                  Click to add  <span className="font-mono pl-1 text-white"> "{input}"</span>
                </div>
              </CommandEmpty>
            )}
            <CommandGroup>
              {filtered.map((brand) => (
                <CommandItem
                  key={brand}
                  onSelect={() => handleSelect(brand)}
                  className="text-white hover:bg-[#333333]"
                >
                  <Check
                    className={`mr-2 h-4 w-4 ${
                      value === brand ? "opacity-100" : "opacity-0"
                    }`}
                  />
                  {brand}
                </CommandItem>
              ))}
            </CommandGroup>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
}