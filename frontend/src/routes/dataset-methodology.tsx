import { createFileRoute } from "@tanstack/react-router";
import { ChevronRight } from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip as RTooltip,
  XAxis,
  YAxis,
} from "recharts";
import { PageHeader } from "@/components/common/PageHeader";
import { Panel } from "@/components/common/Panel";
import { KpiCard } from "@/components/common/KpiCard";
import { DataBadge } from "@/components/common/DataBadge";
import { chartAxis, chartGrid, chartTooltip, PALETTE } from "@/components/charts/chart-theme";
import { classDistribution, featureStatistics, mockDataset, previewRecords } from "@/lib/mock-data";
import { compactNumber, fullNumber } from "@/lib/format";
import { SELECTED_FEATURES } from "@/lib/features";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/dataset-methodology")({
  head: () => ({
    meta: [
      { title: "Dataset & Methodology — CICIoT2023 Experimental Setup" },
      {
        name: "description",
        content:
          "CICIoT2023 dataset profile, preprocessing, imbalance handling, feature selection and the leave-one-attack-family-out experimental protocol.",
      },
      { property: "og:title", content: "Dataset & Methodology" },
      {
        property: "og:description",
        content: "How the CICIoT2023 data was prepared and how the unseen attack-family experiments were run.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: DatasetMethodologyPage,
});

const METHOD_STAGES = [
  { label: "CICIoT2023", description: "Raw IoT network flows" },
  { label: "Preprocessing", description: "Cleaning, encoding, scaling" },
  { label: "Imbalance Handling", description: "Class-aware weighting" },
  { label: "Feature Selection", description: "20 selected features" },
  { label: "XGBoost", description: "Gradient boosted trees" },
  { label: "Threshold Calibration", description: "Decision cut-off analysis" },
  { label: "Unseen-Family Evaluation", description: "Leave-one-family-out" },
];

function DatasetMethodologyPage() {
  return (
    <>
      <PageHeader
        eyebrow="Research Mode · Setup"
        title="Dataset & Methodology"
        description="How the CICIoT2023 flows were prepared and how the unseen attack-family experiments were designed."
        actions={<DataBadge tone="neutral" label="Experimental Evaluation" />}
      />

      <Panel title="Experimental Pipeline" subtitle="From raw flows to unseen attack-family evaluation">
        <div className="flex flex-col gap-2 lg:flex-row lg:items-stretch">
          {METHOD_STAGES.map((stage, i) => (
            <div key={stage.label} className="flex flex-1 items-center gap-2">
              <div className={cn("panel-quiet w-full p-3", i === METHOD_STAGES.length - 1 && "border-primary/50 bg-primary/10")}>
                <p className="text-xs font-semibold text-foreground">{stage.label}</p>
                <p className="mt-1 text-[11px] leading-snug text-muted-foreground">{stage.description}</p>
              </div>
              {i < METHOD_STAGES.length - 1 ? (
                <ChevronRight className="hidden size-4 shrink-0 text-muted-foreground lg:block" />
              ) : null}
            </div>
          ))}
        </div>
      </Panel>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard label="Total Records" value={compactNumber(mockDataset.totalRecords)} footnote={mockDataset.name} />
        <KpiCard label="Selected Features" value="20" tone="positive" footnote="Used by the trained model" />
        <KpiCard label="Missing Values" value={fullNumber(mockDataset.missingValues)} footnote="After imputation" />
        <KpiCard label="Duplicates Removed" value={fullNumber(mockDataset.duplicateRecords)} tone="warning" />
      </div>

      <Panel
        title="Class Distribution"
        subtitle={`Imbalance ratio ${mockDataset.imbalanceRatio}`}
        actions={<DataBadge label="Demo Data" hint="Replaced by GET /summary once the backend is connected." />}
      >
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={classDistribution}>
              <CartesianGrid {...chartGrid} />
              <XAxis dataKey="family" {...chartAxis} />
              <YAxis {...chartAxis} tickFormatter={compactNumber} />
              <RTooltip {...chartTooltip} formatter={(v: number) => fullNumber(v)} />
              <Bar dataKey="count" radius={[5, 5, 0, 0]}>
                {classDistribution.map((_, i) => (
                  <Cell key={i} fill={PALETTE[i % PALETTE.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Panel>

      <Panel
        title="Selected Feature Set"
        subtitle="The 20 network-flow features the trained XGBoost model consumes"
      >
        <div className="flex flex-wrap gap-2">
          {SELECTED_FEATURES.map((f) => (
            <span
              key={f.key}
              className="num rounded-md border border-border bg-secondary/50 px-2.5 py-1 text-xs text-foreground"
            >
              {f.label}
            </span>
          ))}
        </div>
      </Panel>

      <div className="grid gap-5 xl:grid-cols-2">
        <Panel
          title="Feature Statistics"
          subtitle="Mean and standard deviation of key flow features"
          actions={<DataBadge label="Demo Data" />}
        >
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs tracking-wide text-muted-foreground uppercase">
                  <th className="pb-2">Feature</th>
                  <th className="pb-2 text-right">Mean</th>
                  <th className="pb-2 text-right">Std</th>
                </tr>
              </thead>
              <tbody>
                {featureStatistics.map((f) => (
                  <tr key={f.feature} className="border-t border-border/60">
                    <td className="py-2 text-foreground">{f.feature}</td>
                    <td className="num py-2 text-right text-muted-foreground">{compactNumber(f.mean)}</td>
                    <td className="num py-2 text-right text-muted-foreground">{compactNumber(f.std)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Panel>

        <Panel
          title="Sample Records"
          subtitle="Preview of preprocessed flows"
          actions={<DataBadge label="Demo Data" />}
        >
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs tracking-wide text-muted-foreground uppercase">
                  <th className="pb-2">ID</th>
                  <th className="pb-2 text-right">Bytes/s</th>
                  <th className="pb-2 text-right">Pkts/s</th>
                  <th className="pb-2">Proto</th>
                  <th className="pb-2">Label</th>
                </tr>
              </thead>
              <tbody>
                {previewRecords.map((r) => (
                  <tr key={r.id} className="border-t border-border/60">
                    <td className="num py-2 text-muted-foreground">{r.id}</td>
                    <td className="num py-2 text-right">{compactNumber(r.flowBytesPerSec)}</td>
                    <td className="num py-2 text-right">{compactNumber(r.flowPacketsPerSec)}</td>
                    <td className="py-2 text-muted-foreground">{r.protocol}</td>
                    <td className="py-2 text-foreground">{r.label}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Panel>
      </div>
    </>
  );
}
