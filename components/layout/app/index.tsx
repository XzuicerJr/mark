import Header from "./header";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <section className="bg-muted flex h-dvh flex-col gap-4 px-0 py-2 md:px-4 md:py-4">
      <Header />
      <main className="bg-background w-full flex-1 rounded-lg border p-2 md:p-4">
        {children}
      </main>
    </section>
  );
}
