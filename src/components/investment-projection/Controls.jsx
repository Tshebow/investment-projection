import { useSelector, useDispatch } from "react-redux";
import Slider from "./ui/Slider.jsx";
import Chip from "./ui/Chip.jsx";
import { ETFS, DCA_OPTIONS } from "./constants.js";
import { fmt, fmtPct } from "./simulation.js";
import { colors } from "./theme.js";
import {
  setPrincipal, setStartAge, setYears, setMonthlyExtra,
  setDcaIdx, setEtfKey, setInflationAdjusted, setInflationRate,
  selectActiveProfile,
} from "./investmentSlice.js";

export default function Controls() {
  const dispatch = useDispatch();
  const {
    principal, startAge, years, monthlyExtra,
    dcaIdx, etfKey, inflationAdjusted, inflationRate,
  } = useSelector(selectActiveProfile);

  return (
    <div style={{
      background: colors.bg.cardLight,
      border: `1px solid ${colors.border.subtle}`,
      borderRadius: 16,
      padding: 24,
      marginBottom: 28,
      backdropFilter: "blur(8px)",
    }}>
      <div style={{ display: "flex", gap: 24, flexWrap: "wrap" }}>
        <div style={{ flex: 1, minWidth: 220 }}>
          <Slider label="Starting Capital" value={principal} onChange={v => dispatch(setPrincipal(v))} min={1000} max={500000} step={1000} format={v => fmt(v)} />
          <Slider label="Current Age" value={startAge} onChange={v => dispatch(setStartAge(v))} min={0} max={65} format={v => `${v} years`} />
          <Slider label="Investment Horizon" value={years} onChange={v => dispatch(setYears(v))} min={5} max={65} format={v => `${v} years (age ${startAge + v})`} />
          <Slider label="Monthly Contribution (after DCA)" value={monthlyExtra} onChange={v => dispatch(setMonthlyExtra(v))} min={0} max={3000} step={50} format={v => fmt(v)} />

          {/* Inflation toggle */}
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: inflationAdjusted ? 8 : 0 }}>
            <button
              onClick={() => dispatch(setInflationAdjusted(!inflationAdjusted))}
              style={{
                width: 42, height: 24, borderRadius: 12, border: "none", cursor: "pointer",
                background: inflationAdjusted ? colors.accent.teal : colors.border.medium,
                position: "relative", transition: "background 0.2s", flexShrink: 0,
              }}
            >
              <div style={{
                width: 18, height: 18, borderRadius: 9,
                background: "#fff",
                position: "absolute", top: 3,
                left: inflationAdjusted ? 21 : 3,
                transition: "left 0.2s",
              }} />
            </button>
            <span style={{ fontSize: 13, color: inflationAdjusted ? colors.accent.tealLight : colors.text.secondary, fontWeight: 500 }}>
              Adjust for inflation {inflationAdjusted ? "(today's euros)" : ""}
            </span>
          </div>
          {inflationAdjusted && (
            <Slider label="Inflation Rate" value={inflationRate} onChange={v => dispatch(setInflationRate(v))} min={1} max={5} step={0.5} format={v => `${v.toFixed(1)}%/year`} />
          )}
        </div>
        <div style={{ flex: 1, minWidth: 220 }}>
          <div style={{ marginBottom: 14 }}>
            <div style={{ fontSize: 13, color: colors.text.secondary, fontWeight: 500, marginBottom: 8 }}>DCA period for {fmt(principal)}</div>
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
              {DCA_OPTIONS.map((o, i) => (
                <Chip key={i} active={dcaIdx === i} onClick={() => dispatch(setDcaIdx(i))}>{o.label}</Chip>
              ))}
            </div>
          </div>
          <div>
            <div style={{ fontSize: 13, color: colors.text.secondary, fontWeight: 500, marginBottom: 8 }}>ETF Choice</div>
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
              {Object.entries(ETFS).map(([k, e]) => (
                <Chip key={k} active={etfKey === k} onClick={() => dispatch(setEtfKey(k))}>
                  {e.label} <span style={{ opacity: 0.6, fontSize: 11 }}>({fmtPct(e.tob * 100)} TOB)</span>
                </Chip>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
