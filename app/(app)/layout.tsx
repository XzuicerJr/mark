import ApplicationLayout from "@/components/layout/app";
import { ReactNode } from "react";

export default function AppLayout({ children }: { children: ReactNode }) {
  return <ApplicationLayout>{children}</ApplicationLayout>;
}
