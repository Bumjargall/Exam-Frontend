import { ReactNode } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

type StatCardProps = {
  title: string;
  count: number;
  isLoading?: boolean;
  gradient?: string;
  icon?: ReactNode;
};

export default function StatCard({
  title,
  count,
  isLoading = false,
  gradient = "bg-gradient-to-r from-blue-400 to-blue-600",
  icon,
}: StatCardProps) {
  return (
    <Card className="overflow-hidden border-none shadow-md">
      <div className={`${gradient} p-4`}>
        <div className="flex justify-between items-center">
          <h3 className="text-white font-medium text-lg">{title}</h3>
          {icon && <div>{icon}</div>}
        </div>
        <div className="mt-4">
          {isLoading ? (
            <Skeleton className="h-10 w-20 bg-white/20" />
          ) : (
            <div className="text-3xl font-bold text-white">{count}</div>
          )}
        </div>
      </div>
      <CardContent className="p-4 bg-white">
        <div className="text-xs text-gray-500">
          Нийт {title.toLowerCase()}
        </div>
      </CardContent>
    </Card>
  );
}