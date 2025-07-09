"use client";

import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { icons as lucideIcons } from "lucide-react";
import { useState } from "react";

interface IconPickerProps {
  selectedIcon: string;
  onIconSelect: (iconName: string) => void;
}

function IconPicker({ selectedIcon, onIconSelect }: IconPickerProps) {
  const [searchTerm, setSearchTerm] = useState("");

  // Filter icons based on search term
  const filteredIcons = Object.keys(lucideIcons).filter((iconName) =>
    iconName.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="mt-4 flex flex-col gap-4">
      <Input
        className="max-w-full"
        placeholder="Search for an icon..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      <section className="max-h-[50dvh] overflow-y-auto rounded-md border p-2">
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
                  "flex items-center justify-center rounded-md border p-2 transition-colors",
                  isSelected
                    ? "border-gray-400"
                    : "border-border hover:border-gray-300",
                )}
                title={iconName}
              >
                <IconComponent className="size-6" />
              </Button>
            );
          })}
        </div>
        {filteredIcons.length === 0 && (
          <div className="py-4 text-center text-gray-500">
            No icons found matching &quot;{searchTerm}&quot;
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
        <section className="mx-auto w-full max-w-lg">
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
