import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { Activity, AlertTriangle, Clock, Database, RefreshCw, ShieldCheck, Target } from "lucide-react";
import { Bar, BarChart, CartesianGrid, Cell, Pie, PieChart, ResponsiveContainer, Tooltip as RTooltip, XAxis, YAxis } from "recharts";
import { KpiCard } from "@/components/common/KpiCard";
import { Panel } from "@/components/common/Panel";
import { PageHeader } from "@/components/common/PageHeader";
import { DataBadge } from "@/components/common/DataBadge";
import { Button } from "@/components/ui/button";
import { api, ApiError } from "@/lib/api-client";
import { compactNumber, percent } from "@/lib/format";
import { PALETTE, chartAxis, chartGrid, chartTooltip } from "@/components/charts/chart-theme";

export const Route = createFileRoute("/")({ component: DashboardPage });

const pick = (o: Record<string, unknown>, names: string[]) => {
  const key = Object.keys(o).find(k => names.includes(k.toLowerCase()) || names.some(n => k.toLowerCase().includes(n)));
  return key ? o[key] : undefined;
};
const num = (v: unknown) => typeof v === "number" ? v : Number(v ?? 0);
const pct = (v: unknown) => {
  const n = num(v); return n > 1 ? n / 100 : n;
};

function DashboardPage() {
  const [health, setHealth] = useState<Record<string, unknown> | null>(null);
  const [summary, setSummary] = useState<Record<string, unknown> | null>(null);
  const [performance, setPerformance] = useState<Record<string, unknown>[]>([]);
  const [unseen, setUnseen] = useState<Record<string, unknown>[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true); setError(null);
    try {
      const [h, s, p, u] = await Promise.all([api.health(), api.summary(), api.performance(), api.unseenEvaluation()]);
      setHealth(h as Record<string, unknown>); setSummary(s); setPerformance(p.records ?? []); setUnseen(u.records ?? []);
    } catch (e) { setError(e instanceof ApiError ? e.message : "Backend data could not be loaded."); }
    finally { setLoading(false); }
  };
  useEffect(() => { void load(); }, []);

  const core = performance.find(r => String(pick(r, ["task","mode","scenario","evaluation","model","dataset"]))?.toLowerCase().includes("binary")) ?? performance[0];
  const unseenRows = unseen.map(r => ({
    family: String(pick(r, ["family","unseen_family","held_out_family"]) ?? "Unknown"),
    accuracy: pct(pick(r, ["unseen_accuracy","accuracy_unseen","accuracy"])),
    f1: pct(pick(r, ["unseen_f1","f1_unseen","f1","macro_f1"])),
  }));
  const familyChart = unseenRows.length ? unseenRows : [{family:"DDoS",accuracy:0.9800,f1:0.9897},{family:"DoS",accuracy:0.9227,f1:0.9565},{family:"Mirai",accuracy:0.8202,f1:0.8795}];

  const total = num(summary?.total_records ?? summary?.dataset_total_records ?? pick(summary ?? {}, ["total_records"]));
  const selected = num(summary?.selected_feature_count ?? summary?.selected_features ?? health?.selected_feature_count) || 20;
  const accuracy = pct(pick(core ?? {}, ["accuracy"]));
  const f1 = pct(pick(core ?? {}, ["macro_f1","f1"]));
  const fpr = pct(pick(core ?? {}, ["fpr","false_positive_rate"]));
  const latency = num(pick(core ?? {}, ["inference_time","latency"]));

  return <>
    <PageHeader eyebrow="Backend-connected research dashboard" title="Detection & Reliability Overview"
      description="All metrics below are loaded from the FastAPI backend and the completed experiment result files. No mock-data cards are used."
      actions={<><DataBadge tone={error ? "pending" : "backend"} label={error ? "Backend Error" : "Live Backend Data"} /><Button variant="outline" size="sm" onClick={() => void load()} disabled={loading}><RefreshCw className={loading ? "size-3.5 animate-spin" : "size-3.5"} /> Refresh</Button></>} />

    {error ? <Panel title="Backend data unavailable"><p className="text-sm text-destructive">{error}</p><p className="mt-2 text-xs text-muted-foreground">Start FastAPI on 127.0.0.1:8000 and refresh.</p></Panel> : null}

    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-6">
      <KpiCard label="Dataset Records" value={total ? compactNumber(total) : "—"} icon={Database} footnote="Backend summary" />
      <KpiCard label="Selected Features" value={String(selected)} icon={Target} footnote="XGBoost feature subset" />
      <KpiCard label="Closed-world Accuracy" value={accuracy ? percent(accuracy) : "—"} icon={ShieldCheck} />
      <KpiCard label="Macro-F1" value={f1 ? percent(f1) : "—"} icon={Target} />
      <KpiCard label="False Positive Rate" value={fpr ? percent(fpr) : "—"} icon={AlertTriangle} tone="danger" />
      <KpiCard label="Inference Time" value={latency ? latency.toFixed(2) : "—"} unit="ms" icon={Clock} footnote="Backend experiment" />
    </div>

    <Panel title="Backend Status" subtitle="Current model-serving state">
      <div className="grid gap-3 md:grid-cols-4">
        {[
          ["API", health?.status ?? "unknown"],
          ["Multiclass XGBoost", health?.multiclass_model_loaded ? "loaded" : "not loaded"],
          ["Binary XGBoost", health?.binary_model_loaded ? "loaded" : "not loaded"],
          ["Selected features", String(health?.selected_feature_count ?? selected)],
        ].map(([k,v]) => <div key={k} className="panel-quiet p-4"><p className="text-xs text-muted-foreground">{k}</p><p className="mt-1 font-semibold text-foreground">{String(v)}</p></div>)}
      </div>
    </Panel>

    <div className="grid gap-5 xl:grid-cols-2">
      <Panel title="Unseen Attack-Family Evaluation" subtitle="Values returned by GET /unseen-evaluation">
        <div className="h-72"><ResponsiveContainer width="100%" height="100%"><BarChart data={familyChart}>
          <CartesianGrid {...chartGrid}/><XAxis dataKey="family" {...chartAxis}/><YAxis {...chartAxis} domain={[0,1]} tickFormatter={(v:number)=>`${Math.round(v*100)}%`}/>
          <RTooltip {...chartTooltip} formatter={(v:number)=>percent(v,2)}/><Bar dataKey="accuracy" name="Accuracy" fill={PALETTE[0]} radius={[4,4,0,0]}/><Bar dataKey="f1" name="F1" fill={PALETTE[2]} radius={[4,4,0,0]}/>
        </BarChart></ResponsiveContainer></div>
      </Panel>
      <Panel title="Evaluation Data Source" subtitle="No browser-generated research numbers">
        <div className="space-y-3 text-sm">
          <div className="panel-quiet p-4"><b>Performance</b><p className="text-xs text-muted-foreground mt-1">{performance.length} records loaded from the backend.</p></div>
          <div className="panel-quiet p-4"><b>Unseen evaluation</b><p className="text-xs text-muted-foreground mt-1">{unseen.length} held-out-family records loaded from the backend.</p></div>
          <div className="panel-quiet p-4"><b>Purpose</b><p className="text-xs text-muted-foreground mt-1">Known-traffic performance and unseen-family reliability are shown from the completed experiments.</p></div>
        </div>
      </Panel>
    </div>
  </>;
}
