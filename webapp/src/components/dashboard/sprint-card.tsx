import { Target, Calendar, ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface SprintGoal {
  metric: string;
  target: number;
  current: number;
  unit: string;
}

// Placeholder data
const sprintData = {
  name: "Q2 Week 1 — Seller Awareness",
  phase: 4,
  phaseLabel: "Content",
  startDate: "Apr 7",
  endDate: "Apr 13",
  audience: "Sellers",
  goals: [
    { metric: "LinkedIn posts published", target: 4, current: 0, unit: "" },
    { metric: "ExitFit completions", target: 5, current: 2, unit: "" },
    { metric: "Newsletter subscribers", target: 10, current: 3, unit: "" },
    { metric: "Engagement rate", target: 3.5, current: 2.8, unit: "%" },
  ] as SprintGoal[],
};

function ProgressBar({ current, target }: { current: number; target: number }) {
  const pct = Math.min((current / target) * 100, 100);
  return (
    <div className="h-1.5 bg-c8-app rounded-full overflow-hidden">
      <div
        className="h-full bg-c8-green rounded-full transition-all"
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}

export function SprintCard() {
  return (
    <div className="bg-c8-surface border border-c8-border-subtle rounded-lg p-5">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xs font-semibold uppercase tracking-wider text-c8-text-secondary">
          Active Sprint
        </h2>
        <Badge
          variant="outline"
          className="border-c8-green text-c8-green text-[10px]"
        >
          ACTIVE
        </Badge>
      </div>

      <div className="space-y-3">
        <div>
          <p className="text-sm font-semibold text-c8-text-primary">
            {sprintData.name}
          </p>
          <div className="flex items-center gap-3 mt-1.5">
            <div className="flex items-center gap-1 text-c8-text-muted">
              <Calendar className="h-3 w-3" />
              <span className="text-[10px]">
                {sprintData.startDate} – {sprintData.endDate}
              </span>
            </div>
            <div className="flex items-center gap-1 text-c8-text-muted">
              <Target className="h-3 w-3" />
              <span className="text-[10px]">
                Phase {sprintData.phase}: {sprintData.phaseLabel}
              </span>
            </div>
          </div>
        </div>

        <div className="space-y-2.5 mt-4">
          {sprintData.goals.map((goal) => (
            <div key={goal.metric}>
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs text-c8-text-secondary">
                  {goal.metric}
                </span>
                <span className="text-xs text-c8-text-primary font-medium">
                  {goal.current}
                  {goal.unit} / {goal.target}
                  {goal.unit}
                </span>
              </div>
              <ProgressBar current={goal.current} target={goal.target} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
