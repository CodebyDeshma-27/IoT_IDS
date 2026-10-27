import { createFileRoute } from "@tanstack/react-router";
import { Bar, BarChart, CartesianGrid, Cell, ResponsiveContainer, Tooltip as RTooltip, XAxis, YAxis } from "recharts";
import { PageHeader } from "@/components/common/PageHeader";
import { Panel } from "@/components/common/Panel";
import { KpiCard } from "@/components/common/KpiCard";
import { DataBadge } from "@/components/common/DataBadge";
import { chartAxis, chartGrid, chartTooltip, PALETTE } from "@/components/charts/chart-theme";
import { mockFeatureSelection } from "@/lib/mock-data";
import { percent } from "@/lib/format";

export const Route = createFileRoute("/feature-analysis")({
  head: () => ({
    meta: [
      { title: "Feature Analysis — Selection and Importance Ranking" },
      {
        name: "description",
        content:
          "Feature-selection results: gain-ranked selected features, pruned redundant features and the resulting dimensionality reduction.",
      },
      { property: "og:title", content: "Feature Analysis" },
      {
        property: "og:description",
        content: "Selected vs removed features and importance ranking for the IoT IDS framework.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: FeatureAnalysisPage,
});

function FeatureAnalysisPage() {
  const fs = mockFeatureSelection;

  return (
    <>
      <PageHeader
        eyebrow="Stage 3 · Feature Selection"
        title="Feature Analysis"
        description={fs.method}
        actions={<DataBadge label="Demo Data" />}
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard label="Original Features" value={String(fs.originalFeatures)} />
        <KpiCard label="Selected" value={String(fs.selectedFeatures)} tone="positive" />
        <KpiCard label="Removed" value={String(fs.removedFeatures)} tone="warning" />
        <KpiCard label="Reduction" value={`${fs.reductionPercent}%`} footnote="Lower inference cost" />
      </div>

      <Panel title="Selected Feature Importance" subtitle="Gradient-boosting gain, normalised">
        <div className="h-96">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={fs.selected} layout="vertical" margin={{ left: 40 }}>
              <CartesianGrid {...chartGrid} horizontal={false} />
              <XAxis type="number" {...chartAxis} tickFormatter={(v: number) => percent(v, 0)} />
              <YAxis type="category" dataKey="name" width={150} {...chartAxis} />
              <RTooltip {...chartTooltip} formatter={(v: number) => percent(v, 1)} />
              <Bar dataKey="importance" radius={[0, 5, 5, 0]} barSize={14}>
                {fs.selected.map((_, i) => (
                  <Cell key={i} fill={PALETTE[i % PALETTE.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Panel>

      <div className="grid gap-5 xl:grid-cols-2">
        <Panel title="Kept Features" subtitle="Ranked by contribution">
          <ul className="space-y-2 text-sm">
            {fs.selected.map((f) => (
              <li key={f.name} className="flex items-baseline justify-between gap-4 border-t border-border/60 pt-2 first:border-0 first:pt-0">
                <span className="text-foreground">
                  <span className="num mr-2 text-xs text-muted-foreground">#{f.rank}</span>
                  {f.name}
                </span>
                <span className="text-xs text-muted-foreground">{f.reason}</span>
              </li>
            ))}
          </ul>
        </Panel>

        <Panel title="Removed Features" subtitle="Low variance, redundant or correlated">
          <ul className="space-y-2 text-sm">
            {fs.removed.map((f) => (
              <li key={f.name} className="flex items-baseline justify-between gap-4 border-t border-border/60 pt-2 first:border-0 first:pt-0">
                <span className="text-muted-foreground line-through">{f.name}</span>
                <span className="text-xs text-muted-foreground">{f.reason}</span>
              </li>
            ))}
          </ul>
        </Panel>
      </div>
    </>
  );
}
