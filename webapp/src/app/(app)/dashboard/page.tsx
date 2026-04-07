import {
  Users,
  Target,
  TrendingUp,
  UserPlus,
  UserMinus,
  Eye,
  BarChart3,
  MousePointerClick,
} from "lucide-react";
import { MetricCard } from "@/components/dashboard/metric-card";
import { ApprovalQueue } from "@/components/dashboard/approval-queue";
import { ActivityFeed } from "@/components/dashboard/activity-feed";
import { SprintCard } from "@/components/dashboard/sprint-card";
import { ContentPipeline } from "@/components/dashboard/content-pipeline";

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-display text-c8-text-primary">Good morning</h1>
        <p className="text-sm text-c8-text-secondary mt-1">
          Monday, April 7 2026
        </p>
      </div>

      {/* Approval Queue — full width */}
      <ApprovalQueue />

      {/* Metric Cards — 4 columns */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        <MetricCard
          icon={Target}
          label="ExitFit Completions"
          value={12}
          sublabel="This month"
          trend={{ value: 23, label: "vs last month" }}
          iconColor="text-c8-green"
        />
        <MetricCard
          icon={UserPlus}
          label="Newsletter Subscribers"
          value={847}
          sublabel="Active subscribers"
          trend={{ value: 8, label: "vs last month" }}
          iconColor="text-c8-blue"
        />
        <MetricCard
          icon={Eye}
          label="LinkedIn Impressions"
          value="12.4K"
          sublabel="Last 30 days"
          trend={{ value: 15, label: "vs prior period" }}
          iconColor="text-c8-purple"
        />
        <MetricCard
          icon={BarChart3}
          label="Engagement Rate"
          value="3.2%"
          sublabel="LinkedIn average"
          trend={{ value: -2, label: "vs last month" }}
          iconColor="text-c8-yellow"
        />
      </div>

      {/* Second row: 4 more metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        <MetricCard
          icon={Users}
          label="Active Sprints"
          value={2}
          sublabel="Sprint & mandate"
          iconColor="text-c8-orange"
        />
        <MetricCard
          icon={UserMinus}
          label="Churns"
          value={3}
          sublabel="Unsubscribes this month"
          iconColor="text-c8-red"
        />
        <MetricCard
          icon={TrendingUp}
          label="Follower Growth"
          value="+142"
          sublabel="LinkedIn this month"
          trend={{ value: 34, label: "vs last month" }}
          iconColor="text-c8-cyan"
        />
        <MetricCard
          icon={MousePointerClick}
          label="Website Visits"
          value="2.1K"
          sublabel="This month from content"
          trend={{ value: 11, label: "vs last month" }}
          iconColor="text-c8-lime"
        />
      </div>

      {/* Sprint + Activity Feed — 2 columns */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <SprintCard />
        <ActivityFeed />
      </div>

      {/* Content Pipeline — full width */}
      <ContentPipeline />
    </div>
  );
}
