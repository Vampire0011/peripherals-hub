import { Package, Users, Mouse, Keyboard } from "lucide-react";
import { getAdminStats, getSyncLogs } from "@/lib/actions/admin";
import { AdminConsole } from "@/components/admin-console";
import { Card, CardContent } from "@/components/ui/card";

export default async function AdminPage() {
  const [stats, logs] = await Promise.all([getAdminStats(), getSyncLogs()]);

  const statCards = [
    { label: "Total Products", value: stats.productCount, icon: Package },
    { label: "Registered Users", value: stats.userCount, icon: Users },
    { label: "Mice", value: stats.mouseCount, icon: Mouse },
    { label: "Keyboards", value: stats.keyboardCount, icon: Keyboard },
  ];

  return (
    <div className="container py-10">
      <h1 className="mb-1 text-2xl font-bold">Admin Sync Panel</h1>
      <p className="mb-8 text-sm text-muted-foreground">
        Trigger the ingestion engine and monitor product deduplication in real time.
      </p>

      <div className="mb-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
        {statCards.map((s) => (
          <Card key={s.label}>
            <CardContent className="flex items-center justify-between pt-4">
              <div>
                <p className="text-xs text-muted-foreground">{s.label}</p>
                <p className="text-2xl font-bold">{s.value}</p>
              </div>
              <s.icon className="h-6 w-6 text-primary/70" />
            </CardContent>
          </Card>
        ))}
      </div>

      <AdminConsole
        initialLogs={logs.map((l) => ({
          id: l.id,
          message: l.message,
          level: l.level,
          createdAt: l.createdAt.toISOString(),
        }))}
      />
    </div>
  );
}
