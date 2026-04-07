"use client";

import { Check, X, Eye, FileText, Mail, PenTool } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface QueueItem {
  id: string;
  title: string;
  type: "linkedin_post" | "email" | "blog" | "programmatic_page";
  audience: string;
  voiceMode: string;
  createdAt: string;
}

const typeIcons = {
  linkedin_post: PenTool,
  email: Mail,
  blog: FileText,
  programmatic_page: FileText,
};

const typeLabels = {
  linkedin_post: "LinkedIn",
  email: "Email",
  blog: "Blog",
  programmatic_page: "Page",
};

const voiceColors: Record<string, string> = {
  ADVISOR: "border-c8-blue text-c8-blue",
  PEER: "border-c8-green text-c8-green",
  SALES: "border-c8-orange text-c8-orange",
  BRAND: "border-c8-purple text-c8-purple",
};

// Placeholder data — will be replaced with Supabase query
const placeholderItems: QueueItem[] = [
  {
    id: "1",
    title: "Manufacturing exits are underpriced in APAC",
    type: "linkedin_post",
    audience: "seller",
    voiceMode: "ADVISOR",
    createdAt: "2h ago",
  },
  {
    id: "2",
    title: "Post-diagnostic nurture #3",
    type: "email",
    audience: "seller",
    voiceMode: "ADVISOR",
    createdAt: "5h ago",
  },
  {
    id: "3",
    title: "Exit Planning: SaaS / Singapore",
    type: "programmatic_page",
    audience: "seller",
    voiceMode: "PEER",
    createdAt: "1d ago",
  },
];

export function ApprovalQueue() {
  const items = placeholderItems;

  if (items.length === 0) {
    return (
      <div className="bg-c8-surface border border-c8-border-subtle rounded-lg p-5">
        <h2 className="text-xs font-semibold uppercase tracking-wider text-c8-text-secondary mb-3">
          Approval Queue
        </h2>
        <p className="text-sm text-c8-text-muted">
          Nothing awaiting approval. The system is caught up.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-c8-surface border border-c8-border-subtle rounded-lg p-5">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xs font-semibold uppercase tracking-wider text-c8-text-secondary">
          Approval Queue
        </h2>
        <Badge
          variant="outline"
          className="border-c8-orange text-c8-orange text-[10px]"
        >
          {items.length} pending
        </Badge>
      </div>

      <div className="space-y-3">
        {items.map((item) => {
          const Icon = typeIcons[item.type];
          return (
            <div
              key={item.id}
              className="flex items-center gap-3 p-3 rounded-md bg-c8-app hover:bg-c8-hover transition-colors"
            >
              <Icon className="h-4 w-4 text-c8-text-muted shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-sm text-c8-text-primary truncate">
                  {item.title}
                </p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-[10px] text-c8-text-muted uppercase">
                    {typeLabels[item.type]}
                  </span>
                  <Badge
                    variant="outline"
                    className={`text-[10px] px-1.5 py-0 ${voiceColors[item.voiceMode] || ""}`}
                  >
                    {item.voiceMode}
                  </Badge>
                  <span className="text-[10px] text-c8-text-muted">
                    {item.createdAt}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-1 shrink-0">
                <Button
                  size="icon"
                  variant="ghost"
                  className="h-7 w-7 text-c8-text-muted hover:text-c8-text-primary hover:bg-c8-hover"
                >
                  <Eye className="h-3.5 w-3.5" />
                </Button>
                <Button
                  size="icon"
                  variant="ghost"
                  className="h-7 w-7 text-c8-text-muted hover:text-c8-green hover:bg-c8-hover"
                >
                  <Check className="h-3.5 w-3.5" />
                </Button>
                <Button
                  size="icon"
                  variant="ghost"
                  className="h-7 w-7 text-c8-text-muted hover:text-c8-red hover:bg-c8-hover"
                >
                  <X className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
