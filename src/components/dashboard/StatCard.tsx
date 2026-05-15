import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { typography } from "@/lib/typography";

interface TrendData {
  value: number;
  isPositive: boolean;
}

interface StatCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon?: React.ReactNode;
  trend?: TrendData;
}

export function StatCard({
  title,
  value,
  description,
  icon,
  trend,
}: StatCardProps) {
  return (
    <Card className="transition-shadow duration-200 hover:shadow-lg">
      <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-4">
        <div>
          <p className={typography.body.sm}>{title}</p>
        </div>
        {icon && (
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100 text-blue-600">
            {icon}
          </div>
        )}
      </CardHeader>

      <CardContent className="space-y-2">
        <div className="flex items-baseline gap-2">
          <p className="text-3xl font-bold text-foreground">{value}</p>
          {trend && (
            <span
              className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                trend.isPositive
                  ? "bg-green-100 text-green-700"
                  : "bg-red-100 text-red-700"
              }`}
            >
              {trend.isPositive ? "+" : "-"}
              {Math.abs(trend.value)}%
            </span>
          )}
        </div>

        {description && (
          <p className={typography.body.muted}>{description}</p>
        )}
      </CardContent>
    </Card>
  );
}
