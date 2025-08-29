import { type LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

interface StatCardProps {
  title: string;
  value: number;
  icon: LucideIcon;
  prefix?: string;
}

export function StatCard({ title, value, icon: Icon, prefix }: StatCardProps) {
  let formattedValue: string;

  if (typeof value === "number") {
    if (value >= 1_000_000) {
      formattedValue = new Intl.NumberFormat("en-US", {
        notation: "compact",
        compactDisplay: "short",
        maximumFractionDigits: 2,
      }).format(value);
    } else {
      formattedValue = new Intl.NumberFormat("en-US").format(value);
    }
  } else {
    formattedValue = value;
  }

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          {/* Text */}
          <div className="flex flex-col justify-center">
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <div className="flex items-center gap-1">
              <p className="text-3xl font-bold text-card-foreground truncate max-w-[12ch]">
                {prefix}
                {formattedValue}
              </p>
            </div>
          </div>

          {/* Icon */}
          <div className="flex items-center justify-center h-12 w-12 rounded-full bg-primary/10">
            <Icon className="h-6 w-6 text-primary" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function StatCardSkeleton() {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-8 w-32" />
          </div>
          <Skeleton className="h-12 w-12 rounded-full" />
        </div>
      </CardContent>
    </Card>
  );
}
