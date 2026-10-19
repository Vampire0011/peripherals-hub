"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { PlayCircle, Loader2, Terminal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { triggerSync } from "@/lib/actions/admin";
import { cn } from "@/lib/utils";

interface LogEntry {
  id: string;
  message: string;
  level: string;
  createdAt: string;
}

const levelColor: Record<string, string> = {
  info: "text-muted-foreground",
  success: "text-success",
  warn: "text-yellow-400",
  error: "text-destructive",
};

export function AdminConsole({ initialLogs }: { initialLogs: LogEntry[] }) {
  const [logs, setLogs] = useState<LogEntry[]>(initialLogs);
  const [isPending, startTransition] = useTransition();
  const [polling, setPolling] = useState(false);
  const [mode, setMode] = useState<"mock" | "playwright">("mock");
  const consoleRef = useRef<HTMLDivElement>(null);

  async function refreshLogs() {
    const res = await fetch("/api/admin/logs", { cache: "no-store" });
    if (res.ok) {
      const data = await res.json();
      setLogs(data.logs);
    }
  }

  function handleRunSync() {
    setPolling(true);
    startTransition(async () => {
      await triggerSync(mode);
      await refreshLogs();
      setPolling(false);
    });
  }

  useEffect(() => {
    if (!polling) return;
    const id = setInterval(refreshLogs, 700); // stream log lines while the sync runs
    return () => clearInterval(id);
  }, [polling]);

  useEffect(() => {
    if (consoleRef.current) {
      consoleRef.current.scrollTop = 0;
    }
  }, [logs]);

  return (
    <div className="rounded-lg border border-border bg-card">
      <div className="flex items-center justify-between border-b border-border p-4">
        <div className="flex items-center gap-2">
          <Terminal className="h-4 w-4 text-accent" />
          <h2 className="font-semibold">Live Sync Console</h2>
        </div>
        <div className="flex items-center gap-2">
        <select
          value={mode}
          onChange={(e) => setMode(e.target.value as "mock" | "playwright")}
          className="h-8 rounded-md border border-border bg-card px-2 text-xs"
          aria-label="Sync mode"
        >
          <option value="mock">Mock feed</option>
          <option value="playwright">Playwright scraper</option>
        </select>
        <Button size="sm" onClick={handleRunSync} disabled={isPending || polling}>
          {isPending || polling ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" /> Syncing...
            </>
          ) : (
            <>
              <PlayCircle className="h-4 w-4" /> Run Sync Now
            </>
          )}
        </Button>
        </div>
      </div>

      <div ref={consoleRef} className="max-h-[420px] overflow-y-auto p-4 font-mono text-xs">
        {logs.length === 0 ? (
          <p className="text-muted-foreground">No sync activity yet. Click &quot;Run Sync Now&quot;.</p>
        ) : (
          <ul className="space-y-1.5">
            {logs.map((log) => (
              <li key={log.id} className="flex items-start gap-2">
                <span className="shrink-0 text-muted-foreground/60">
                  {new Date(log.createdAt).toLocaleTimeString()}
                </span>
                <Badge variant="outline" className={cn("shrink-0 px-1.5 py-0 text-[10px]", levelColor[log.level])}>
                  {log.level}
                </Badge>
                <span className={levelColor[log.level] ?? "text-foreground"}>{log.message}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
