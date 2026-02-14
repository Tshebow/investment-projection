export const SCENARIOS = {
  conservative: { label: "Conservative", rate: 0.05, color: "#64748b" },
  moderate: { label: "Moderate", rate: 0.07, color: "#0d9488" },
  historical: { label: "Historical avg", rate: 0.10, color: "#2563eb" },
};

export const ETFS = {
  iwda: { label: "IWDA", tob: 0.0012, ter: 0.002 },
  vwce: { label: "VWCE", tob: 0.0132, ter: 0.0019 },
  iwda_emim: { label: "IWDA+EMIM", tob: 0.0012, ter: 0.002 },
};

export const DCA_OPTIONS = [
  { months: 1, label: "Lump sum" },
  { months: 6, label: "6 months" },
  { months: 12, label: "12 months" },
  { months: 24, label: "24 months" },
  { months: 36, label: "36 months" },
];
