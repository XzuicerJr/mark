"use client";

import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { Switch } from "@/components/ui/switch";
import { Laptop, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

export function ThemeSwitcher() {
  const { setTheme, theme } = useTheme();

  return (
    <DropdownMenuItem
      onSelect={(e) => {
        e.preventDefault();
        setTheme(theme === "dark" ? "light" : "dark");
      }}
    >
      Theme
      <div className="ml-auto flex flex-row items-center gap-1 [&>svg]:size-4 [&>svg]:shrink-0">
        <Sun />
        <Switch size="small" checked={theme === "dark" || theme === "system"} />
        {theme === "system" ? <Laptop /> : <Moon />}
      </div>
    </DropdownMenuItem>
  );
}
