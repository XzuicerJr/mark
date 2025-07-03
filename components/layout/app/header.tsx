"use client";

import { Logo } from "@/components/icons";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { NavUser } from "./nav-user";

export default function Header() {
  const { data: session } = useSession();

  return (
    <header className="flex h-9 w-full items-center justify-between px-4">
      <Link href="/" className="flex items-center gap-2 font-medium">
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
