/**
 * Completed experimental results for the trained framework.
 *
 * These are measured values from the finished experiments (binary
 * closed-world evaluation and three leave-one-attack-family-out runs).
 * They are replaced by GET /performance, GET /unseen-evaluation and
 * GET /reliability once the backend is connected.
 */

export interface BinaryMetrics {
  accuracy: number;
  precision: number;
  recall: number;
  f1: number;
  balancedAccuracy?: number;
  fpr: number;
  fnr?: number;
}

export const closedWorld: BinaryMetrics = {
  accuracy: 0.9829,
  precision: 0.9844,
  recall: 0.9982,
  f1: 0.9913,
  balancedAccuracy: 0.7398,
  fpr: 0.5187,
  fnr: 0.0018,
};

export type UnseenFamily = "DDoS" | "DoS" | "Mirai";

export const UNSEEN_FAMILIES: UnseenFamily[] = ["DDoS", "DoS", "Mirai"];

export interface UnseenExperiment {
  family: UnseenFamily;
  trainingClasses: string[];
  metrics: BinaryMetrics;
  /** Change vs the closed-world run, in percentage points. */
  delta: { accuracy: number; f1: number };
  note: string;
}

const ALL_CLASSES = ["Benign", "DDoS", "DoS", "Recon", "Spoofing", "Brute Force", "Web-based"];

const pp = (a: number, b: number) => Number(((a - b) * 100).toFixed(2));

export const unseenExperiments: Record<UnseenFamily, UnseenExperiment> = {
  DDoS: {
    family: "DDoS",
    trainingClasses: ALL_CLASSES.filter((c) => c !== "DDoS").concat("Mirai"),
    metrics: { accuracy: 0.98, precision: 0.9796, recall: 1.0, f1: 0.9897, fpr: 0.5042 },
    delta: { accuracy: pp(0.98, closedWorld.accuracy), f1: pp(0.9897, closedWorld.f1) },
    note: "Volumetric behaviour overlaps strongly with the retained flooding families, so the held-out family is still separated from benign traffic.",
  },
  DoS: {
    family: "DoS",
    trainingClasses: ALL_CLASSES.filter((c) => c !== "DoS").concat("Mirai"),
    metrics: { accuracy: 0.9227, precision: 0.9166, recall: 1.0, f1: 0.9565, fpr: 0.514 },
    delta: { accuracy: pp(0.9227, closedWorld.accuracy), f1: pp(0.9565, closedWorld.f1) },
    note: "Accuracy drops by roughly six percentage points while recall on the held-out family is retained; the cost shows up in precision.",
  },
  Mirai: {
    family: "Mirai",
    trainingClasses: ALL_CLASSES,
    metrics: { accuracy: 0.8202, precision: 0.7849, recall: 1.0, f1: 0.8795, fpr: 0.5233 },
    delta: { accuracy: -16.28, f1: -11.18 },
    note: "The largest observed degradation. Held-out Mirai traffic is still flagged, but benign traffic is misclassified far more often, which is exactly the reliability gap this work examines.",
  },
};

/** Measured operating points for the threshold sensitivity analysis. */
export interface ThresholdPoint {
  threshold: number;
  fpr: number;
  fnr: number;
  measured: true;
}

export const thresholdPoints: ThresholdPoint[] = [
  { threshold: 0.5, fpr: 0.5187, fnr: 0.0018, measured: true },
  { threshold: 0.7, fpr: 0.1843, fnr: 0.0056, measured: true },
  { threshold: 0.95, fpr: 0.0037, fnr: 0.0146, measured: true },
];

/** Linear interpolation between measured anchors — clearly labelled in the UI. */
export function thresholdCurve(): { threshold: number; fpr: number; fnr: number }[] {
  const out: { threshold: number; fpr: number; fnr: number }[] = [];
  for (let t = 0.5; t <= 0.9501; t += 0.05) {
    out.push({ threshold: Number(t.toFixed(2)), ...interpolateAtThreshold(Number(t.toFixed(2))) });
  }
  return out;
}

export function interpolateAtThreshold(t: number): { fpr: number; fnr: number; exact: boolean } {
  const exactPoint = thresholdPoints.find((p) => Math.abs(p.threshold - t) < 1e-6);
  if (exactPoint) return { fpr: exactPoint.fpr, fnr: exactPoint.fnr, exact: true };

  const sorted = [...thresholdPoints].sort((a, b) => a.threshold - b.threshold);
  const lower = [...sorted].reverse().find((p) => p.threshold <= t) ?? sorted[0]!;
  const upper = sorted.find((p) => p.threshold >= t) ?? sorted[sorted.length - 1]!;
  if (lower === upper) return { fpr: lower.fpr, fnr: lower.fnr, exact: false };
  const ratio = (t - lower.threshold) / (upper.threshold - lower.threshold);
  return {
    fpr: lower.fpr + (upper.fpr - lower.fpr) * ratio,
    fnr: lower.fnr + (upper.fnr - lower.fnr) * ratio,
    exact: false,
  };
}

export const RESEARCH_STATEMENT =
  "High closed-world performance does not automatically guarantee reliable detection of unseen attack families.";
