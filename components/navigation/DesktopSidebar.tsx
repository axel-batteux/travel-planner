"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Map, WalletCards, FolderOpen, Plane, CheckSquare, Sparkles, BookOpen } from "lucide-react";

export function DesktopSidebar() {
  const pathname = usePathname();

  const navItems = [
    { name: "Accueil", href: "/", icon: Home },
    { name: "Itinéraire", href: "/itinerary", icon: Map },
    { name: "Checklists", href: "/checklists", icon: CheckSquare },
    { name: "Bucketlist", href: "/bucketlist", icon: Sparkles },
    { name: "Carnet", href: "/notes", icon: BookOpen },
    { name: "Budget", href: "/budget", icon: WalletCards },
    { name: "Documents", href: "/documents", icon: FolderOpen },
  ];

  return (
    <aside className="hidden md:flex flex-col w-72 h-screen fixed top-0 left-0 bg-card border-r border-border z-50">
      <div className="p-8 pb-10 flex items-center space-x-3">
        <div className="bg-primary/10 p-2.5 rounded-xl">
          <Plane className="text-primary" size={28} />
        </div>
        <h1 className="text-2xl font-black tracking-tighter">Travel<span className="text-primary font-black">.</span></h1>
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
              prefetch={true}
              className={`flex items-center space-x-4 px-6 py-4 rounded-[1.25rem] transition-all hover:translate-x-1 ${
                isReallyActive
                  ? "bg-primary text-primary-foreground shadow-lg shadow-primary/25 font-bold"
                  : "text-muted-foreground hover:bg-muted/80 hover:text-foreground font-medium"
              }`}
            >
              <Icon size={22} strokeWidth={isReallyActive ? 2.5 : 2} />
              <span className="tracking-tight">{item.name}</span>
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
