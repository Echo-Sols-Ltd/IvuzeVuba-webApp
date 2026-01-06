"use client";

import * as React from "react";
import { ChevronDownIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

export function FilterByDate({ onChange }: { onChange?: (date: Date | undefined) => void }) {
  const [open, setOpen] = React.useState(false);
  const [date, setDate] = React.useState<Date | undefined>(undefined);

  return (
    <div className="flex flex-col gap-3">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            id="date"
            className="w-48 justify-between font-normal hover:bg-blue-50 hover:border-blue-200 transition-colors"
          >
            {date ? date.toLocaleDateString() : "Filter by date"}
            <ChevronDownIcon className="h-4 w-4 text-gray-500" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto overflow-hidden p-0 shadow-xl border-0" align="start">
          <Calendar
            mode="single"
            selected={date}
            captionLayout="dropdown"
            onSelect={(d) => {
              setDate(d);
              setOpen(false);
              onChange?.(d);
            }}
            className="rounded-xl"
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
