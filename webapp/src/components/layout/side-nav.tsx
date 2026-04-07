"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  PenTool,
  Search,
  FileText,
  Settings,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/content", label: "Content", icon: PenTool },
  { href: "/seo", label: "SEO", icon: Search },
  { href: "/pages", label: "Webpages", icon: FileText },
];

const bottomItems = [
  { href: "/settings", label: "Settings", icon: Settings },
];

export function SideNav() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  const isActive = (href: string) => {
    if (href === "/dashboard") return pathname === "/dashboard";
    return pathname.startsWith(href);
  };

  const NavLink = ({
    item,
  }: {
    item: { href: string; label: string; icon: React.ComponentType<{ className?: string }> };
  }) => {
    const active = isActive(item.href);
    const Icon = item.icon;

    const linkContent = (
      <Link
        href={item.href}
        className={cn(
          "flex items-center gap-3 px-4 py-2.5 text-sm transition-colors relative",
          active
            ? "text-c8-green bg-c8-active"
            : "text-c8-text-secondary hover:text-c8-text-primary"
        )}
      >
        {active && (
          <span className="absolute left-0 top-1 bottom-1 w-[3px] rounded-r bg-c8-green" />
        )}
        <Icon className="h-5 w-5 shrink-0" />
        {!collapsed && <span>{item.label}</span>}
      </Link>
    );

    if (collapsed) {
      return (
        <Tooltip>
          <TooltipTrigger render={<span />}>
            {linkContent}
          </TooltipTrigger>
          <TooltipContent side="right" className="bg-c8-elevated text-c8-text-primary border-c8-border-default">
            {item.label}
          </TooltipContent>
        </Tooltip>
      );
    }

    return linkContent;
  };

  return (
    <aside
      className={cn(
        "flex flex-col h-full bg-c8-app border-r border-c8-border-subtle transition-all duration-200",
        collapsed ? "w-14" : "w-[180px]"
      )}
    >
      <nav className="flex-1 flex flex-col pt-4 gap-1">
        {navItems.map((item) => (
          <NavLink key={item.href} item={item} />
        ))}
      </nav>

      <div className="border-t border-c8-border-subtle">
        {bottomItems.map((item) => (
          <NavLink key={item.href} item={item} />
        ))}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="flex items-center justify-center w-full py-2 text-c8-text-muted hover:text-c8-text-secondary transition-colors"
        >
          {collapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <ChevronLeft className="h-4 w-4" />
          )}
        </button>
      </div>
    </aside>
  );
}
