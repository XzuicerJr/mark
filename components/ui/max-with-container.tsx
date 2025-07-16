import { cn } from "@/lib/utils";

export function MaxWithContainer({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section className={cn("mx-auto max-w-7xl md:px-4", className)}>
      {children}
    </section>
  );
}
