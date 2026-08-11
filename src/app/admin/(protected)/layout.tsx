import Link from "next/link";
import { Package, Tags, ClipboardList, Truck, LayoutGrid, Menu } from "lucide-react";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { redirect } from "next/navigation";
import { Logo } from "@/components/site/Logo";
import { Button } from "@/components/ui/button";
import { Sheet, SheetTrigger, SheetContent, SheetHeader, SheetTitle, SheetClose } from "@/components/ui/sheet";
import { LogoutButton } from "./LogoutButton";

const NAV = [
  { href: "/admin", label: "Panel", icon: LayoutGrid },
  { href: "/admin/productos", label: "Productos", icon: Package },
  { href: "/admin/categorias", label: "Categorías", icon: Tags },
  { href: "/admin/pedidos", label: "Pedidos", icon: ClipboardList },
  { href: "/admin/envio", label: "Envío", icon: Truck },
];

export default async function AdminProtectedLayout({ children }: { children: React.ReactNode }) {
  const authenticated = await isAdminAuthenticated();
  if (!authenticated) redirect("/admin/login");

  return (
    <div className="min-h-screen flex bg-muted/40">
      <aside className="hidden md:flex w-56 shrink-0 flex-col border-r border-border bg-background">
        <div className="h-16 flex items-center px-6 border-b border-border">
          <Logo className="h-6 w-auto" />
        </div>
        <nav className="flex-1 flex flex-col gap-0.5 p-3">
          {NAV.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
              >
                <Icon className="size-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="p-3 border-t border-border">
          <LogoutButton />
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        <header className="md:hidden h-14 flex items-center justify-between border-b border-border bg-background px-4">
          <Logo className="h-5 w-auto" />
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" aria-label="Abrir menú">
                <Menu className="size-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="p-0 w-64">
              <SheetHeader className="border-b border-border">
                <SheetTitle>ELEVÉ Admin</SheetTitle>
              </SheetHeader>
              <nav className="flex flex-col gap-0.5 p-3">
                {NAV.map((item) => {
                  const Icon = item.icon;
                  return (
                    <SheetClose asChild key={item.href}>
                      <Link
                        href={item.href}
                        className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                      >
                        <Icon className="size-4" />
                        {item.label}
                      </Link>
                    </SheetClose>
                  );
                })}
              </nav>
              <div className="p-3 border-t border-border">
                <LogoutButton />
              </div>
            </SheetContent>
          </Sheet>
        </header>

        <main className="flex-1 w-full max-w-6xl mx-auto px-4 sm:px-8 py-8">{children}</main>
      </div>
    </div>
  );
}
