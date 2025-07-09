import ApplicationLayout from "@/components/layout/app";
import { ThemeProvider } from "next-themes";
import { ReactNode } from "react";

export default function AppLayout({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="light">
      <ApplicationLayout>{children}</ApplicationLayout>
    </ThemeProvider>
  );
}
