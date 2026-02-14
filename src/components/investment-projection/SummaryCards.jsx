import StatCard from "./ui/StatCard.jsx";
import { fmt, fmtPct } from "./simulation.js";

export default function SummaryCards({ displayInvested, displayPortfolio, displayGain, displayCgt, principal, monthlyExtra, inflationAdjusted }) {
  return (
    <div style={{ display: "flex", gap: 12, marginBottom: 32, flexWrap: "wrap" }}>
      <StatCard label="Total Invested" value={fmt(displayInvested)} sub={`${fmt(principal)} + ${fmt(monthlyExtra)}/mo`} />
      <StatCard label="Portfolio Value" value={fmt(displayPortfolio)} sub={inflationAdjusted ? "Today's euros" : "Moderate scenario"} accent />
      <StatCard label="Total Gain" value={fmt(displayGain)} sub={displayInvested > 0 ? `${fmtPct((displayGain / displayInvested) * 100)} return` : ""} />
      <StatCard label="Est. CGT (10%)" value={fmt(displayCgt)} sub="€10k/yr exempt (nominal)" />
    </div>
  );
}
