import React, { useState } from "react";
import { Clock } from "lucide-react";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from "@/components/ui/drawer";

const OPTIONS = [1, 2, 3, 4, 6, 8];

export default function DurationPicker({ value, onChange, options = OPTIONS }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="w-full pl-9 pr-3 py-2.5 text-sm bg-muted border border-border rounded-lg focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-left relative"
      >
        <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
        {value}h
      </button>
      <Drawer open={open} onOpenChange={setOpen}>
        <DrawerContent className="safe-bottom">
          <DrawerHeader>
            <DrawerTitle>Select duration</DrawerTitle>
          </DrawerHeader>
          <div className="px-4 pb-6 space-y-1.5">
            {options.map((h) => (
              <button
                key={h}
                onClick={() => {
                  onChange(h);
                  setOpen(false);
                }}
                className={`w-full text-left px-4 py-3 rounded-lg text-sm font-semibold border transition ${
                  h === value
                    ? "bg-primary text-white border-primary"
                    : "bg-card text-foreground border-border hover:border-primary"
                }`}
              >
                {h} hour{h > 1 ? "s" : ""}
              </button>
            ))}
          </div>
        </DrawerContent>
      </Drawer>
    </>
  );
}