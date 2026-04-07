"use client";

import {
  PenTool,
  Search,
  Mail,
  Database,
  AlertCircle,
  Settings,
} from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

interface ActivityEntry {
  id: string;
  category: "content" | "seo" | "email" | "data" | "system" | "error";
  action: string;
  timestamp: string;
  source: string;
}

const categoryConfig = {
  content: { icon: PenTool, color: "text-c8-blue" },
  seo: { icon: Search, color: "text-c8-green" },
  email: { icon: Mail, color: "text-c8-purple" },
  data: { icon: Database, color: "text-c8-cyan" },
  system: { icon: Settings, color: "text-c8-yellow" },
  error: { icon: AlertCircle, color: "text-c8-red" },
};

// Placeholder data
const placeholderEntries: ActivityEntry[] = [
  {
    id: "1",
    category: "content",
    action: "Generated 4 LinkedIn posts for week of Apr 7",
    timestamp: "6:02 AM",
    source: "inngest",
  },
  {
    id: "2",
    category: "seo",
    action: "GSC data synced — 3 new keywords ranking",
    timestamp: "5:45 AM",
    source: "inngest",
  },
  {
    id: "3",
    category: "data",
    action: "2 new ExitFit completions overnight",
    timestamp: "5:30 AM",
    source: "inngest",
  },
  {
    id: "4",
    category: "email",
    action: "Sent nurture #2 to 8 contacts",
    timestamp: "5:15 AM",
    source: "inngest",
  },
  {
    id: "5",
    category: "system",
    action: "Weekly SEO recommendations generated",
    timestamp: "5:00 AM",
    source: "inngest",
  },
  {
    id: "6",
    category: "content",
    action: "Compliance sweep complete — 0 violations",
    timestamp: "4:30 AM",
    source: "inngest",
  },
];

export function ActivityFeed() {
  const entries = placeholderEntries;

  return (
    <div className="bg-c8-surface border border-c8-border-subtle rounded-lg p-5">
      <h2 className="text-xs font-semibold uppercase tracking-wider text-c8-text-secondary mb-4">
        Activity Feed
      </h2>

      <ScrollArea className="h-[300px]">
        <div className="space-y-3">
          {entries.map((entry) => {
            const config = categoryConfig[entry.category];
            const Icon = config.icon;
            return (
              <div key={entry.id} className="flex items-start gap-3">
                <Icon
                  className={cn("h-4 w-4 mt-0.5 shrink-0", config.color)}
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-c8-text-primary">
                    {entry.action}
                  </p>
                  <p className="text-[10px] text-c8-text-muted mt-0.5">
                    {entry.timestamp} via {entry.source}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </ScrollArea>
    </div>
  );
}
