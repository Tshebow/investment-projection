import { colors, fonts } from "../theme.js";

export default function StatCard({ label, value, sub, accent = false }) {
  return (
    <div style={{
      background: accent ? colors.accent.tealGrad : colors.bg.card,
      border: accent ? `1px solid ${colors.accent.tealBorder}` : `1px solid ${colors.border.subtle}`,
      borderRadius: 12,
      padding: "16px 18px",
      flex: 1,
      minWidth: 140,
    }}>
      <div style={{ fontFamily: fonts.body, fontSize: 11, color: colors.text.muted, fontWeight: 600, letterSpacing: "0.05em", textTransform: "uppercase", marginBottom: 6 }}>{label}</div>
      <div style={{ fontFamily: fonts.heading, fontSize: 22, color: accent ? colors.accent.tealLight : colors.text.primary, fontWeight: 700 }}>{value}</div>
      {sub && <div style={{ fontFamily: fonts.body, fontSize: 12, color: colors.text.muted, marginTop: 4 }}>{sub}</div>}
    </div>
  );
}
