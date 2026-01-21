\"use client\";

import Link from \"next/link\";
import { signOut } from \"next-auth/react\";

const links = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/credits", label: "Créditos" },
  { href: "/analysis", label: "Análise" },
  { href: "/settings", label: "Configurações" }
];

export function Navbar() {
  return (
    <nav className="sticky top-0 z-40 border-b bg-card/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link href="/dashboard" className="flex items-center gap-2 text-lg font-semibold">
          <span className="text-primary">Fut</span>
          <span className="text-secondary">Max</span>
        </Link>
        <div className="hidden items-center gap-4 md:flex">
          {links.map((link) => (
            <Link key={link.href} href={link.href} className="text-sm font-medium text-foreground">
              {link.label}
            </Link>
          ))}
        </div>
        <button
          onClick={() => signOut({ callbackUrl: "/auth/login" })}
          className="text-sm font-semibold text-primary"
        >
          Sair
        </button>
      </div>
    </nav>
  );
}
