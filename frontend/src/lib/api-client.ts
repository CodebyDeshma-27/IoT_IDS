/**
 * Centralised API service for the FastAPI IoT IDS backend.
 * No research/demo values are generated in this layer.
 */
export const API_BASE_URL: string =
  ((import.meta.env["VITE_API_BASE_URL"] as string | undefined) ?? "http://127.0.0.1:8000").replace(/\/$/, "");

export class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message); this.name = "ApiError"; this.status = status;
  }
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  let res: Response;
  try {
    res = await fetch(`${API_BASE_URL}${path}`, {
      ...init,
      headers: { ...(init?.body instanceof FormData ? {} : { "Content-Type": "application/json" }), ...(init?.headers ?? {}) },
    });
  } catch {
    throw new ApiError(`Cannot reach the backend at ${API_BASE_URL}`, 0);
  }
  if (!res.ok) {
    let detail = "";
    try { detail = JSON.stringify(await res.json()); } catch {}
    throw new ApiError(`${init?.method ?? "GET"} ${path} failed (${res.status}) ${detail}`, res.status);
  }
  return (await res.json()) as T;
}

export type FeatureVector = Record<string, number>;
export interface HealthResponse { status?: string; [key: string]: unknown; }
export interface PredictionResponse {
  prediction?: string; label?: string; attack_family?: string; confidence?: number;
  confidence_percent?: number; probabilities?: Record<string, number>;
  inference_time_ms?: number; [key: string]: unknown;
}
export interface RecordsResponse { status?: string; records?: Record<string, unknown>[]; [key: string]: unknown; }
export interface BatchResponse {
  status: string; filename: string; total_records: number; benign_count: number; attack_count: number;
  benign_percentage: number; attack_percentage: number; attack_distribution: Record<string, number>;
  selected_feature_count: number; selected_features: string[]; processing_time_ms: number;
  throughput_samples_per_second: number; preview_count?: number; preview_records?: Record<string, unknown>[];
  records?: Record<string, unknown>[];
}

export const api = {
  health: () => request<HealthResponse>("/health"),
  features: () => request<unknown>("/features"),
  performance: () => request<RecordsResponse>("/performance"),
  unseenEvaluation: () => request<RecordsResponse>("/unseen-evaluation"),
  reliability: () => request<RecordsResponse>("/reliability"),
  summary: () => request<Record<string, unknown>>("/summary"),
  predict: (features: FeatureVector) =>
    request<PredictionResponse>("/predict", { method: "POST", body: JSON.stringify({ features }) }),
  predictBatch: (file: File) => {
    const form = new FormData();
    form.append("file", file);
    return request<BatchResponse>("/predict-batch", { method: "POST", body: form });
  },
};

export const apiQueryKeys = {
  health: ["api","health"] as const, features: ["api","features"] as const,
  performance: ["api","performance"] as const, unseenEvaluation: ["api","unseen-evaluation"] as const,
  reliability: ["api","reliability"] as const, summary: ["api","summary"] as const,
  prediction: ["api","predict","latest"] as const, batch: ["api","predict-batch","latest"] as const,
};
