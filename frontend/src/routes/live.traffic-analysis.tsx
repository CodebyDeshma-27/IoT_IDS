import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip as RTooltip, XAxis, YAxis } from "recharts";
import { Loader2, RotateCcw, Send, Upload, FileText } from "lucide-react";
import { PageHeader } from "@/components/common/PageHeader";
import { Panel } from "@/components/common/Panel";
import { DataBadge } from "@/components/common/DataBadge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import {
  emptyFeatureValues,
  FEATURE_GROUPS,
  FEATURE_SAMPLES,
  SELECTED_FEATURES,
  type FeatureFormValues,
} from "@/lib/features";
import { api, ApiError, type FeatureVector } from "@/lib/api-client";
import { setLiveState } from "@/lib/live-store";
import { useBackendHealth } from "@/hooks/useBackendHealth";

export const Route = createFileRoute("/live/traffic-analysis")({
  head: () => ({
    meta: [
      { title: "Traffic Analysis — Live IoT IDS Feature Entry" },
      {
        name: "description",
        content:
          "Enter or load the 20 selected CICIoT2023 network-flow features and submit them to the trained XGBoost intrusion detection model.",
      },
      { property: "og:title", content: "Traffic Analysis — Live IDS Mode" },
      {
        property: "og:description",
        content: "Interactive model prediction: submit a network-flow feature vector to the trained IoT IDS backend.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: LiveTrafficPage,
});

function LiveTrafficPage() {
  const navigate = useNavigate();
  const { connected } = useBackendHealth();
  const [values, setValues] = useState<FeatureFormValues>(emptyFeatureValues());
  const [busy, setBusy] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [batchFile, setBatchFile] = useState<File | null>(null);
  const [batchBusy, setBatchBusy] = useState(false);
  const [batchError, setBatchError] = useState<string | null>(null);
  const [batchResult, setBatchResult] = useState<Awaited<ReturnType<typeof api.predictBatch>> | null>(null);

  const missing = SELECTED_FEATURES.filter((f) => values[f.key]?.trim() === "" || values[f.key] === undefined);
  const filled = SELECTED_FEATURES.length - missing.length;

  const loadSample = (id: string) => {
    const sample = FEATURE_SAMPLES.find((s) => s.id === id);
    if (!sample) return;
    setValues(Object.fromEntries(SELECTED_FEATURES.map((f) => [f.key, String(sample.values[f.key] ?? "")])));
    setFormError(null);
  };

  const submit = async () => {
    setFormError(null);
    if (missing.length > 0) {
      setFormError(`${missing.length} feature${missing.length === 1 ? "" : "s"} still need a value.`);
      return;
    }
    const vector: FeatureVector = {};
    for (const f of SELECTED_FEATURES) {
      const n = Number(values[f.key]);
      if (Number.isNaN(n)) {
        setFormError(`"${f.label}" is not a number.`);
        return;
      }
      vector[f.key] = n;
    }

    setBusy(true);
    setLiveState({ submitted: vector, result: null, error: null, pending: true, at: null });
    try {
      const result = await api.predict(vector);
      setLiveState({ result, pending: false, at: new Date().toISOString() });
    } catch (err) {
      const message = err instanceof ApiError ? err.message : "The prediction request failed.";
      setLiveState({ error: message, pending: false, at: new Date().toISOString() });
    } finally {
      setBusy(false);
      navigate({ to: "/live/prediction" });
    }
  };

  return (
    <>
      <PageHeader
        eyebrow="Live IDS Mode · Interactive Model Prediction"
        title="Traffic Analysis"
        description="Provide the 20 selected network-flow features for a single flow. The values are sent to the trained XGBoost model served by the backend — nothing is predicted in the browser."
        actions={<DataBadge tone={connected ? "backend" : "pending"} label={connected ? "Backend Connected" : "Backend Required"} />}
      />

      <Panel title="CSV Batch Traffic Prediction" subtitle="Upload a CICIoT2023-compatible CSV. The backend applies the trained 20-feature XGBoost model to every row.">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <label className="flex cursor-pointer items-center gap-2 rounded-md border border-border px-4 py-2 text-sm hover:border-primary/50">
            <Upload className="size-4" /> Choose CSV
            <input type="file" accept=".csv,text/csv" className="hidden" onChange={e => { setBatchFile(e.target.files?.[0] ?? null); setBatchError(null); }} />
          </label>
          <span className="text-sm text-muted-foreground">{batchFile?.name ?? "No file selected"}</span>
          <Button disabled={!batchFile || batchBusy} onClick={async () => {
            if (!batchFile) return; setBatchBusy(true); setBatchError(null);
            try { setBatchResult(await api.predictBatch(batchFile)); }
            catch (e) { setBatchError(e instanceof ApiError ? e.message : "Batch prediction failed."); }
            finally { setBatchBusy(false); }
          }}>
            {batchBusy ? <Loader2 className="size-4 animate-spin" /> : <FileText className="size-4" />}
            {batchBusy ? "Analyzing…" : "Analyze CSV"}
          </Button>
        </div>
        {batchError ? <p className="mt-3 text-sm text-destructive">{batchError}</p> : null}
        {batchResult ? <>
          <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            {[
              ["Records", batchResult.total_records.toLocaleString()],
              ["Predicted Attack", `${batchResult.attack_count.toLocaleString()} (${batchResult.attack_percentage}%)`],
              ["Predicted Benign", `${batchResult.benign_count.toLocaleString()} (${batchResult.benign_percentage}%)`],
              ["Processing", `${batchResult.processing_time_ms.toFixed(2)} ms`],
            ].map(([k,v]) => <div key={k} className="panel-quiet p-4"><p className="text-xs text-muted-foreground">{k}</p><p className="mt-1 text-lg font-semibold">{v}</p></div>)}
          </div>
          <div className="mt-5 grid gap-5 xl:grid-cols-2">
            <Panel title="Predicted Attack Distribution" subtitle="Model predictions for the uploaded file">
              <div className="h-64"><ResponsiveContainer width="100%" height="100%"><BarChart data={Object.entries(batchResult.attack_distribution).map(([family,count])=>({family,count}))}><CartesianGrid vertical={false}/><XAxis dataKey="family"/><YAxis/><RTooltip/><Bar dataKey="count" fill="var(--primary)" radius={[4,4,0,0]}/></BarChart></ResponsiveContainer></div>
            </Panel>
            <Panel title="Prediction Preview" subtitle={`${batchResult.preview_count ?? batchResult.preview_records?.length ?? 0} rows shown`}>
              <div className="max-h-64 overflow-auto"><table className="w-full text-xs"><thead><tr><th className="p-2 text-left">Prediction</th><th className="p-2 text-left">Label</th><th className="p-2 text-left">Confidence</th></tr></thead><tbody>{(batchResult.preview_records ?? []).slice(0,100).map((r,i)=><tr key={i} className="border-t border-border/40"><td className="p-2">{String(r["Prediction"] ?? "")}</td><td className="p-2">{String(r["Label"] ?? "")}</td><td className="p-2">{Number(r["Confidence_Percent"] ?? 0).toFixed(2)}%</td></tr>)}</tbody></table></div>
            </Panel>
          </div>
          <p className="mt-3 text-xs text-muted-foreground">The attack/benign percentages above are predictions for this uploaded file, not ground-truth accuracy.</p>
        </> : null}
      </Panel>

      <Panel
        title="Load a Sample Input"
        subtitle="Example feature vectors only — they carry no pre-computed result"
        actions={
          <Button variant="ghost" size="sm" onClick={() => setValues(emptyFeatureValues())}>
            <RotateCcw className="size-3.5" /> Clear
          </Button>
        }
      >
        <div className="grid gap-3 md:grid-cols-3">
          {FEATURE_SAMPLES.map((s) => (
            <button
              key={s.id}
              onClick={() => loadSample(s.id)}
              className="panel-quiet p-4 text-left transition-colors hover:border-primary/50"
            >
              <p className="text-sm font-medium text-foreground">{s.label}</p>
              <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{s.description}</p>
            </button>
          ))}
        </div>
      </Panel>

      {FEATURE_GROUPS.map((group) => (
        <Panel key={group} title={group} subtitle={`${SELECTED_FEATURES.filter((f) => f.group === group).length} features`}>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {SELECTED_FEATURES.filter((f) => f.group === group).map((f) => (
              <div key={f.key} className="space-y-1.5">
                <Label htmlFor={f.key} className="text-xs text-muted-foreground">
                  {f.hint ? (
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <span className="cursor-help border-b border-dashed border-border">{f.label}</span>
                      </TooltipTrigger>
                      <TooltipContent>{f.hint}</TooltipContent>
                    </Tooltip>
                  ) : (
                    f.label
                  )}
                </Label>
                <Input
                  id={f.key}
                  type="number"
                  inputMode="decimal"
                  step={f.step ?? "any"}
                  className="num"
                  placeholder="0"
                  value={values[f.key] ?? ""}
                  onChange={(e) => setValues((v) => ({ ...v, [f.key]: e.target.value }))}
                />
              </div>
            ))}
          </div>
        </Panel>
      ))}

      <Panel
        title="Submit to Model"
        subtitle={`${filled} of ${SELECTED_FEATURES.length} features provided`}
        actions={
          <Button onClick={submit} disabled={busy}>
            {busy ? <Loader2 className="size-4 animate-spin" /> : <Send className="size-4" />}
            {busy ? "Running…" : "Run Prediction"}
          </Button>
        }
      >
        {formError ? <p className="text-sm text-destructive">{formError}</p> : null}
        <p className="mt-1 text-xs text-muted-foreground">
          The feature vector is sent to POST /predict on the configured backend. If the backend is unreachable, the
          result page reports the failure instead of showing a prediction.
        </p>
      </Panel>
    </>
  );
}
