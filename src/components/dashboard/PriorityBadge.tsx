import { cn } from "@/lib/utils";

type PriorityLevel = "critical" | "high" | "medium" | "low";

interface PriorityBadgeProps {
  priority: PriorityLevel;
}

const priorityConfig: Record<
  PriorityLevel,
  {
    label: string;
    bgVar: string;
    textVar: string;
    showPulse: boolean;
  }
> = {
  critical: {
    label: "Kritis",
    bgVar: "var(--priority-critical)",
    textVar: "var(--priority-critical-foreground)",
    showPulse: true,
  },
  high: {
    label: "Tinggi",
    bgVar: "var(--priority-high)",
    textVar: "var(--priority-high-foreground)",
    showPulse: false,
  },
  medium: {
    label: "Sedang",
    bgVar: "var(--priority-medium)",
    textVar: "var(--priority-medium-foreground)",
    showPulse: false,
  },
  low: {
    label: "Rendah",
    bgVar: "var(--priority-low)",
    textVar: "var(--priority-low-foreground)",
    showPulse: false,
  },
};

export function PriorityBadge({ priority }: PriorityBadgeProps) {
  const config = priorityConfig[priority];

  // Convert HSL variables to proper color values
  const bgColor = `hsl(${config.bgVar})`;
  const textColor = `hsl(${config.textVar})`;

  return (
    <div
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium",
        "transition-colors duration-200"
      )}
      style={{
        backgroundColor: bgColor,
        color: textColor,
      }}
    >
      {config.showPulse && (
        <span
          className="inline-block h-2 w-2 rounded-full animate-pulse"
          style={{ backgroundColor: textColor }}
        />
      )}
      <span>{config.label}</span>
    </div>
  );
}
