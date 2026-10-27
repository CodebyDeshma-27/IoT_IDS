import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip as RTooltip, XAxis, YAxis } from "recharts";
import { PageHeader } from "@/components/common/PageHeader";
import { Panel } from "@/components/common/Panel";
import { DataBadge } from "@/components/common/DataBadge";
import { KpiCard } from "@/components/common/KpiCard";
import { chartAxis, chartGrid, chartTooltip, PALETTE } from "@/components/charts/chart-theme";
import { api, ApiError } from "@/lib/api-client";
import { percent } from "@/lib/format";
export const Route=createFileRoute("/unseen-attacks")({component:UnseenPage});
const get=(o:Record<string,unknown>,names:string[])=>{const k=Object.keys(o).find(x=>names.some(n=>x.toLowerCase().includes(n)));return k?o[k]:undefined};
const n=(v:unknown)=>Number(v??0); const p=(v:unknown)=>{const x=n(v);return x>1?x/100:x};
function UnseenPage(){
 const [rows,setRows]=useState<Record<string,unknown>[]>([]);const [error,setError]=useState<string|null>(null);
 useEffect(()=>{api.unseenEvaluation().then(r=>setRows(r.records??[])).catch(e=>setError(e instanceof ApiError?e.message:"Backend error"));},[]);
 const chart=rows.map(r=>({family:String(get(r,["family","unseen_family","held_out"])??"Unknown"),accuracy:p(get(r,["accuracy_unseen","unseen_accuracy","accuracy"])),f1:p(get(r,["f1_unseen","unseen_f1","f1","macro_f1"]))}));
 return <><PageHeader eyebrow="Primary research result · Backend data" title="Unseen Attack-Family Evaluation" description="Held-out attack-family results are loaded directly from the completed backend experiment." actions={<DataBadge tone={error?"pending":"backend"} label={error?"Backend Error":"Live Backend Data"}/>} />
 {error?<Panel title="Backend error"><p className="text-sm text-destructive">{error}</p></Panel>:null}
 <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">{chart.map(x=><KpiCard key={x.family} label={`${x.family} Accuracy`} value={percent(x.accuracy,2)} footnote={`F1 ${percent(x.f1,2)}`}/>)}</div>
 <Panel title="Held-out Family Results" subtitle={`${rows.length} records returned by GET /unseen-evaluation`}><div className="h-80"><ResponsiveContainer width="100%" height="100%"><BarChart data={chart}><CartesianGrid {...chartGrid}/><XAxis dataKey="family" {...chartAxis}/><YAxis domain={[0,1]} {...chartAxis} tickFormatter={(v:number)=>`${Math.round(v*100)}%`}/><RTooltip {...chartTooltip} formatter={(v:number)=>percent(v,2)}/><Bar dataKey="accuracy" name="Accuracy" fill={PALETTE[0]}/><Bar dataKey="f1" name="F1" fill={PALETTE[2]}/></BarChart></ResponsiveContainer></div></Panel>
 <Panel title="Research interpretation"><p className="text-sm text-muted-foreground">This is an unseen attack-family / zero-day-like evaluation, not a guarantee of real-world zero-day detection. The backend results should be presented exactly as measured.</p></Panel>
 </>;
}
