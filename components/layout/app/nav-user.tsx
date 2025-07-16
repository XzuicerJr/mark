"use client";

import { ChevronDown, LogOut, Settings } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { signOut } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { ThemeSwitcher } from "./theme-switcher";

export function NavUser({
  user,
}: {
  user: {
    name: string;
    email: string;
    avatar?: string;
  };
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="hover:bg-accent-foreground/10">
          <span className="hidden truncate font-medium sm:block">
            {user.name}
          </span>
          {user.avatar ? (
            <div className="bg-muted flex h-8 w-8 items-center justify-center overflow-hidden rounded-lg">
              <Image src={user.avatar} alt={user.name} width={32} height={32} />
              <span className="sr-only">{user.name.charAt(0)}</span>
            </div>
          ) : null}
          <ChevronDown className="ml-auto size-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
        side="bottom"
        align="end"
        sideOffset={4}
      >
        <DropdownMenuLabel className="p-0 font-normal">
          <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
            {user.avatar ? (
              <div className="bg-muted flex h-8 w-8 items-center justify-center overflow-hidden rounded-lg border">
                <Image
                  src={user.avatar}
                  alt={user.name}
                  width={32}
                  height={32}
                />
                <span className="sr-only">{user.name.charAt(0)}</span>
              </div>
            ) : null}
            <div className="grid flex-1 text-left text-sm leading-tight">
              <span className="truncate font-medium">{user.name}</span>
              <span className="truncate text-xs">{user.email}</span>
            </div>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <ThemeSwitcher />
        <DropdownMenuItem asChild>
          <Link href="/settings">
            <Settings />
            Settings
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => signOut()}>
          <LogOut />
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
