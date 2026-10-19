import { Zap, TrendingDown, ShieldCheck } from "lucide-react";

export function Hero() {
  return (
    <section className="relative overflow-hidden border-b border-border bg-grid-glow">
      <div
        className="pointer-events-none absolute inset-0 opacity-20"
        style={{
          backgroundImage:
            "linear-gradient(rgba(124,58,237,0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(124,58,237,0.15) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />
      <div className="container relative py-20 md:py-28 text-center">
        <div className="mx-auto mb-5 inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-1.5 text-xs font-medium text-muted-foreground">
          <Zap className="h-3.5 w-3.5 text-accent" />
          Live price tracking across the web
        </div>
        <h1 className="text-balance text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl">
          Find your next{" "}
          <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            mouse &amp; keyboard
          </span>
        </h1>
        <p className="mx-auto mt-5 max-w-xl text-balance text-muted-foreground">
          Curated, auto-updating catalog of the best gaming and productivity peripherals —
          with real-time price drop alerts and one-click checkout.
        </p>

        <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-3 max-w-2xl mx-auto">
          <div className="flex items-center gap-3 rounded-lg border border-border bg-card p-4 text-left">
            <TrendingDown className="h-5 w-5 shrink-0 text-success" />
            <div>
              <p className="text-sm font-semibold">Price Drop Alerts</p>
              <p className="text-xs text-muted-foreground">Track historical lows</p>
            </div>
          </div>
          <div className="flex items-center gap-3 rounded-lg border border-border bg-card p-4 text-left">
            <Zap className="h-5 w-5 shrink-0 text-accent" />
            <div>
              <p className="text-sm font-semibold">Auto-Synced Catalog</p>
              <p className="text-xs text-muted-foreground">Fresh data, always</p>
            </div>
          </div>
          <div className="flex items-center gap-3 rounded-lg border border-border bg-card p-4 text-left">
            <ShieldCheck className="h-5 w-5 shrink-0 text-primary" />
            <div>
              <p className="text-sm font-semibold">Verified Links</p>
              <p className="text-xs text-muted-foreground">Direct to retailer</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
