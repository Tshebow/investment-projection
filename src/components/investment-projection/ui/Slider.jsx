import { colors, fonts } from "../theme.js";

export default function Slider({ label, value, onChange, min, max, step = 1, format = (v) => v }) {
  return (
    <div style={{ marginBottom: 16 }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
        <span style={{ fontFamily: fonts.body, fontSize: 13, color: colors.text.secondary, fontWeight: 500 }}>{label}</span>
        <span style={{ fontFamily: fonts.body, fontSize: 14, color: colors.text.primary, fontWeight: 600 }}>{format(value)}</span>
      </div>
      <input
        type="range" min={min} max={max} step={step} value={value}
        onChange={e => onChange(Number(e.target.value))}
        style={{ width: "100%", accentColor: colors.accent.teal, cursor: "pointer", height: 6 }}
      />
    </div>
  );
}
