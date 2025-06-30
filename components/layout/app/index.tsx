import Header from "./header";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <section className="flex flex-col h-dvh py-2 md:py-4 px-0 md:px-4 bg-muted gap-4">
      <Header />
      <main className="w-full rounded-lg border p-2 md:p-4 bg-background flex-1">
        {children}
      </main>
    </section>
  );
}
