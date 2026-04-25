"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Map, WalletCards, FolderOpen, CheckSquare } from "lucide-react";

export function MobileNav() {
  const pathname = usePathname();

  const navItems = [
    { name: "Accueil", href: "/", icon: Home },
    { name: "Itinéraire", href: "/itinerary", icon: Map },
    { name: "Budget", href: "/budget", icon: WalletCards },
    { name: "Checklists", href: "/checklists", icon: CheckSquare },
    { name: "Docs", href: "/documents", icon: FolderOpen },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-card border-t border-border z-50">
      <ul className="flex justify-around items-center h-16">
        {navItems.map((item) => {
          const isActive = pathname === item.href || pathname?.startsWith(item.href + "/");
          // Exceptions for precise matching for home
          const isReallyActive = item.href === "/" ? pathname === "/" : isActive;
          const Icon = item.icon;
          
          return (
            <li key={item.name} className="flex-1">
              <Link
                href={item.href}
                prefetch={true}
                className={`flex flex-col items-center justify-center w-full h-full space-y-1 transition-colors ${
                  isReallyActive ? "text-primary" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <Icon size={24} className={isReallyActive ? "text-primary" : ""} />
                <span className="text-[10px] font-medium">{item.name}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
