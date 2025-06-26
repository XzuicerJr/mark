"use client";

import { ChevronDown, LogOut } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { signOut } from "next-auth/react";
import Image from "next/image";

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
          <span className="truncate font-medium">{user.name}</span>
          <div className="h-8 w-8 rounded-lg bg-muted overflow-hidden">
            {user.avatar ? (
              <>
                <Image
                  src={user.avatar}
                  alt={user.name}
                  width={32}
                  height={32}
                />
                <span className="sr-only">{user.name.charAt(0)}</span>
              </>
            ) : (
              <span>{user.name.charAt(0)}</span>
            )}
          </div>
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
            <div className="h-8 w-8 rounded-lg bg-muted border border-border overflow-hidden">
              {user.avatar ? (
                <>
                  <Image
                    src={user.avatar}
                    alt={user.name}
                    width={32}
                    height={32}
                  />
                  <span className="sr-only">{user.name.charAt(0)}</span>
                </>
              ) : (
                <span>{user.name.charAt(0)}</span>
              )}
            </div>
            <div className="grid flex-1 text-left text-sm leading-tight">
              <span className="truncate font-medium">{user.name}</span>
              <span className="truncate text-xs">{user.email}</span>
            </div>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => signOut()}>
          <LogOut />
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
