import { createFileRoute, Link } from "@tanstack/react-router";
import { AlertTriangle, ArrowDown, Loader2, ShieldAlert, ShieldCheck } from "lucide-react";
import { PageHeader } from "@/components/common/PageHeader";
import { Panel } from "@/components/common/Panel";
import { KpiCard } from "@/components/common/KpiCard";
import { DataBadge } from "@/components/common/DataBadge";
import { Button } from "@/components/ui/button";
import { useLiveState } from "@/lib/live-store";
import { SELECTED_FEATURES } from "@/lib/features";
import { percent } from "@/lib/format";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/live/prediction")({
  head: () => ({
    meta: [
      { title: "Prediction Result — Live IoT IDS Model Output" },
      {
        name: "description",
        content:
          "Prediction returned by the trained XGBoost IoT intrusion detection model for a submitted network-flow feature vector.",
      },
      { property: "og:title", content: "Prediction Result — Live IDS Mode" },
      {
        property: "og:description",
        content: "Model output, confidence and attack family for one submitted IoT network flow.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: LivePredictionPage,
});

const PIPELINE = [
  "Network Traffic",
  "20 Selected Features",
  "XGBoost",
  "Prediction",
  "Attack / Benign",
  "Attack Family + Confidence",
];

function Pipeline({ stage }: { stage: number }) {
  return (
    <div className="grid gap-2 md:grid-cols-6 md:items-stretch">
      {PIPELINE.map((label, i) => (
        <div key={label} className="flex flex-col items-center gap-2 md:contents">
          <div
            className={cn(
              "panel-quiet w-full p-3 text-center text-xs",
              i <= stage ? "border-primary/40 bg-primary/5 text-foreground" : "text-muted-foreground",
            )}
          >
            {label}
          </div>
          {i < PIPELINE.length - 1 ? (
            <ArrowDown className="size-4 text-muted-foreground md:hidden" aria-hidden />
          ) : null}
        </div>
      ))}
    </div>
  );
}

function LivePredictionPage() {
  const { submitted, result, error, pending, at } = useLiveState();

  const label =
    (result?.prediction as string | undefined) ??
    (result?.label as string | undefined) ??
    null;
  const isAttack = label ? !/benign|normal/i.test(label) : false;
  const family = result?.attack_family ?? null;
  const confidence = typeof result?.confidence === "number" ? result.confidence : null;
  const latency = typeof result?.inference_time_ms === "number" ? result.inference_time_ms : null;

  const stage = result ? 5 : pending ? 2 : submitted ? 1 : 0;

  return (
    <>
      <PageHeader
        eyebrow="Live IDS Mode · Interactive Model Prediction"
        title="Prediction Result"
        description="Output returned by the trained model for the most recently submitted flow. Nothing on this page is generated in the browser."
        actions={
          <DataBadge
            tone={result ? "backend" : error ? "pending" : "neutral"}
            label={result ? "Model Output" : error ? "Backend Required" : "Awaiting Submission"}
          />
        }
      />

      <Panel title="Prediction Pipeline">
        <Pipeline stage={stage} />
      </Panel>

      {pending ? (
        <Panel title="Running">
          <div className="flex items-center gap-3 text-sm text-muted-foreground">
            <Loader2 className="size-4 animate-spin text-primary" /> Waiting for the model response…
          </div>
        </Panel>
      ) : null}

      {!submitted && !pending ? (
        <Panel title="No Flow Submitted Yet">
          <p className="text-sm text-muted-foreground">
            Enter or load a feature vector on the Traffic Analysis page and run a prediction.
          </p>
          <Button asChild className="mt-4">
            <Link to="/live/traffic-analysis">Go to Traffic Analysis</Link>
          </Button>
        </Panel>
      ) : null}

      {error ? (
        <Panel title="Prediction Failed">
          <div className="flex items-start gap-3">
            <AlertTriangle className="mt-0.5 size-4 shrink-0 text-destructive" />
            <div>
              <p className="text-sm text-foreground">{error}</p>
              <p className="mt-1 text-xs text-muted-foreground">
                No prediction is shown because the backend did not return one.
              </p>
            </div>
          </div>
        </Panel>
      ) : null}

      {result ? (
        <>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <KpiCard
              label="Prediction"
              value={label ?? "—"}
              tone={isAttack ? "danger" : "positive"}
              icon={isAttack ? ShieldAlert : ShieldCheck}
            />
            <KpiCard label="Attack Family" value={family ?? "Not reported"} />
            <KpiCard
              label="Confidence"
              value={confidence !== null ? percent(confidence > 1 ? confidence / 100 : confidence, 2) : "Not reported"}
            />
            {latency !== null ? (
              <KpiCard label="Inference Time" value={latency.toFixed(2)} unit="ms" />
            ) : (
              <KpiCard label="Inference Time" value="Not reported" />
            )}
          </div>

          {result.probabilities ? (
            <Panel title="Class Probabilities" subtitle="As returned by the backend">
              <div className="grid gap-2 sm:grid-cols-2">
                {Object.entries(result.probabilities).map(([k, v]) => (
                  <div key={k} className="panel-quiet flex items-center justify-between gap-3 px-3 py-2">
                    <span className="text-sm text-foreground">{k}</span>
                    <span className="num text-sm text-muted-foreground">{percent(v > 1 ? v / 100 : v, 2)}</span>
                  </div>
                ))}
              </div>
            </Panel>
          ) : null}
        </>
      ) : null}

      {submitted ? (
        <Panel title="Submitted Feature Vector" {...(at ? { subtitle: `Sent ${new Date(at).toLocaleTimeString()}` } : {})}>
          <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-4">
            {SELECTED_FEATURES.map((f) => (
              <div key={f.key} className="panel-quiet flex items-center justify-between gap-3 px-3 py-2">
                <span className="truncate text-xs text-muted-foreground">{f.label}</span>
                <span className="num text-xs text-foreground">{submitted[f.key]}</span>
              </div>
            ))}
          </div>
        </Panel>
      ) : null}
    </>
  );
}
