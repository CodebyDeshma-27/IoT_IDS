/**
 * Shared TypeScript contracts for the IoT IDS research dashboard.
 *
 * These types mirror the payloads a future Python/FastAPI backend is expected
 * to return. Every mock object in `src/lib/mock-data.ts` conforms to them, so
 * swapping mocks for REST responses requires no component changes.
 */

export type DataSource = "mock" | "backend";

export interface Provenance {
  /** Where the numbers came from. UI shows a "Demo Data" badge for mocks. */
  source: DataSource;
  /** Optional note, e.g. "Evaluation Pending". */
  note?: string;
  generatedAt?: string;
}

export type AttackFamily =
  | "DDoS"
  | "DoS"
  | "Recon"
  | "Brute Force"
  | "Spoofing"
  | "Mirai"
  | "Web-Based";

export type PredictionStatus = "BENIGN" | "KNOWN ATTACK" | "SUSPICIOUS / UNSEEN";

export interface DatasetSummary extends Provenance {
  name: string;
  totalRecords: number;
  benignRecords: number;
  attackRecords: number;
  featureCount: number;
  missingValues: number;
  duplicateRecords: number;
  imbalanceRatio: string;
}

export interface FamilyCount {
  family: AttackFamily | "Benign";
  count: number;
}

export interface DetectionSummary extends Provenance {
  detectionRate: number;
  falsePositiveRate: number;
  falseNegativeRate: number;
  macroF1: number;
  inferenceTimeMs: number;
}

export interface PipelineStage {
  id: string;
  label: string;
  description: string;
  state: "complete" | "active" | "pending";
}

export interface TrafficRecordPreview {
  id: string;
  flowDuration: number;
  flowBytesPerSec: number;
  flowPacketsPerSec: number;
  packetLengthMean: number;
  protocol: string;
  label: "Benign" | AttackFamily;
}

export interface PredictionRow {
  recordId: string;
  prediction: "Benign" | "Attack";
  attackFamily: AttackFamily | "—";
  confidence: number;
  decision: "Allow" | "Block" | "Review";
  status: PredictionStatus;
}

export interface PredictionRunSummary extends Provenance {
  benign: number;
  knownAttacks: number;
  suspicious: number;
  averageConfidence: number;
  rows: PredictionRow[];
}

export interface ReliabilityMetrics {
  accuracy: number;
  macroF1: number;
  recall: number;
  fpr: number;
  fnr?: number;
}

export type GeneralizationVerdict =
  | "Strong generalization"
  | "Moderate generalization"
  | "Weak generalization"
  | "Evaluation Pending";

export interface HoldoutEvaluation extends Provenance {
  heldOutFamily: AttackFamily;
  trainingFamilies: AttackFamily[];
  known: ReliabilityMetrics;
  unseen: ReliabilityMetrics;
  confusionMatrix: { label: string; predictedBenign: number; predictedAttack: number }[];
  confidenceDistribution: { bucket: string; known: number; unseen: number }[];
  verdict: GeneralizationVerdict;
  interpretation: string;
}

export interface FeatureRecord {
  name: string;
  importance: number;
  rank?: number;
  reason?: string;
  direction?: "increases" | "decreases";
}

export interface FeatureSelectionResult extends Provenance {
  originalFeatures: number;
  selectedFeatures: number;
  removedFeatures: number;
  reductionPercent: number;
  method: string;
  selected: FeatureRecord[];
  removed: FeatureRecord[];
}

export interface ModelMetrics {
  accuracy: number;
  precision: number;
  recall: number;
  macroF1: number;
  fpr: number;
  fnr: number;
  inferenceTimeMs: number;
  modelSizeMb: number;
}

export interface ModelComparison extends Provenance {
  baseline: ModelMetrics;
  proposed: ModelMetrics;
  confusion: {
    model: "baseline" | "proposed";
    matrix: { actual: string; predictedBenign: number; predictedAttack: number }[];
  }[];
}

export interface ExplanationResult extends Provenance {
  recordId: string;
  prediction: "Benign" | "Attack";
  attackFamily: AttackFamily | "—";
  confidence: number;
  contributions: FeatureRecord[];
  narrative: string;
}

export type ModelId = "xgboost" | "lightgbm" | "catboost";

export interface ModelOption {
  id: ModelId;
  label: string;
  available: boolean;
  note: string;
}
