import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip as RTooltip, XAxis, YAxis } from "recharts";
import { PageHeader } from "@/components/common/PageHeader";
import { Panel } from "@/components/common/Panel";
import { KpiCard } from "@/components/common/KpiCard";
import { DataBadge } from "@/components/common/DataBadge";
import { chartAxis, chartGrid, chartTooltip, PALETTE } from "@/components/charts/chart-theme";
import { api, ApiError } from "@/lib/api-client";
import { percent } from "@/lib/format";

export const Route = createFileRoute("/model-performance")({ component: ModelPerformancePage });
const get=(o:Record<string,unknown>, names:string[])=>{const k=Object.keys(o).find(x=>names.some(n=>x.toLowerCase().includes(n)));return k?o[k]:undefined};
const n=(v:unknown)=>Number(v??0); const p=(v:unknown)=>{const x=n(v);return x>1?x/100:x};

function ModelPerformancePage(){
 const [rows,setRows]=useState<Record<string,unknown>[]>([]); const [error,setError]=useState<string|null>(null);
 useEffect(()=>{api.performance().then(r=>setRows(r.records??[])).catch(e=>setError(e instanceof ApiError?e.message:"Backend error"));},[]);
 const row=rows.find(r=>String(get(r,["binary","task","scenario","mode"])??"").toLowerCase().includes("binary"))??rows[0]??{};
 const metrics=["accuracy","precision","recall","macro_f1","f1","balanced_accuracy","fpr","fnr"].map(k=>({metric:k.replaceAll("_"," ").replace(/\b\w/g,c=>c.toUpperCase()),value:p(get(row,[k]))})).filter(x=>x.value>0||["Accuracy","Precision","Recall","F1"].includes(x.metric));
 return <><PageHeader eyebrow="Backend-connected evaluation" title="Model Performance" description="Completed XGBoost evaluation metrics loaded directly from GET /performance." actions={<DataBadge tone={error?"pending":"backend"} label={error?"Backend Error":"Live Backend Data"}/>} />
 {error?<Panel title="Backend error"><p className="text-sm text-destructive">{error}</p></Panel>:null}
 <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4"><KpiCard label="Accuracy" value={p(get(row,["accuracy"]))?percent(p(get(row,["accuracy"]))):"—"}/><KpiCard label="Precision" value={p(get(row,["precision"]))?percent(p(get(row,["precision"]))):"—"}/><KpiCard label="Recall" value={p(get(row,["recall"]))?percent(p(get(row,["recall"]))):"—"}/><KpiCard label="F1 / Macro-F1" value={p(get(row,["macro_f1","f1"]))?percent(p(get(row,["macro_f1","f1"]))):"—"}/></div>
 <Panel title="Backend Result Records" subtitle={`${rows.length} records returned by the API`}><div className="h-80"><ResponsiveContainer width="100%" height="100%"><BarChart data={metrics}><CartesianGrid {...chartGrid}/><XAxis dataKey="metric" {...chartAxis}/><YAxis domain={[0,1]} {...chartAxis} tickFormatter={(v:number)=>`${Math.round(v*100)}%`}/><RTooltip {...chartTooltip} formatter={(v:number)=>percent(v,2)}/><Bar dataKey="value" fill={PALETTE[0]} radius={[4,4,0,0]}/></BarChart></ResponsiveContainer></div></Panel>
 <Panel title="Raw API Records" subtitle="Useful for mentor/demo verification"><div className="overflow-x-auto"><table className="w-full text-xs"><thead><tr>{Object.keys(rows[0]??{}).map(k=><th key={k} className="px-2 py-2 text-left">{k}</th>)}</tr></thead><tbody>{rows.map((r,i)=><tr key={i} className="border-t border-border/50">{Object.values(r).map((v,j)=><td key={j} className="px-2 py-2">{String(v)}</td>)}</tr>)}</tbody></table></div></Panel>
 </>;
}
