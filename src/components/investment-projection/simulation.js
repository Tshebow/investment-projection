import { TOB_CAPS, INSTRUMENTS } from "./constants.js";

export const fmt = (n) =>
  new Intl.NumberFormat("de-BE", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(n);

export const fmtPct = (n) => `${n.toFixed(1)}%`;

export function computeTOB(amount, transactionTax) {
  const cap = TOB_CAPS[transactionTax] ?? Infinity;
  return Math.min(amount * transactionTax, cap);
}

export function simulate({
  principal,
  dcaMonths,
  annualReturn,
  transactionTax,
  ongoingCost,
  years,
  monthlyExtra = 0,
  startAge = 35,
  // Legacy aliases — callers can use either name
  tobRate,
  ter,
}) {
  const txTax = transactionTax ?? tobRate;
  const ongoing = ongoingCost ?? ter;
  const monthlyReturn = Math.pow(1 + annualReturn - ongoing, 1 / 12) - 1;
  const monthlyDCA = principal / dcaMonths;
  const data = [];
  let invested = 0;
  let portfolio = 0;
  let totalTOB = 0;

  for (let m = 0; m <= years * 12; m++) {
    const year = m / 12;
    if (m > 0) {
      portfolio *= (1 + monthlyReturn);
      let contribution = monthlyExtra;
      if (m <= dcaMonths) contribution += monthlyDCA;

      if (contribution > 0) {
        const tob = computeTOB(contribution, txTax);
        totalTOB += tob;
        portfolio += contribution - tob;
        invested += contribution;
      }
    }
    if (m % 12 === 0) {
      const gain = portfolio - invested;
      data.push({
        year: Math.round(year),
        age: startAge + Math.round(year),
        portfolio: Math.round(portfolio),
        invested: Math.round(invested),
        gain: Math.round(gain),
        totalTOB: Math.round(totalTOB),
      });
    }
  }
  return data;
}

export function simulatePortfolio({ etfAllocation, principal, dcaMonths, annualReturn, years, monthlyExtra, startAge }) {
  const perEtf = etfAllocation.map(({ key, pct }) => {
    const etf = INSTRUMENTS[key];
    const fraction = pct / 100;
    return simulate({
      principal: principal * fraction,
      dcaMonths,
      annualReturn,
      transactionTax: etf.costs.transactionTax,
      ongoingCost: etf.costs.ongoingCost,
      years,
      monthlyExtra: monthlyExtra * fraction,
      startAge,
    });
  });

  // Aggregate: sum across all ETFs per year
  return perEtf[0].map((_, i) => {
    const row = { year: perEtf[0][i].year, age: perEtf[0][i].age, portfolio: 0, invested: 0, gain: 0, totalTOB: 0 };
    for (const etfData of perEtf) {
      row.portfolio += etfData[i].portfolio;
      row.invested += etfData[i].invested;
      row.gain += etfData[i].gain;
      row.totalTOB += etfData[i].totalTOB;
    }
    row.portfolio = Math.round(row.portfolio);
    row.invested = Math.round(row.invested);
    row.gain = Math.round(row.gain);
    row.totalTOB = Math.round(row.totalTOB);
    return row;
  });
}

export function computeCGT(gain, { rate = 0.10, exemption = 10000 } = {}) {
  if (gain <= exemption) return 0;
  return (gain - exemption) * rate;
}
