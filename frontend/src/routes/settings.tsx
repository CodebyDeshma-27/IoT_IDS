import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/common/PageHeader";
import { Panel } from "@/components/common/Panel";
import { DataBadge } from "@/components/common/DataBadge";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { modelOptions } from "@/lib/mock-data";
import { API_BASE_URL, isBackendConfigured } from "@/lib/api";
import { useTheme } from "@/components/theme/ThemeProvider";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/settings")({
  head: () => ({
    meta: [
      { title: "Settings — Model, Threshold and Backend Configuration" },
      {
        name: "description",
        content:
          "Configure the active gradient boosting model, the abstain confidence threshold, theme and the FastAPI backend connection.",
      },
      { property: "og:title", content: "Settings" },
      {
        property: "og:description",
        content: "Model selection, abstain threshold and backend connection status for the IoT IDS prototype.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: SettingsPage,
});

function SettingsPage() {
  const { theme, toggle } = useTheme();
  const [threshold, setThreshold] = useState([0.7]);
  const [model, setModel] = useState("xgboost");

  return (
    <>
      <PageHeader
        eyebrow="Configuration"
        title="Settings"
        description="Prototype controls. Model weights and thresholds take effect once the FastAPI service is connected."
        actions={<DataBadge tone={isBackendConfigured ? "backend" : "pending"} label={isBackendConfigured ? "Backend Connected" : "Backend Required"} />}
      />

      <div className="grid gap-5 xl:grid-cols-2">
        <Panel title="Model" subtitle="Gradient boosting variant used for inference">
          <div className="space-y-2">
            {modelOptions.map((m) => (
              <button
                key={m.id}
                disabled={!m.available}
                onClick={() => setModel(m.id)}
                className={cn(
                  "panel-quiet flex w-full items-center justify-between px-4 py-3 text-left transition-colors",
                  model === m.id && "border-primary/50 bg-primary/10",
                  !m.available && "cursor-not-allowed opacity-60",
                )}
              >
                <span className="text-sm font-medium text-foreground">{m.label}</span>
                <span className="text-[11px] text-muted-foreground">{m.note}</span>
              </button>
            ))}
          </div>
        </Panel>

        <Panel title="Abstain Threshold" subtitle="Below this confidence a flow is marked SUSPICIOUS / UNSEEN">
          <div className="flex items-center justify-between">
            <Label className="text-sm text-muted-foreground">Confidence cut-off</Label>
            <span className="num text-sm font-semibold text-foreground">{threshold[0]!.toFixed(2)}</span>
          </div>
          <Slider className="mt-5" min={0.3} max={0.95} step={0.01} value={threshold} onValueChange={setThreshold} />
          <p className="mt-4 text-xs text-muted-foreground">
            A higher cut-off routes more traffic to human review and reduces confident mistakes on unseen attack families.
          </p>
        </Panel>

        <Panel title="Appearance" subtitle="Interface theme">
          <div className="flex items-center justify-between">
            <Label className="text-sm text-muted-foreground">Dark mode</Label>
            <Switch checked={theme === "dark"} onCheckedChange={toggle} />
          </div>
        </Panel>

        <Panel title="Backend" subtitle="FastAPI inference service">
          <dl className="space-y-3 text-sm">
            <div className="flex items-center justify-between">
              <dt className="text-muted-foreground">Status</dt>
              <dd className={isBackendConfigured ? "text-success" : "text-warning"}>
                {isBackendConfigured ? "Connected" : "Not configured"}
              </dd>
            </div>
            <div className="flex items-center justify-between gap-4">
              <dt className="text-muted-foreground">Base URL</dt>
              <dd className="num truncate text-foreground">{API_BASE_URL ?? "VITE_IDS_API_URL not set"}</dd>
            </div>
          </dl>
          <p className="mt-4 text-xs text-muted-foreground">
            Until a service is configured, every page renders labelled demo values.
          </p>
        </Panel>
      </div>
    </>
  );
}
