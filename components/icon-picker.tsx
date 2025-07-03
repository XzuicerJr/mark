"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerDescription,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { icons as lucideIcons } from "lucide-react";

interface IconPickerProps {
  selectedIcon: string;
  onIconSelect: (iconName: string) => void;
}

function IconPicker({ selectedIcon, onIconSelect }: IconPickerProps) {
  const [searchTerm, setSearchTerm] = useState("");

  // Filter icons based on search term
  const filteredIcons = Object.keys(lucideIcons).filter((iconName) =>
    iconName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex flex-col gap-4 mt-4">
      <Input
        placeholder="Search for an icon..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      <section className="max-h-[50dvh] p-2 border rounded-md overflow-y-auto">
        <div className="grid grid-cols-[repeat(auto-fill,minmax(2rem,1fr))] gap-5">
          {filteredIcons.map((iconName) => {
            const IconComponent =
              lucideIcons[iconName as keyof typeof lucideIcons];
            const isSelected = selectedIcon === iconName;

            return (
              <Button
                key={iconName}
                variant="outline"
                size="icon"
                onClick={() => onIconSelect(iconName)}
                className={cn(
                  "p-2 rounded-md border transition-colors flex items-center justify-center",
                  isSelected
                    ? "border-gray-400"
                    : "border-border hover:border-gray-300"
                )}
                title={iconName}
              >
                <IconComponent className="size-6" />
              </Button>
            );
          })}
        </div>
        {filteredIcons.length === 0 && (
          <div className="text-center text-gray-500 py-4">
            No icons found matching "{searchTerm}"
          </div>
        )}
      </section>
    </div>
  );
}

export default function IconPickerDrawer({
  selectedIcon,
  onIconSelect,
}: IconPickerProps) {
  return (
    <Drawer modal>
      <DrawerTrigger asChild>
        <Button variant="outline" size="icon" className="rounded-full p-6">
          {(() => {
            const IconComponent =
              lucideIcons[selectedIcon as keyof typeof lucideIcons];
            return IconComponent ? <IconComponent className="size-6" /> : null;
          })()}
        </Button>
      </DrawerTrigger>
      <DrawerContent className="px-4">
        <section className="max-w-lg mx-auto w-full">
          <DrawerHeader className="sr-only">
            <DrawerTitle>Select an icon</DrawerTitle>
            <DrawerDescription>
              Select an icon to use for your habit.
            </DrawerDescription>
          </DrawerHeader>
          <IconPicker selectedIcon={selectedIcon} onIconSelect={onIconSelect} />
        </section>
      </DrawerContent>
    </Drawer>
  );
}
