export const SCENARIOS = {
  conservative: { label: "Conservative", rate: 0.05, color: "#64748b" },
  moderate: { label: "Moderate", rate: 0.07, color: "#0d9488" },
  historical: { label: "Historical avg", rate: 0.10, color: "#2563eb" },
};

export const INSTRUMENTS = {
  iwda: {
    label: "IWDA",
    type: "etf",
    role: "core",
    costs: { transactionTax: 0.0012, transactionTaxCap: 1300, ongoingCost: 0.002 },
    tax: { cgtRate: 0.10, cgtExemption: 10000, reynders: false },
    meta: { isin: "IE00B4L5Y983", holdings: "~1,500" },
  },
  vwce: {
    label: "VWCE",
    type: "etf",
    role: "core",
    costs: { transactionTax: 0.0132, transactionTaxCap: 4000, ongoingCost: 0.0019 },
    tax: { cgtRate: 0.10, cgtExemption: 10000, reynders: false },
    meta: { isin: "IE00BK5BQT80", holdings: "~3,800" },
  },
  emim: {
    label: "EMIM",
    type: "etf",
    role: "core",
    costs: { transactionTax: 0.0012, transactionTaxCap: 1300, ongoingCost: 0.0018 },
    tax: { cgtRate: 0.10, cgtExemption: 10000, reynders: false },
    meta: { isin: "IE00BKM4GZ66", holdings: "~3,200" },
  },
  cspx: {
    label: "CSPX",
    type: "etf",
    role: "core",
    costs: { transactionTax: 0.0012, transactionTaxCap: 1300, ongoingCost: 0.0007 },
    tax: { cgtRate: 0.10, cgtExemption: 10000, reynders: false },
    meta: { isin: "IE00B5BMR087", holdings: "~503" },
  },
  wsml: {
    label: "WSML",
    type: "etf",
    role: "satellite",
    costs: { transactionTax: 0.0012, transactionTaxCap: 1300, ongoingCost: 0.0035 },
    tax: { cgtRate: 0.10, cgtExemption: 10000, reynders: false },
    meta: { isin: "IE00BF4RFH31", holdings: "~3,400" },
  },
  eqqq: {
    label: "EQQQ",
    type: "etf",
    role: "satellite",
    costs: { transactionTax: 0.0012, transactionTaxCap: 1300, ongoingCost: 0.003 },
    tax: { cgtRate: 0.10, cgtExemption: 10000, reynders: false },
    meta: { isin: "IE00BFZXGZ54", holdings: "~100" },
  },
  veur: {
    label: "VEUR",
    type: "etf",
    role: "satellite",
    costs: { transactionTax: 0.0012, transactionTaxCap: 1300, ongoingCost: 0.001 },
    tax: { cgtRate: 0.10, cgtExemption: 10000, reynders: false },
    meta: { isin: "IE00BK5BQX27", holdings: "~550" },
  },
};

// Backward compat — filtered view of ETF-type instruments
export const ETFS = Object.fromEntries(
  Object.entries(INSTRUMENTS)
    .filter(([, v]) => v.type === "etf")
    .map(([k, v]) => [k, { label: v.label, tob: v.costs.transactionTax, ter: v.costs.ongoingCost }])
);

export const TOB_CAPS = {
  0.0012: 1300,
  0.0035: 1600,
  0.0132: 4000,
};

export const ALLOCATION_PRESETS = [
  { key: "iwda_only",   label: "100% IWDA",   allocation: [{ key: "iwda", pct: 100 }] },
  { key: "vwce_only",   label: "100% VWCE",   allocation: [{ key: "vwce", pct: 100 }] },
  { key: "iwda_emim",   label: "IWDA + EMIM", allocation: [{ key: "iwda", pct: 88 }, { key: "emim", pct: 12 }] },
  { key: "diversified",  label: "Diversified",  allocation: [{ key: "iwda", pct: 60 }, { key: "emim", pct: 10 }, { key: "cspx", pct: 10 }, { key: "wsml", pct: 10 }, { key: "eqqq", pct: 10 }] },
];

export const PROFILE_TEMPLATES = [
  { key: "personal",    name: "My Portfolio",  defaults: { principal: 70000,  startAge: 35, years: 25, monthlyExtra: 500, dcaIdx: 2, etfAllocation: [{ key: "iwda", pct: 100 }], inflationAdjusted: false, inflationRate: 2.0 }},
  { key: "newborn",     name: "Newborn Child", defaults: { principal: 5000,   startAge: 0,  years: 60, monthlyExtra: 100, dcaIdx: 2, etfAllocation: [{ key: "iwda", pct: 100 }], inflationAdjusted: false, inflationRate: 2.0 }},
  { key: "young_adult", name: "Young Adult",   defaults: { principal: 15000,  startAge: 25, years: 35, monthlyExtra: 300, dcaIdx: 2, etfAllocation: [{ key: "iwda", pct: 100 }], inflationAdjusted: false, inflationRate: 2.0 }},
  { key: "mid_career",  name: "Mid-Career",    defaults: { principal: 100000, startAge: 40, years: 20, monthlyExtra: 800, dcaIdx: 2, etfAllocation: [{ key: "iwda", pct: 100 }], inflationAdjusted: false, inflationRate: 2.0 }},
];

export const DCA_OPTIONS = [
  { months: 1, label: "Lump sum" },
  { months: 6, label: "6 months" },
  { months: 12, label: "12 months" },
  { months: 24, label: "24 months" },
  { months: 36, label: "36 months" },
];
