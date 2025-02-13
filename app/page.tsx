"use client"

import { useEffect } from "react";
import { DashboardHeader } from "@/components/dashboard/header";
import { DashboardMetrics } from "@/components/dashboard/metrics";
import { ActivityHeatmap } from "@/components/dashboard/activity-heatmap";
import { ProgressGraph } from "@/components/dashboard/progress-graph";
import { RecentIdeas } from "@/components/dashboard/recent-ideas";
import { SystemStatus } from "@/components/dashboard/system-status";
import { ResetSystem } from "@/components/dashboard/reset-system";
import { useAuth } from "@/lib/hooks/use-auth";
import { useRouter } from "next/navigation";
import { testSupabaseConnection } from "@/lib/utils/test-connection";

export default function Home() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/auth/signin");
    }
  }, [user, loading, router]);

  useEffect(() => {
    testSupabaseConnection();
  }, []);

  return (
    <div className="p-6 space-y-8">
      <DashboardHeader />
      <DashboardMetrics />
      <ActivityHeatmap />
      <ProgressGraph />
      <RecentIdeas />
      <SystemStatus />
      <ResetSystem />
    </div>
  );
}