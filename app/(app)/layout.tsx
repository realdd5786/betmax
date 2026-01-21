import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="mx-auto flex max-w-6xl flex-col gap-8 px-4 py-8">{children}</main>
      <Footer />
    </div>
  );
}
