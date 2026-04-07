"use client";

import { Badge } from "@/components/ui/badge";

interface ContentRow {
  id: string;
  title: string;
  type: string;
  audience: string;
  voiceMode: string;
  status: string;
  updatedAt: string;
}

const statusColors: Record<string, string> = {
  draft: "bg-c8-blue/20 text-c8-blue",
  review: "bg-c8-yellow/20 text-c8-yellow",
  approved: "bg-c8-green/20 text-c8-green",
  scheduled: "bg-c8-purple/20 text-c8-purple",
  published: "bg-c8-cyan/20 text-c8-cyan",
  rejected: "bg-c8-red/20 text-c8-red",
};

// Placeholder data
const placeholderContent: ContentRow[] = [
  {
    id: "1",
    title: "Why SaaS founders in Singapore undervalue their exits",
    type: "LinkedIn",
    audience: "Seller",
    voiceMode: "ADVISOR",
    status: "review",
    updatedAt: "2h ago",
  },
  {
    id: "2",
    title: "Post-diagnostic nurture #3: The hidden cost of waiting",
    type: "Email",
    audience: "Seller",
    voiceMode: "ADVISOR",
    status: "approved",
    updatedAt: "5h ago",
  },
  {
    id: "3",
    title: "Three valuation mistakes that cost founders millions",
    type: "LinkedIn",
    audience: "Seller",
    voiceMode: "PEER",
    status: "draft",
    updatedAt: "1d ago",
  },
  {
    id: "4",
    title: "Exit Planning: Professional Services / Malaysia",
    type: "Page",
    audience: "Seller",
    voiceMode: "BRAND",
    status: "published",
    updatedAt: "2d ago",
  },
];

export function ContentPipeline() {
  return (
    <div className="bg-c8-surface border border-c8-border-subtle rounded-lg p-5">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xs font-semibold uppercase tracking-wider text-c8-text-secondary">
          Content Pipeline
        </h2>
        <span className="text-xs text-c8-text-muted">
          {placeholderContent.length} items
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="text-left">
              <th className="pb-3 text-[11px] font-semibold uppercase tracking-wider text-c8-text-secondary">
                Title
              </th>
              <th className="pb-3 text-[11px] font-semibold uppercase tracking-wider text-c8-text-secondary">
                Type
              </th>
              <th className="pb-3 text-[11px] font-semibold uppercase tracking-wider text-c8-text-secondary">
                Audience
              </th>
              <th className="pb-3 text-[11px] font-semibold uppercase tracking-wider text-c8-text-secondary">
                Status
              </th>
              <th className="pb-3 text-[11px] font-semibold uppercase tracking-wider text-c8-text-secondary">
                Updated
              </th>
            </tr>
          </thead>
          <tbody>
            {placeholderContent.map((item) => (
              <tr
                key={item.id}
                className="border-t border-c8-border-subtle hover:bg-c8-hover transition-colors cursor-pointer"
              >
                <td className="py-3 pr-4">
                  <span className="text-sm text-c8-text-primary">
                    {item.title}
                  </span>
                </td>
                <td className="py-3 pr-4">
                  <span className="text-xs text-c8-text-secondary">
                    {item.type}
                  </span>
                </td>
                <td className="py-3 pr-4">
                  <span className="text-xs text-c8-text-secondary">
                    {item.audience}
                  </span>
                </td>
                <td className="py-3 pr-4">
                  <Badge
                    className={`text-[10px] font-medium uppercase border-0 ${statusColors[item.status] || ""}`}
                  >
                    {item.status}
                  </Badge>
                </td>
                <td className="py-3">
                  <span className="text-xs text-c8-text-muted">
                    {item.updatedAt}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
