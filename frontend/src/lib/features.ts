/**
 * The 20 selected network-flow features consumed by the trained XGBoost model.
 * Keys match the names the backend expects in POST /predict.
 */

export interface SelectedFeature {
  key: string;
  label: string;
  group: "Flow statistics" | "Protocol" | "TCP flags";
  hint?: string;
  step?: number;
}

export const SELECTED_FEATURES: SelectedFeature[] = [
  { key: "Protocol Type", label: "Protocol Type", group: "Protocol", hint: "Numeric protocol code", step: 1 },
  { key: "Number", label: "Number", group: "Flow statistics" },
  { key: "Tot size", label: "Tot size", group: "Flow statistics", hint: "Total packet size" },
  { key: "Tot sum", label: "Tot sum", group: "Flow statistics" },
  { key: "fin_count", label: "fin_count", group: "TCP flags", step: 1 },
  { key: "Min", label: "Min", group: "Flow statistics" },
  { key: "UDP", label: "UDP", group: "Protocol", hint: "0 or 1", step: 1 },
  { key: "Variance", label: "Variance", group: "Flow statistics" },
  { key: "HTTPS", label: "HTTPS", group: "Protocol", hint: "0 or 1", step: 1 },
  { key: "AVG", label: "AVG", group: "Flow statistics" },
  { key: "SSH", label: "SSH", group: "Protocol", hint: "0 or 1", step: 1 },
  { key: "syn_count", label: "syn_count", group: "TCP flags", step: 1 },
  { key: "syn_flag_number", label: "syn_flag_number", group: "TCP flags", step: 1 },
  { key: "TCP", label: "TCP", group: "Protocol", hint: "0 or 1", step: 1 },
  { key: "fin_flag_number", label: "fin_flag_number", group: "TCP flags", step: 1 },
  { key: "rst_count", label: "rst_count", group: "TCP flags", step: 1 },
  { key: "Std", label: "Std", group: "Flow statistics" },
  { key: "psh_flag_number", label: "psh_flag_number", group: "TCP flags", step: 1 },
  { key: "ack_count", label: "ack_count", group: "TCP flags", step: 1 },
  { key: "Header_Length", label: "Header_Length", group: "Flow statistics" },
];

export const FEATURE_GROUPS = ["Flow statistics", "Protocol", "TCP flags"] as const;

export type FeatureFormValues = Record<string, string>;

export const emptyFeatureValues = (): FeatureFormValues =>
  Object.fromEntries(SELECTED_FEATURES.map((f) => [f.key, ""]));

/**
 * Example input vectors only. These are inputs you can submit to the model —
 * they carry no pre-computed prediction of any kind.
 */
export interface FeatureSample {
  id: string;
  label: string;
  description: string;
  values: Record<string, number>;
}

export const FEATURE_SAMPLES: FeatureSample[] = [
  {
    id: "low-rate-tcp",
    label: "Low-rate TCP flow",
    description: "Long-lived TCP session with mixed flags and moderate packet sizes.",
    values: {
      "Protocol Type": 6,
      Number: 9.5,
      "Tot size": 84.2,
      "Tot sum": 512.4,
      fin_count: 1,
      Min: 54,
      UDP: 0,
      Variance: 220.7,
      HTTPS: 1,
      AVG: 82.6,
      SSH: 0,
      syn_count: 1,
      syn_flag_number: 1,
      TCP: 1,
      fin_flag_number: 1,
      rst_count: 0,
      Std: 14.8,
      psh_flag_number: 1,
      ack_count: 6,
      Header_Length: 54.4,
    },
  },
  {
    id: "high-rate-udp",
    label: "High-rate UDP flow",
    description: "Short uniform UDP packets at very high volume, no TCP flags set.",
    values: {
      "Protocol Type": 17,
      Number: 9.5,
      "Tot size": 50,
      "Tot sum": 4820.5,
      fin_count: 0,
      Min: 50,
      UDP: 1,
      Variance: 0,
      HTTPS: 0,
      AVG: 50,
      SSH: 0,
      syn_count: 0,
      syn_flag_number: 0,
      TCP: 0,
      fin_flag_number: 0,
      rst_count: 0,
      Std: 0,
      psh_flag_number: 0,
      ack_count: 0,
      Header_Length: 8,
    },
  },
  {
    id: "syn-heavy-tcp",
    label: "SYN-heavy TCP flow",
    description: "Repeated handshake attempts with minimal payload and resets.",
    values: {
      "Protocol Type": 6,
      Number: 9.5,
      "Tot size": 54,
      "Tot sum": 1620,
      fin_count: 0,
      Min: 54,
      UDP: 0,
      Variance: 1.4,
      HTTPS: 0,
      AVG: 54,
      SSH: 0,
      syn_count: 30,
      syn_flag_number: 1,
      TCP: 1,
      fin_flag_number: 0,
      rst_count: 12,
      Std: 1.2,
      psh_flag_number: 0,
      ack_count: 0,
      Header_Length: 40,
    },
  },
];
