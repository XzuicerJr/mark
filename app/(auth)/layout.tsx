import { Logo } from "@/components/icons";
import { ClientOnly } from "@/components/ui/client-only";
import Link from "next/link";
import { Suspense } from "react";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="bg-muted relative flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
      <ClientOnly className="z-10 flex w-full max-w-sm flex-col gap-6">
        <Link
          href="/"
          className="flex items-center gap-2 self-center font-medium"
        >
          <Logo />
          {process.env.NEXT_PUBLIC_APP_NAME}
        </Link>
        <Suspense>{children}</Suspense>
      </ClientOnly>
    </main>
  );
}
