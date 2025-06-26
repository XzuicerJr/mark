import Header from "./header";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <section className="flex flex-col h-dvh p-4 bg-muted gap-4">
      <Header />
      <main className="w-full rounded-lg border p-4 bg-background flex-1">
        {children}
      </main>
    </section>
  );
}
