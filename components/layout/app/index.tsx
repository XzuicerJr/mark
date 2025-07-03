import Header from "./header";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <section className="bg-muted flex h-dvh flex-col gap-4 p-4">
      <Header />
      <main className="bg-background w-full flex-1 rounded-lg border p-4">
        {children}
      </main>
    </section>
  );
}
