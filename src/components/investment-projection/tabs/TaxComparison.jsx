import { XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, BarChart, Bar } from "recharts";
import ChartTooltip from "../ChartTooltip.jsx";
import { fmt } from "../simulation.js";
import { colors, fonts } from "../theme.js";

export default function TaxComparison({ taxCompData, years, startAge, finalModerateGain }) {
  return (
    <div style={{
      background: colors.bg.cardSubtle,
      border: `1px solid ${colors.border.faint}`,
      borderRadius: 16,
      padding: 24,
    }}>
      <div style={{ fontSize: 16, fontWeight: 700, fontFamily: fonts.heading, marginBottom: 4 }}>
        ETF Tax Impact Over {years} Years
      </div>
      <div style={{ fontSize: 12, color: colors.text.muted, marginBottom: 20 }}>
        Moderate scenario (7%/yr) — all ETFs compared at equal contributions
      </div>

      <ResponsiveContainer width="100%" height={280}>
        <BarChart data={taxCompData} margin={{ top: 10, right: 16, bottom: 0, left: 8 }}>
          <CartesianGrid strokeDasharray="3 3" stroke={colors.chart.grid} />
          <XAxis dataKey="name" tick={{ fill: colors.text.secondary, fontSize: 13 }} tickLine={false} axisLine={{ stroke: colors.border.medium }} />
          <YAxis tick={{ fill: colors.text.muted, fontSize: 11 }} tickLine={false} axisLine={false} tickFormatter={v => v >= 1000 ? `${Math.round(v/1000)}k` : v} />
          <Tooltip content={<ChartTooltip startAge={startAge} />} />
          <Bar dataKey="totalTOB" name="Total TOB Paid" fill={colors.warning} radius={[4, 4, 0, 0]} />
          <Bar dataKey="cgt" name="Est. CGT (lump exit)" fill={colors.danger} radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>

      <div style={{ marginTop: 20 }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontFamily: fonts.body, fontSize: 13 }}>
          <thead>
            <tr style={{ borderBottom: `1px solid ${colors.border.medium}` }}>
              {["ETF", "Gross Value", "Total TOB", "Est. CGT", "Net After Tax"].map(h => (
                <th key={h} style={{ padding: "10px 12px", textAlign: "right", color: colors.text.muted, fontWeight: 600, fontSize: 11, textTransform: "uppercase", letterSpacing: "0.05em" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {taxCompData.map((r, i) => (
              <tr key={i} style={{ borderBottom: `1px solid ${colors.border.row}` }}>
                <td style={{ padding: "10px 12px", textAlign: "right", color: colors.text.primary, fontWeight: 600 }}>{r.name}</td>
                <td style={{ padding: "10px 12px", textAlign: "right", color: colors.text.secondary }}>{fmt(r.grossPortfolio)}</td>
                <td style={{ padding: "10px 12px", textAlign: "right", color: colors.warning }}>-{fmt(r.totalTOB)}</td>
                <td style={{ padding: "10px 12px", textAlign: "right", color: colors.danger }}>-{fmt(r.cgt)}</td>
                <td style={{ padding: "10px 12px", textAlign: "right", color: colors.accent.tealLight, fontWeight: 700, fontSize: 14 }}>{fmt(r.netPortfolio)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div style={{
        marginTop: 20,
        padding: 16,
        background: colors.dangerBg,
        border: `1px solid ${colors.dangerBorder}`,
        borderRadius: 10,
        fontSize: 12,
        color: colors.text.secondary,
        lineHeight: 1.7,
      }}>
        <strong style={{ color: colors.dangerLight }}>CGT note:</strong> The estimate above assumes you sell everything in one year (worst case). In practice, you&apos;d spread withdrawals across multiple years to use the €10k/yr exemption. With {Math.ceil(finalModerateGain / 10000)} years of staggered selling, your effective CGT could be <strong style={{ color: colors.accent.tealLight }}>significantly lower or even €0</strong>.
        <br /><br />
        <strong style={{ color: colors.dangerLight }}>TOB difference IWDA vs VWCE:</strong> Over {years} years, choosing IWDA over VWCE saves you <strong style={{ color: colors.accent.tealLight }}>{fmt(Math.abs((taxCompData.find(d => d.name === "VWCE")?.totalTOB ?? 0) - (taxCompData.find(d => d.name === "IWDA")?.totalTOB ?? 0)))}</strong> in transaction taxes alone.
      </div>
    </div>
  );
}
