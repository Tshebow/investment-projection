export const SCENARIOS = {
  conservative: { label: "Conservative", rate: 0.05, color: "#64748b" },
  moderate: { label: "Moderate", rate: 0.07, color: "#0d9488" },
  historical: { label: "Historical avg", rate: 0.10, color: "#2563eb" },
};

export const INSTRUMENTS = {
  iwda: {
    label: "IWDA",
    type: "etf",
    costs: { transactionTax: 0.0012, transactionTaxCap: 1300, ongoingCost: 0.002 },
    tax: { cgtRate: 0.10, cgtExemption: 10000, reynders: false },
    meta: { isin: "IE00B4L5Y983", holdings: "~1,500" },
  },
  vwce: {
    label: "VWCE",
    type: "etf",
    costs: { transactionTax: 0.0132, transactionTaxCap: 4000, ongoingCost: 0.0019 },
    tax: { cgtRate: 0.10, cgtExemption: 10000, reynders: false },
    meta: { isin: "IE00BK5BQT80", holdings: "~3,800" },
  },
  iwda_emim: {
    label: "IWDA+EMIM",
    type: "etf",
    costs: { transactionTax: 0.0012, transactionTaxCap: 1300, ongoingCost: 0.002 },
    tax: { cgtRate: 0.10, cgtExemption: 10000, reynders: false },
    meta: { isin: "IE00B4L5Y983 + IE00BKM4GZ66", holdings: "~1,500 + ~3,200" },
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

export const PROFILE_TEMPLATES = [
  { key: "personal",    name: "My Portfolio",  defaults: { principal: 70000,  startAge: 35, years: 25, monthlyExtra: 500, dcaIdx: 2, etfKey: "iwda", inflationAdjusted: false, inflationRate: 2.0 }},
  { key: "newborn",     name: "Newborn Child", defaults: { principal: 5000,   startAge: 0,  years: 60, monthlyExtra: 100, dcaIdx: 2, etfKey: "iwda", inflationAdjusted: false, inflationRate: 2.0 }},
  { key: "young_adult", name: "Young Adult",   defaults: { principal: 15000,  startAge: 25, years: 35, monthlyExtra: 300, dcaIdx: 2, etfKey: "iwda", inflationAdjusted: false, inflationRate: 2.0 }},
  { key: "mid_career",  name: "Mid-Career",    defaults: { principal: 100000, startAge: 40, years: 20, monthlyExtra: 800, dcaIdx: 2, etfKey: "iwda", inflationAdjusted: false, inflationRate: 2.0 }},
];

export const DCA_OPTIONS = [
  { months: 1, label: "Lump sum" },
  { months: 6, label: "6 months" },
  { months: 12, label: "12 months" },
  { months: 24, label: "24 months" },
  { months: 36, label: "36 months" },
];
