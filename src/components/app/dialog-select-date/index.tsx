"use client";
import { useState } from "react";
import { format } from "date-fns";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";

export interface SelectDateProps {
  isOpened: boolean;
  setOpened: Function;
  setSelectedDate: Function;
}

export function DialogSelectDate({
  isOpened,
  setOpened,
  setSelectedDate,
}: SelectDateProps) {
  const [date, setDate] = useState<Date | null>(new Date());

  return (
    <Dialog open={isOpened} onOpenChange={setOpened}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Which date?</DialogTitle>
          <DialogDescription>
            <div className="flex flex-col items-center space-y-6">
              <Calendar
                mode="single"
                selected={date}
                onSelect={(date: Date) => setDate(date || new Date())}
                className="rounded-md border shadow"
              />
              <Button
                type="button"
                onClick={() => {
                  setSelectedDate(format(date, "dd/MM/yyyy"));
                  setOpened(false);
                }}
              >
                Select this date {format(date, "(dd/MM/yyyy)")}
              </Button>
            </div>
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
