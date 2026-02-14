import { fmt } from "./simulation.js";
import { colors, fonts } from "./theme.js";

export default function ChartTooltip({ active, payload, label, startAge = 35 }) {
  if (!active || !payload?.length) return null;
  return (
    <div style={{
      background: "#1e293b",
      border: `1px solid ${colors.border.medium}`,
      borderRadius: 10,
      padding: "12px 16px",
      fontFamily: fonts.body,
      boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
    }}>
      <div style={{ color: colors.text.secondary, fontSize: 12, marginBottom: 8 }}>Age {startAge + label} · Year {label}</div>
      {payload.map((p, i) => (
        <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 3 }}>
          <div style={{ width: 8, height: 8, borderRadius: 4, background: p.color }} />
          <span style={{ color: colors.text.highlight, fontSize: 13 }}>{p.name}: <strong style={{ color: colors.text.primary }}>{fmt(p.value)}</strong></span>
        </div>
      ))}
    </div>
  );
}
