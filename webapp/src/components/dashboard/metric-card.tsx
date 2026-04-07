import { type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface MetricCardProps {
  icon: LucideIcon;
  label: string;
  value: string | number;
  sublabel?: string;
  trend?: { value: number; label: string };
  iconColor?: string;
}

export function MetricCard({
  icon: Icon,
  label,
  value,
  sublabel,
  trend,
  iconColor = "text-c8-green",
}: MetricCardProps) {
  return (
    <div className="bg-c8-surface border border-c8-border-subtle rounded-lg p-5">
      <Icon className={cn("h-5 w-5 mb-3", iconColor)} />
      <p className="text-xs font-medium uppercase tracking-wider text-c8-text-secondary">
        {label}
      </p>
      <p className="text-[28px] font-bold text-c8-text-primary mt-1">
        {value}
      </p>
      {sublabel && (
        <p className="text-xs uppercase tracking-wider text-c8-text-secondary mt-1">
          {sublabel}
        </p>
      )}
      {trend && (
        <p
          className={cn(
            "text-xs mt-2 font-medium",
            trend.value >= 0 ? "text-c8-green" : "text-c8-red"
          )}
        >
          {trend.value >= 0 ? "+" : ""}
          {trend.value}% {trend.label}
        </p>
      )}
    </div>
  );
}
