import { colors, fonts } from "../theme.js";

export default function Chip({ active, onClick, children }) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: "6px 14px",
        borderRadius: 8,
        border: active ? `1.5px solid ${colors.accent.teal}` : `1.5px solid ${colors.border.medium}`,
        background: active ? colors.accent.tealBg : "transparent",
        color: active ? colors.accent.tealLight : colors.text.secondary,
        fontFamily: fonts.body,
        fontSize: 13,
        fontWeight: 600,
        cursor: "pointer",
        transition: "all 0.2s",
      }}
    >
      {children}
    </button>
  );
}
