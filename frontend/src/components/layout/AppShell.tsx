import { Link, useRouterState } from "@tanstack/react-router";
import {
  Activity,
  BookOpen,
  Database,
  FlaskConical,
  Gauge,
  LayoutDashboard,
  Menu,
  Moon,
  Radar,
  ScanLine,
  Settings,
  ShieldAlert,
  Sun,
  UserRound,
  Waves,
} from "lucide-react";
import { useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { useTheme } from "@/components/theme/ThemeProvider";
import { useBackendHealth } from "@/hooks/useBackendHealth";

const RESEARCH_NAV = [
  { to: "/", label: "Overview", icon: LayoutDashboard },
  { to: "/dataset-methodology", label: "Dataset & Methodology", icon: BookOpen },
  { to: "/feature-analysis", label: "Feature Analysis", icon: Database },
  { to: "/model-performance", label: "Model Performance", icon: Gauge },
  { to: "/unseen-attacks", label: "Unseen Attack Evaluation", icon: Radar },
  { to: "/reliability", label: "Reliability Analysis", icon: ShieldAlert },
  { to: "/settings", label: "Settings", icon: Settings },
] as const;

const LIVE_NAV = [
  { to: "/live/traffic-analysis", label: "Traffic Analysis", icon: Waves },
  { to: "/live/prediction", label: "Prediction Result", icon: ScanLine },
  { to: "/settings", label: "Settings", icon: Settings },
] as const;

function BackendStatus() {
  const { connected, checking } = useBackendHealth();
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <div className="panel-quiet hidden items-center gap-2 px-3 py-1.5 lg:flex">
          <span
            className={cn(
              "size-2 rounded-full",
              connected ? "bg-success" : checking ? "bg-warning" : "bg-muted-foreground",
            )}
            aria-hidden
          />
          <span className="text-xs font-medium text-foreground">
            {connected ? "Backend Connected" : checking ? "Checking backend…" : "Backend Disconnected"}
          </span>
        </div>
      </TooltipTrigger>
      <TooltipContent className="max-w-64">
        Status comes from a live GET /health request to the configured API base URL.
      </TooltipContent>
    </Tooltip>
  );
}

function ModeSwitch({ live }: { live: boolean }) {
  return (
    <div className="panel-quiet flex items-center gap-1 p-1">
      <Link
        to="/"
        className={cn(
          "rounded-md px-3 py-1.5 text-xs font-medium transition-colors",
          !live
            ? "bg-primary/15 text-primary"
            : "text-muted-foreground hover:text-foreground",
        )}
      >
        Research Mode
      </Link>
      <Link
        to="/live/traffic-analysis"
        className={cn(
          "rounded-md px-3 py-1.5 text-xs font-medium transition-colors",
          live ? "bg-primary/15 text-primary" : "text-muted-foreground hover:text-foreground",
        )}
      >
        Live IDS Mode
      </Link>
    </div>
  );
}

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const { theme, toggle } = useTheme();
  const [open, setOpen] = useState(false);

  const live = pathname.startsWith("/live");
  const nav = live ? LIVE_NAV : RESEARCH_NAV;

  return (
    <div className="flex min-h-screen">
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 w-72 shrink-0 border-r border-sidebar-border bg-sidebar/95 backdrop-blur-xl transition-transform lg:translate-x-0",
          open ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex h-16 items-center gap-3 border-b border-sidebar-border px-5">
          <div className="grid size-9 place-items-center rounded-lg border border-primary/30 bg-primary/10">
            {live ? (
              <ScanLine className="size-4.5 text-primary" aria-hidden />
            ) : (
              <FlaskConical className="size-4.5 text-primary" aria-hidden />
            )}
          </div>
          <div className="leading-tight">
            <p className="text-sm font-semibold text-sidebar-foreground">
              {live ? "Live IDS Mode" : "Research Mode"}
            </p>
            <p className="num text-[10px] tracking-[0.16em] text-muted-foreground uppercase">
              CICIoT2023 · Research Prototype
            </p>
          </div>
        </div>

        <nav className="flex flex-col gap-1 p-3">
          {nav.map(({ to, label, icon: Icon }) => {
            const active = to === "/" ? pathname === "/" : pathname.startsWith(to);
            return (
              <Link
                key={to}
                to={to}
                onClick={() => setOpen(false)}
                className={cn(
                  "group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors",
                  active
                    ? "bg-sidebar-accent text-sidebar-accent-foreground"
                    : "text-muted-foreground hover:bg-sidebar-accent/60 hover:text-sidebar-accent-foreground",
                )}
              >
                <Icon className={cn("size-4 shrink-0", active && "text-primary")} aria-hidden />
                <span className="truncate">{label}</span>
                {active ? <span className="ml-auto h-4 w-0.5 rounded-full bg-primary" /> : null}
              </Link>
            );
          })}
        </nav>

        <div className="panel-quiet absolute inset-x-3 bottom-3 p-3">
          <p className="text-[11px] leading-relaxed text-muted-foreground">
            {live
              ? "Interactive model prediction. Results come from the trained model served by the backend."
              : "Experimental evaluation of an imbalance-aware, feature-selected gradient boosting IDS."}
          </p>
        </div>
      </aside>

      {open ? (
        <button
          aria-label="Close navigation"
          className="fixed inset-0 z-30 bg-background/70 backdrop-blur-sm lg:hidden"
          onClick={() => setOpen(false)}
        />
      ) : null}

      <div className="flex min-w-0 flex-1 flex-col lg:pl-72">
        <header className="sticky top-0 z-20 flex h-16 items-center gap-3 border-b border-border/70 bg-background/80 px-4 backdrop-blur-xl md:px-6">
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            aria-label="Open navigation"
            onClick={() => setOpen(true)}
          >
            <Menu className="size-5" />
          </Button>

          <div className="hidden min-w-0 flex-1 xl:block">
            <p className="truncate text-sm font-semibold text-foreground">
              An Imbalance-Aware Feature-Selected Gradient Boosting Framework
            </p>
            <p className="hidden truncate text-[11px] text-muted-foreground sm:block">
              Reliable IoT Intrusion Detection Under Unseen Attack Families
            </p>
          </div>

          <div className="flex flex-1 items-center justify-end gap-3 xl:flex-none">
            <ModeSwitch live={live} />
            <BackendStatus />

            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" onClick={toggle} aria-label="Toggle theme">
                  {theme === "dark" ? <Sun className="size-4.5" /> : <Moon className="size-4.5" />}
                </Button>
              </TooltipTrigger>
              <TooltipContent>Toggle theme</TooltipContent>
            </Tooltip>

            <Button variant="ghost" size="icon" aria-label="Profile" className="hidden sm:inline-flex">
              <span className="grid size-8 place-items-center rounded-full border border-border bg-secondary">
                <UserRound className="size-4 text-muted-foreground" />
              </span>
            </Button>
          </div>
        </header>

        <main className="flex-1 space-y-6 p-4 md:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}

export { Activity };
