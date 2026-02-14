import { XAxis, YAxis, Tooltip, ResponsiveContainer, Area, AreaChart, CartesianGrid } from "recharts";
import ChartTooltip from "../ChartTooltip.jsx";
import { fmt } from "../simulation.js";
import { colors, fonts } from "../theme.js";

export default function GrowthChart({ chartData, results, displayPortfolio, deflate, years, startAge, inflationAdjusted, inflationRate }) {
  return (
    <div style={{
      background: colors.bg.cardSubtle,
      border: `1px solid ${colors.border.faint}`,
      borderRadius: 16,
      padding: "24px 16px 16px",
    }}>
      <div style={{ fontSize: 16, fontWeight: 700, fontFamily: fonts.heading, marginBottom: 4, paddingLeft: 8 }}>Portfolio Growth — 3 Scenarios</div>
      <div style={{ fontSize: 12, color: colors.text.muted, marginBottom: 20, paddingLeft: 8 }}>
        Conservative (5%), Moderate (7%), Historical (10%) annual returns after TER
        {inflationAdjusted && <span style={{ color: colors.warning }}> · adjusted for {inflationRate}% inflation (today&apos;s euros)</span>}
      </div>
      <ResponsiveContainer width="100%" height={340}>
        <AreaChart data={chartData} margin={{ top: 10, right: 16, bottom: 0, left: 8 }}>
          <defs>
            <linearGradient id="gradHistorical" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={colors.chart.historical} stopOpacity={0.25} />
              <stop offset="100%" stopColor={colors.chart.historical} stopOpacity={0} />
            </linearGradient>
            <linearGradient id="gradModerate" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={colors.chart.moderate} stopOpacity={0.2} />
              <stop offset="100%" stopColor={colors.chart.moderate} stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke={colors.chart.grid} />
          <XAxis dataKey="year" tick={{ fill: colors.text.muted, fontSize: 12 }} tickLine={false} axisLine={{ stroke: colors.border.medium }} />
          <YAxis tick={{ fill: colors.text.muted, fontSize: 11 }} tickLine={false} axisLine={false} tickFormatter={v => v >= 1000000 ? `${(v/1000000).toFixed(1)}M` : v >= 1000 ? `${Math.round(v/1000)}k` : v} />
          <Tooltip content={<ChartTooltip startAge={startAge} />} />
          <Area type="monotone" dataKey="invested" name="Total Invested" stroke={colors.chart.invested} strokeWidth={2} fill={colors.chart.investedFill} strokeDasharray="6 3" />
          <Area type="monotone" dataKey="portfolio_conservative" name="Conservative (5%)" stroke={colors.chart.conservative} strokeWidth={1.5} fill="none" />
          <Area type="monotone" dataKey="portfolio_moderate" name="Moderate (7%)" stroke={colors.chart.moderate} strokeWidth={2.5} fill="url(#gradModerate)" />
          <Area type="monotone" dataKey="portfolio_historical" name="Historical (10%)" stroke={colors.chart.historical} strokeWidth={2} fill="url(#gradHistorical)" />
        </AreaChart>
      </ResponsiveContainer>
      <div style={{ display: "flex", gap: 20, justifyContent: "center", marginTop: 12, flexWrap: "wrap" }}>
        {[
          { label: "Invested", color: colors.chart.invested, dash: true },
          { label: `Conservative → ${fmt(Math.round(deflate(results.conservative[results.conservative.length-1].portfolio, years)))}`, color: colors.chart.conservative },
          { label: `Moderate → ${fmt(displayPortfolio)}`, color: colors.chart.moderate },
          { label: `Historical → ${fmt(Math.round(deflate(results.historical[results.historical.length-1].portfolio, years)))}`, color: colors.chart.historical },
        ].map((l, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <div style={{ width: 16, height: 2, background: l.color, borderRadius: 1, ...(l.dash ? { backgroundImage: `repeating-linear-gradient(90deg, ${l.color} 0 4px, transparent 4px 8px)`, background: "none" } : {}) }} />
            <span style={{ fontSize: 11, color: colors.text.secondary }}>{l.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
