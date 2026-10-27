/**
 * Demo (mock) data for the prototype. Every object carries `source: "mock"`
 * so the UI can label it as "Demo Data". None of these numbers are research
 * results — they exist only to exercise the interface.
 */
import type {
  AttackFamily,
  DatasetSummary,
  DetectionSummary,
  ExplanationResult,
  FamilyCount,
  FeatureSelectionResult,
  HoldoutEvaluation,
  ModelComparison,
  ModelOption,
  PipelineStage,
  PredictionRow,
  PredictionRunSummary,
  TrafficRecordPreview,
} from "@/types/ids";

export const ATTACK_FAMILIES: AttackFamily[] = [
  "DDoS",
  "DoS",
  "Recon",
  "Brute Force",
  "Spoofing",
  "Mirai",
];

export const mockDataset: DatasetSummary = {
  source: "mock",
  note: "Demo Data",
  name: "CICIoT2023 (sampled)",
  totalRecords: 1_186_420,
  benignRecords: 132_580,
  attackRecords: 1_053_840,
  featureCount: 46,
  missingValues: 0,
  duplicateRecords: 2_314,
  imbalanceRatio: "1 : 7.9 (benign : attack)",
};

export const mockDetection: DetectionSummary = {
  source: "mock",
  note: "Demo Data",
  detectionRate: 0.962,
  falsePositiveRate: 0.031,
  falseNegativeRate: 0.038,
  macroF1: 0.918,
  inferenceTimeMs: 1.8,
};

export const classDistribution: FamilyCount[] = [
  { family: "Benign", count: 132_580 },
  { family: "DDoS", count: 512_300 },
  { family: "DoS", count: 268_940 },
  { family: "Mirai", count: 141_260 },
  { family: "Recon", count: 68_410 },
  { family: "Spoofing", count: 42_180 },
  { family: "Brute Force", count: 20_750 },
];

export const attackFamilyDistribution = classDistribution.filter((c) => c.family !== "Benign");

export const detectionTrend = [
  { window: "T-6", detection: 0.941, fpr: 0.052 },
  { window: "T-5", detection: 0.948, fpr: 0.048 },
  { window: "T-4", detection: 0.953, fpr: 0.044 },
  { window: "T-3", detection: 0.955, fpr: 0.039 },
  { window: "T-2", detection: 0.959, fpr: 0.035 },
  { window: "T-1", detection: 0.961, fpr: 0.033 },
  { window: "Now", detection: 0.962, fpr: 0.031 },
];

export const recentActivity = [
  { time: "10:02", benign: 420, known: 180, unseen: 12 },
  { time: "10:07", benign: 388, known: 214, unseen: 18 },
  { time: "10:12", benign: 401, known: 196, unseen: 9 },
  { time: "10:17", benign: 364, known: 243, unseen: 24 },
  { time: "10:22", benign: 412, known: 175, unseen: 14 },
  { time: "10:27", benign: 397, known: 208, unseen: 21 },
];

export const pipelineStages: PipelineStage[] = [
  {
    id: "dataset",
    label: "CICIoT2023",
    description: "Raw IoT network flows",
    state: "complete",
  },
  {
    id: "preprocess",
    label: "Preprocessing",
    description: "Cleaning, encoding, scaling",
    state: "complete",
  },
  {
    id: "imbalance",
    label: "Imbalance Handling",
    description: "Class-aware resampling & weighting",
    state: "complete",
  },
  {
    id: "features",
    label: "Feature Selection",
    description: "Importance-driven subset",
    state: "complete",
  },
  {
    id: "model",
    label: "Gradient Boosting",
    description: "Boosted tree ensemble",
    state: "active",
  },
  {
    id: "calibration",
    label: "Decision Calibration",
    description: "Confidence thresholding",
    state: "pending",
  },
  {
    id: "reliability",
    label: "Reliability Evaluation",
    description: "Unseen-family testing",
    state: "pending",
  },
];

export const previewRecords: TrafficRecordPreview[] = [
  {
    id: "REC-000181",
    flowDuration: 12_480,
    flowBytesPerSec: 8421.4,
    flowPacketsPerSec: 122.6,
    packetLengthMean: 68.4,
    protocol: "TCP",
    label: "Benign",
  },
  {
    id: "REC-000182",
    flowDuration: 240,
    flowBytesPerSec: 984_120.7,
    flowPacketsPerSec: 12_940.2,
    packetLengthMean: 54.0,
    protocol: "UDP",
    label: "DDoS",
  },
  {
    id: "REC-000183",
    flowDuration: 1_120,
    flowBytesPerSec: 43_210.9,
    flowPacketsPerSec: 812.3,
    packetLengthMean: 71.2,
    protocol: "TCP",
    label: "DoS",
  },
  {
    id: "REC-000184",
    flowDuration: 62_300,
    flowBytesPerSec: 1_204.8,
    flowPacketsPerSec: 18.4,
    packetLengthMean: 128.9,
    protocol: "TCP",
    label: "Recon",
  },
  {
    id: "REC-000185",
    flowDuration: 3_940,
    flowBytesPerSec: 22_014.2,
    flowPacketsPerSec: 402.1,
    packetLengthMean: 60.7,
    protocol: "UDP",
    label: "Mirai",
  },
  {
    id: "REC-000186",
    flowDuration: 18_220,
    flowBytesPerSec: 6_118.3,
    flowPacketsPerSec: 94.5,
    packetLengthMean: 82.1,
    protocol: "TCP",
    label: "Brute Force",
  },
  {
    id: "REC-000187",
    flowDuration: 9_640,
    flowBytesPerSec: 15_882.0,
    flowPacketsPerSec: 210.8,
    packetLengthMean: 75.6,
    protocol: "ICMP",
    label: "Spoofing",
  },
  {
    id: "REC-000188",
    flowDuration: 27_100,
    flowBytesPerSec: 4_402.9,
    flowPacketsPerSec: 61.2,
    packetLengthMean: 91.3,
    protocol: "TCP",
    label: "Benign",
  },
];

export const featureStatistics = [
  { feature: "Flow Duration", mean: 18_420, std: 41_220 },
  { feature: "Flow Bytes/s", mean: 62_310, std: 148_900 },
  { feature: "Flow Packets/s", mean: 1_284, std: 3_940 },
  { feature: "Packet Length Mean", mean: 78.4, std: 32.1 },
  { feature: "Packet Length Std", mean: 41.2, std: 22.7 },
  { feature: "Average Packet Size", mean: 84.9, std: 36.4 },
];

const predictionRows: PredictionRow[] = [
  {
    recordId: "REC-000181",
    prediction: "Benign",
    attackFamily: "—",
    confidence: 0.972,
    decision: "Allow",
    status: "BENIGN",
  },
  {
    recordId: "REC-000182",
    prediction: "Attack",
    attackFamily: "DDoS",
    confidence: 0.948,
    decision: "Block",
    status: "KNOWN ATTACK",
  },
  {
    recordId: "REC-000183",
    prediction: "Attack",
    attackFamily: "DoS",
    confidence: 0.911,
    decision: "Block",
    status: "KNOWN ATTACK",
  },
  {
    recordId: "REC-000184",
    prediction: "Attack",
    attackFamily: "—",
    confidence: 0.582,
    decision: "Review",
    status: "SUSPICIOUS / UNSEEN",
  },
  {
    recordId: "REC-000185",
    prediction: "Attack",
    attackFamily: "Mirai",
    confidence: 0.893,
    decision: "Block",
    status: "KNOWN ATTACK",
  },
  {
    recordId: "REC-000186",
    prediction: "Benign",
    attackFamily: "—",
    confidence: 0.884,
    decision: "Allow",
    status: "BENIGN",
  },
  {
    recordId: "REC-000187",
    prediction: "Attack",
    attackFamily: "—",
    confidence: 0.612,
    decision: "Review",
    status: "SUSPICIOUS / UNSEEN",
  },
  {
    recordId: "REC-000188",
    prediction: "Benign",
    attackFamily: "—",
    confidence: 0.964,
    decision: "Allow",
    status: "BENIGN",
  },
  {
    recordId: "REC-000189",
    prediction: "Attack",
    attackFamily: "Recon",
    confidence: 0.842,
    decision: "Block",
    status: "KNOWN ATTACK",
  },
  {
    recordId: "REC-000190",
    prediction: "Attack",
    attackFamily: "—",
    confidence: 0.539,
    decision: "Review",
    status: "SUSPICIOUS / UNSEEN",
  },
];

export const mockPredictionRun: PredictionRunSummary = {
  source: "mock",
  note: "Demo Data",
  benign: 3,
  knownAttacks: 4,
  suspicious: 3,
  averageConfidence: 0.815,
  rows: predictionRows,
};

export function mockHoldout(family: AttackFamily): HoldoutEvaluation {
  const seed = family.length;
  const unseenRecall = 0.42 + (seed % 5) * 0.06;
  const verdict =
    unseenRecall > 0.72
      ? "Strong generalization"
      : unseenRecall > 0.55
        ? "Moderate generalization"
        : "Weak generalization";

  return {
    source: "mock",
    note: "Demo Data — Evaluation Pending",
    heldOutFamily: family,
    trainingFamilies: ATTACK_FAMILIES.filter((f) => f !== family),
    known: { accuracy: 0.964, macroF1: 0.921, recall: 0.951, fpr: 0.032, fnr: 0.049 },
    unseen: {
      accuracy: 0.68 + (seed % 4) * 0.03,
      macroF1: 0.55 + (seed % 5) * 0.04,
      recall: unseenRecall,
      fpr: 0.11 - (seed % 3) * 0.01,
      fnr: 1 - unseenRecall,
    },
    confusionMatrix: [
      { label: "Actual Benign", predictedBenign: 9_412, predictedAttack: 588 },
      { label: `Actual ${family}`, predictedBenign: 2_880, predictedAttack: 7_120 },
    ],
    confidenceDistribution: [
      { bucket: "0.0–0.2", known: 2, unseen: 9 },
      { bucket: "0.2–0.4", known: 4, unseen: 18 },
      { bucket: "0.4–0.6", known: 7, unseen: 31 },
      { bucket: "0.6–0.8", known: 22, unseen: 27 },
      { bucket: "0.8–1.0", known: 65, unseen: 15 },
    ],
    verdict,
    interpretation:
      "Confidence mass shifts toward the mid range when the held-out family appears, which is why low-confidence traffic is routed to the SUSPICIOUS / UNSEEN bucket instead of being forced into a known label. Values shown are demo placeholders until the backend runs the experiment.",
  };
}

const selectedFeatures = [
  { name: "Flow Bytes/s", importance: 0.148, reason: "Strong DDoS/DoS separator" },
  { name: "Flow Packets/s", importance: 0.132, reason: "Burst-rate signal" },
  { name: "Flow Duration", importance: 0.117, reason: "Short-lived flood flows" },
  { name: "Packet Length Std", importance: 0.096, reason: "Payload variability" },
  { name: "Average Packet Size", importance: 0.088, reason: "Protocol fingerprint" },
  { name: "Packet Length Mean", importance: 0.081, reason: "Payload profile" },
  { name: "IAT Mean", importance: 0.074, reason: "Inter-arrival timing" },
  { name: "Packet Length Variance", importance: 0.066, reason: "Spread of payloads" },
  { name: "Header Length", importance: 0.058, reason: "Protocol misuse" },
  { name: "SYN Flag Count", importance: 0.051, reason: "Handshake abuse" },
  { name: "RST Flag Count", importance: 0.045, reason: "Scan/reset behaviour" },
  { name: "Protocol Type", importance: 0.044, reason: "Categorical context" },
];

const removedFeatures = [
  { name: "Fwd Bulk Rate Avg", importance: 0.004, reason: "Near-zero variance" },
  { name: "Bwd Bulk Rate Avg", importance: 0.003, reason: "Near-zero variance" },
  { name: "ECE Flag Count", importance: 0.002, reason: "Constant in sample" },
  { name: "CWR Flag Count", importance: 0.002, reason: "Constant in sample" },
  { name: "Fwd PSH Flags", importance: 0.005, reason: "Correlated (r > 0.95)" },
  { name: "Subflow Fwd Bytes", importance: 0.006, reason: "Redundant with Flow Bytes/s" },
  { name: "Subflow Bwd Bytes", importance: 0.005, reason: "Redundant with Flow Bytes/s" },
  { name: "Idle Std", importance: 0.007, reason: "Low importance" },
];

export const mockFeatureSelection: FeatureSelectionResult = {
  source: "mock",
  note: "Demo Data",
  originalFeatures: 46,
  selectedFeatures: selectedFeatures.length,
  removedFeatures: 46 - selectedFeatures.length,
  reductionPercent: Math.round(((46 - selectedFeatures.length) / 46) * 100),
  method: "Gradient-boosting gain ranking + correlation pruning",
  selected: selectedFeatures.map((f, i) => ({ ...f, rank: i + 1 })),
  removed: removedFeatures,
};

export const mockModelComparison: ModelComparison = {
  source: "mock",
  note: "Demo Data — not research results",
  baseline: {
    accuracy: 0.941,
    precision: 0.928,
    recall: 0.905,
    macroF1: 0.864,
    fpr: 0.058,
    fnr: 0.095,
    inferenceTimeMs: 3.4,
    modelSizeMb: 18.6,
  },
  proposed: {
    accuracy: 0.962,
    precision: 0.949,
    recall: 0.951,
    macroF1: 0.918,
    fpr: 0.031,
    fnr: 0.049,
    inferenceTimeMs: 1.8,
    modelSizeMb: 7.2,
  },
  confusion: [
    {
      model: "baseline",
      matrix: [
        { actual: "Benign", predictedBenign: 9_420, predictedAttack: 580 },
        { actual: "Attack", predictedBenign: 950, predictedAttack: 9_050 },
      ],
    },
    {
      model: "proposed",
      matrix: [
        { actual: "Benign", predictedBenign: 9_690, predictedAttack: 310 },
        { actual: "Attack", predictedBenign: 490, predictedAttack: 9_510 },
      ],
    },
  ],
};

export function mockExplanation(recordId: string): ExplanationResult {
  return {
    source: "mock",
    note: "Demo Data",
    recordId,
    prediction: "Attack",
    attackFamily: "DDoS",
    confidence: 0.948,
    contributions: [
      { name: "Flow Packets/s", importance: 0.31, direction: "increases" },
      { name: "Flow Bytes/s", importance: 0.24, direction: "increases" },
      { name: "Flow Duration", importance: 0.16, direction: "decreases" },
      { name: "Packet Length Std", importance: 0.11, direction: "decreases" },
      { name: "SYN Flag Count", importance: 0.09, direction: "increases" },
      { name: "Average Packet Size", importance: 0.06, direction: "decreases" },
      { name: "Header Length", importance: 0.03, direction: "increases" },
    ],
    narrative:
      "The decision is interpreted through gradient-boosting feature importance: an extreme packet rate paired with a very short flow duration and uniform small payloads matches volumetric flooding behaviour. This is an interpretation aid, not a causal claim.",
  };
}

export const modelOptions: ModelOption[] = [
  {
    id: "xgboost",
    label: "XGBoost",
    available: true,
    note: "Prototype default (demo weights)",
  },
  { id: "lightgbm", label: "LightGBM", available: false, note: "Backend Required" },
  { id: "catboost", label: "CatBoost", available: false, note: "Backend Required" },
];
