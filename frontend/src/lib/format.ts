export const compactNumber = (n: number) =>
  new Intl.NumberFormat("en-US", { notation: "compact", maximumFractionDigits: 1 }).format(n);

export const fullNumber = (n: number) => new Intl.NumberFormat("en-US").format(n);

export const percent = (n: number, digits = 1) => `${(n * 100).toFixed(digits)}%`;

export const decimal = (n: number, digits = 3) => n.toFixed(digits);
