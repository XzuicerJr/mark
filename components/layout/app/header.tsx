"use client";

import { Logo } from "@/components/icons";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { NavUser } from "./nav-user";

export default function Header() {
  const { data: session } = useSession();

  return (
    <header className="flex min-h-9 w-full items-center justify-between px-2 sm:p-0">
      <Link
        href="/"
        className="focus-visible:border-ring focus-visible:ring-ring/50 flex h-9 items-center gap-2 rounded-md px-3 py-2 font-medium transition-all duration-200 outline-none focus-visible:ring-[3px]"
      >
        <Logo />
        {process.env.NEXT_PUBLIC_APP_NAME}
      </Link>
      {session?.user && (
        <NavUser
          user={{
            name: session.user?.name ?? "",
            email: session.user?.email ?? "",
            avatar: session.user?.image ?? undefined,
          }}
        />
      )}
    </header>
  );
}
