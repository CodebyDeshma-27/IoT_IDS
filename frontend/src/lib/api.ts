/**
 * Data access layer.
 *
 * Today every function resolves mock data. When the Python/FastAPI service is
 * ready, set VITE_IDS_API_URL and each function will call the matching REST
 * endpoint instead — component code and TanStack Query keys stay the same.
 */
import type {
  AttackFamily,
  DatasetSummary,
  DetectionSummary,
  ExplanationResult,
  FeatureSelectionResult,
  HoldoutEvaluation,
  ModelComparison,
  PredictionRunSummary,
} from "@/types/ids";
import {
  mockDataset,
  mockDetection,
  mockExplanation,
  mockFeatureSelection,
  mockHoldout,
  mockModelComparison,
  mockPredictionRun,
} from "./mock-data";

export const API_BASE_URL: string | undefined = import.meta.env["VITE_IDS_API_URL"];

export const isBackendConfigured = Boolean(API_BASE_URL);

async function get<T>(path: string, fallback: T): Promise<T> {
  if (!API_BASE_URL) return fallback;
  const res = await fetch(`${API_BASE_URL}${path}`);
  if (!res.ok) throw new Error(`Request failed: ${path} (${res.status})`);
  return (await res.json()) as T;
}

/** GET /dataset/summary */
export const fetchDatasetSummary = (): Promise<DatasetSummary> =>
  get("/dataset/summary", mockDataset);

/** GET /metrics/detection */
export const fetchDetectionSummary = (): Promise<DetectionSummary> =>
  get("/metrics/detection", mockDetection);

/** POST /predict  (CSV upload) */
export const fetchPredictionRun = (): Promise<PredictionRunSummary> =>
  get("/predict/latest", mockPredictionRun);

/** GET /evaluation/holdout?family=Mirai */
export const fetchHoldoutEvaluation = (family: AttackFamily): Promise<HoldoutEvaluation> =>
  get(`/evaluation/holdout?family=${encodeURIComponent(family)}`, mockHoldout(family));

/** GET /features/selection */
export const fetchFeatureSelection = (): Promise<FeatureSelectionResult> =>
  get("/features/selection", mockFeatureSelection);

/** GET /models/comparison */
export const fetchModelComparison = (): Promise<ModelComparison> =>
  get("/models/comparison", mockModelComparison);

/** GET /explain/{recordId} */
export const fetchExplanation = (recordId: string): Promise<ExplanationResult> =>
  get(`/explain/${recordId}`, mockExplanation(recordId));

export const queryKeys = {
  dataset: ["dataset", "summary"] as const,
  detection: ["metrics", "detection"] as const,
  prediction: ["predict", "latest"] as const,
  holdout: (family: AttackFamily) => ["evaluation", "holdout", family] as const,
  features: ["features", "selection"] as const,
  models: ["models", "comparison"] as const,
  explanation: (id: string) => ["explain", id] as const,
};
