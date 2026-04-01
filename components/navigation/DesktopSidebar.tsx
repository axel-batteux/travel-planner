"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Map, WalletCards, FolderOpen, Plane } from "lucide-react";

export function DesktopSidebar() {
  const pathname = usePathname();

  const navItems = [
    { name: "Accueil", href: "/", icon: Home },
    { name: "Itinéraire", href: "/itinerary", icon: Map },
    { name: "Budget", href: "/budget", icon: WalletCards },
    { name: "Documents", href: "/documents", icon: FolderOpen },
  ];

  return (
    <aside className="hidden md:flex flex-col w-64 h-screen fixed top-0 left-0 bg-card border-r border-border z-50 shadow-sm">
      <div className="p-6 flex items-center space-x-3">
        <div className="bg-primary/10 p-2 rounded-lg">
          <Plane className="text-primary" size={24} />
        </div>
        <h1 className="text-xl font-bold tracking-tight">TravelPlanner</h1>
      </div>
      <nav className="flex-1 px-4 py-8 space-y-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href || pathname?.startsWith(item.href + "/");
          const isReallyActive = item.href === "/" ? pathname === "/" : isActive;
          const Icon = item.icon;
          
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all ${
                isReallyActive
                  ? "bg-primary text-primary-foreground shadow-md shadow-primary/20"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
            >
              <Icon size={20} />
              <span className="font-medium">{item.name}</span>
            </Link>
          );
        })}
      </nav>
      <div className="p-6">
        { /* L'avatar utilisateur ira ici */ }
      </div>
    </aside>
  );
}
