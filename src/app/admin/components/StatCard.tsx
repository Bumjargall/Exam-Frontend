"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

interface StatCardProps {
  title: string;
  count: number;
  isLoading: boolean;
  gradient: string;
}
export default function StatCard({
  title,
  count,
  isLoading,
  gradient,
}: StatCardProps) {
  return (
    <Card className="bg-none border-none shadow-none">
      <CardContent
        className={`flex flex-col items-center py-6 ${gradient} text-white rounded-xl shadow-md hover:scale-105 transition`}
      >
        <p className="text-sm">{title}</p>
        <div className="text-3xl font-bold">
          {isLoading ? (
            <Skeleton className="h-8 w-12 bg-white/60 rounded-md" />
          ) : (
            count
          )}
        </div>
      </CardContent>
    </Card>
  );
}
