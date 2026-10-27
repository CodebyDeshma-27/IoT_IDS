/**
 * Tiny shared store for the Live IDS mode: holds the last submitted feature
 * vector and the last backend prediction so the Traffic Analysis and
 * Prediction Result pages stay in sync. No results are ever synthesised here.
 */
import { useSyncExternalStore } from "react";
import type { FeatureVector, PredictionResponse } from "@/lib/api-client";

export interface LiveState {
  submitted: FeatureVector | null;
  result: PredictionResponse | null;
  error: string | null;
  pending: boolean;
  at: string | null;
}

let state: LiveState = { submitted: null, result: null, error: null, pending: false, at: null };
const listeners = new Set<() => void>();

function emit() {
  listeners.forEach((l) => l());
}

export function setLiveState(patch: Partial<LiveState>) {
  state = { ...state, ...patch };
  emit();
}

export function useLiveState(): LiveState {
  return useSyncExternalStore(
    (cb) => {
      listeners.add(cb);
      return () => listeners.delete(cb);
    },
    () => state,
    () => state,
  );
}
