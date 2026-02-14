export const fmt = (n) =>
  new Intl.NumberFormat("de-BE", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(n);

export const fmtPct = (n) => `${n.toFixed(1)}%`;

export function simulate({ principal, dcaMonths, annualReturn, tobRate, ter, years, monthlyExtra = 0 }) {
  const monthlyReturn = Math.pow(1 + annualReturn - ter, 1 / 12) - 1;
  const monthlyDCA = principal / dcaMonths;
  const data = [];
  let invested = 0;
  let portfolio = 0;
  let totalTOB = 0;

  for (let m = 0; m <= years * 12; m++) {
    const year = m / 12;
    if (m > 0) {
      portfolio *= (1 + monthlyReturn);
      let contribution = 0;
      if (m <= dcaMonths) contribution += monthlyDCA;
      if (m > dcaMonths) contribution += monthlyExtra;
      else contribution += monthlyExtra;

      if (contribution > 0) {
        const tob = contribution * tobRate;
        totalTOB += tob;
        portfolio += contribution - tob;
        invested += contribution;
      }
    }
    if (m % 12 === 0) {
      const gain = portfolio - invested;
      data.push({
        year: Math.round(year),
        age: 35 + Math.round(year),
        portfolio: Math.round(portfolio),
        invested: Math.round(invested),
        gain: Math.round(gain),
        totalTOB: Math.round(totalTOB),
      });
    }
  }
  return data;
}

export function computeCGT(gain, exemption = 10000) {
  if (gain <= exemption) return 0;
  return (gain - exemption) * 0.10;
}
