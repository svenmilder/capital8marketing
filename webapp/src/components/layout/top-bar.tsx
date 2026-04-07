"use client";

import { Bell, Search, LogOut } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { useState } from "react";

const audienceTabs = [
  { key: "sellers", label: "Sellers", color: "bg-c8-green" },
  { key: "buyers", label: "Buyers", color: "bg-c8-blue" },
  { key: "dealmakers", label: "Dealmakers", color: "bg-c8-yellow" },
] as const;

type Audience = (typeof audienceTabs)[number]["key"];

export function TopBar() {
  const [activeAudience, setActiveAudience] = useState<Audience>("sellers");

  return (
    <header className="h-14 bg-c8-elevated border-b border-c8-border-subtle flex items-center px-4 gap-4">
      {/* Logo */}
      <div className="flex items-center gap-2 shrink-0">
        <div className="h-7 w-7 rounded bg-c8-green flex items-center justify-center">
          <span className="text-c8-app font-bold text-xs">C8</span>
        </div>
        <span className="text-sm font-bold tracking-wide text-c8-text-primary hidden lg:block">
          COMMAND CENTER
        </span>
      </div>

      {/* Search */}
      <div className="flex-1 max-w-md mx-auto">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-c8-text-muted" />
          <Input
            placeholder="Search content, pages, keywords... (Cmd+K)"
            className="pl-9 h-9 bg-c8-surface border-c8-border-default text-sm text-c8-text-primary placeholder:text-c8-text-muted focus:border-c8-border-strong"
          />
        </div>
      </div>

      {/* Audience Tabs */}
      <div className="flex items-center gap-1 shrink-0">
        {audienceTabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveAudience(tab.key)}
            className={cn(
              "px-3 py-1 rounded-full text-xs font-semibold transition-colors",
              activeAudience === tab.key
                ? `${tab.color} text-c8-app`
                : "text-c8-text-secondary border border-c8-border-default hover:text-c8-text-primary"
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Notifications */}
      <button className="relative p-2 text-c8-text-secondary hover:text-c8-text-primary transition-colors">
        <Bell className="h-5 w-5" />
        <Badge className="absolute -top-0.5 -right-0.5 h-4 min-w-4 px-1 text-[10px] bg-c8-red text-white border-0 flex items-center justify-center">
          3
        </Badge>
      </button>

      {/* User Menu */}
      <DropdownMenu>
        <DropdownMenuTrigger className="flex items-center gap-2 text-c8-text-secondary hover:text-c8-text-primary transition-colors cursor-pointer">
          <Avatar className="h-8 w-8">
            <AvatarFallback className="bg-c8-surface text-c8-text-primary text-xs font-semibold">
              SM
            </AvatarFallback>
          </Avatar>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="end"
          className="bg-c8-elevated border-c8-border-default"
        >
          <DropdownMenuItem className="text-c8-text-secondary focus:text-c8-text-primary focus:bg-c8-hover">
            <LogOut className="h-4 w-4 mr-2" />
            Sign out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
}
