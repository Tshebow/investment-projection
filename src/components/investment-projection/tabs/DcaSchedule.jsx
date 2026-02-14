import { DCA_OPTIONS, ETFS } from "../constants.js";
import { fmt, computeTOB } from "../simulation.js";
import { colors, fonts } from "../theme.js";

export default function DcaSchedule({ dcaSchedule, dcaMonths, dcaIdx, principal, etfKey, monthlyExtra, etf }) {
  return (
    <div style={{
      background: colors.bg.cardSubtle,
      border: `1px solid ${colors.border.faint}`,
      borderRadius: 16,
      padding: 24,
    }}>
      <div style={{ fontSize: 16, fontWeight: 700, fontFamily: fonts.heading, marginBottom: 4 }}>
        DCA Deployment: {fmt(principal)} over {DCA_OPTIONS[dcaIdx].label}
      </div>
      <div style={{ fontSize: 12, color: colors.text.muted, marginBottom: 16 }}>
        {fmt(Math.round(principal / dcaMonths))}/month into {ETFS[etfKey].label} + {fmt(monthlyExtra)}/month ongoing contribution
      </div>

      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontFamily: fonts.body, fontSize: 13 }}>
          <thead>
            <tr style={{ borderBottom: `1px solid ${colors.border.medium}` }}>
              {["Month", "DCA Amount", "Extra", "TOB Cost", "Cumulative Deployed"].map(h => (
                <th key={h} style={{ padding: "10px 12px", textAlign: "right", color: colors.text.muted, fontWeight: 600, fontSize: 11, textTransform: "uppercase", letterSpacing: "0.05em" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {dcaSchedule.slice(0, 12).map((r, i) => (
              <tr key={i} style={{ borderBottom: `1px solid ${colors.border.row}` }}>
                <td style={{ padding: "9px 12px", textAlign: "right", color: colors.text.secondary }}>{r.month}</td>
                <td style={{ padding: "9px 12px", textAlign: "right", color: colors.text.primary, fontWeight: 500 }}>{fmt(r.amount)}</td>
                <td style={{ padding: "9px 12px", textAlign: "right", color: colors.accent.tealLight }}>+{fmt(r.extra)}</td>
                <td style={{ padding: "9px 12px", textAlign: "right", color: colors.dangerText, fontSize: 12 }}>-{fmt(r.tob)}</td>
                <td style={{ padding: "9px 12px", textAlign: "right", color: colors.text.primary, fontWeight: 600 }}>{fmt(r.cumulative)}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {dcaMonths > 12 && (
          <div style={{ padding: "12px", textAlign: "center", color: colors.text.muted, fontSize: 12 }}>
            ... continues for {dcaMonths - 12} more months
          </div>
        )}
      </div>

      <div style={{
        marginTop: 20,
        padding: 16,
        background: colors.accent.tealSubtle,
        border: `1px solid ${colors.accent.tealSubtleBorder}`,
        borderRadius: 10,
        fontSize: 13,
        color: colors.text.secondary,
        lineHeight: 1.6,
      }}>
        <strong style={{ color: colors.accent.tealLight }}>Total TOB on initial {fmt(principal)} deployment:</strong> {fmt(Math.round(computeTOB(principal, etf.tob)))}
        <br />
        <strong style={{ color: colors.accent.tealLight }}>Monthly TOB on {fmt(monthlyExtra)} contribution:</strong> {fmt(Math.round(computeTOB(monthlyExtra, etf.tob) * 100) / 100)}/month
        <br />
        <span style={{ fontSize: 12, color: colors.text.dimmed, marginTop: 4, display: "block" }}>
          After the DCA period ends, only your {fmt(monthlyExtra)}/month ongoing contribution continues.
        </span>
      </div>
    </div>
  );
}
