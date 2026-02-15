import { useSelector, useDispatch } from "react-redux";
import Slider from "./ui/Slider.jsx";
import Chip from "./ui/Chip.jsx";
import { ETFS, INSTRUMENTS, ALLOCATION_PRESETS, DCA_OPTIONS } from "./constants.js";
import { fmt, fmtPct } from "./simulation.js";
import { colors } from "./theme.js";
import {
  setPrincipal, setStartAge, setYears, setMonthlyExtra,
  setDcaIdx, setEtfAllocation, setInflationAdjusted, setInflationRate,
  selectActiveProfile,
} from "./investmentSlice.js";

function allocationsEqual(a, b) {
  if (a.length !== b.length) return false;
  for (let i = 0; i < a.length; i++) {
    if (a[i].key !== b[i].key || a[i].pct !== b[i].pct) return false;
  }
  return true;
}

function allocationLabel(etfAllocation) {
  return etfAllocation.map(a => `${a.pct}% ${ETFS[a.key]?.label || a.key}`).join(" + ");
}

export default function Controls() {
  const dispatch = useDispatch();
  const {
    principal, startAge, years, monthlyExtra,
    dcaIdx, etfAllocation, inflationAdjusted, inflationRate,
  } = useSelector(selectActiveProfile);

  const matchedPreset = ALLOCATION_PRESETS.find(p => allocationsEqual(p.allocation, etfAllocation));
  const isCustom = !matchedPreset;
  const totalPct = etfAllocation.reduce((sum, a) => sum + a.pct, 0);
  const usedKeys = new Set(etfAllocation.map(a => a.key));

  const coreEtfs = Object.entries(INSTRUMENTS).filter(([k, v]) => v.type === "etf" && v.role === "core" && !usedKeys.has(k));
  const satelliteEtfs = Object.entries(INSTRUMENTS).filter(([k, v]) => v.type === "etf" && v.role === "satellite" && !usedKeys.has(k));
  const hasAvailable = coreEtfs.length > 0 || satelliteEtfs.length > 0;

  const updatePct = (idx, newPct) => {
    const next = etfAllocation.map((a, i) => i === idx ? { ...a, pct: newPct } : a);
    dispatch(setEtfAllocation(next));
  };

  const removeEtf = (idx) => {
    if (etfAllocation.length <= 1) return;
    dispatch(setEtfAllocation(etfAllocation.filter((_, i) => i !== idx)));
  };

  const addEtf = (key) => {
    dispatch(setEtfAllocation([...etfAllocation, { key, pct: 0 }]));
  };

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

          {/* Portfolio preset chips */}
          <div style={{ marginBottom: 14 }}>
            <div style={{ fontSize: 13, color: colors.text.secondary, fontWeight: 500, marginBottom: 8 }}>Portfolio Allocation</div>
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
              {ALLOCATION_PRESETS.map(p => (
                <Chip key={p.key} active={matchedPreset?.key === p.key} onClick={() => dispatch(setEtfAllocation(p.allocation))}>
                  {p.label}
                </Chip>
              ))}
              {isCustom && <Chip active>Custom</Chip>}
            </div>
          </div>

          {/* Allocation editor */}
          <div style={{
            background: colors.bg.overlay,
            border: `1px solid ${colors.border.dimmed}`,
            borderRadius: 10,
            padding: 12,
          }}>
            {etfAllocation.map((a, i) => (
              <div key={a.key} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: i < etfAllocation.length - 1 ? 8 : 0 }}>
                <span style={{ fontSize: 13, fontWeight: 600, color: colors.text.primary, minWidth: 48 }}>
                  {ETFS[a.key]?.label || a.key}
                </span>
                <span style={{ fontSize: 11, color: colors.text.muted }}>
                  ({fmtPct(ETFS[a.key]?.tob * 100)} TOB)
                </span>
                <div style={{ flex: 1 }} />
                <input
                  type="number"
                  min={0}
                  max={100}
                  value={a.pct}
                  onChange={e => updatePct(i, Math.max(0, Math.min(100, parseInt(e.target.value) || 0)))}
                  style={{
                    width: 52, textAlign: "right", padding: "4px 6px",
                    background: colors.bg.input || "#1a1f2e", border: `1px solid ${colors.border.medium}`,
                    borderRadius: 6, color: colors.text.primary, fontSize: 13, fontWeight: 600,
                  }}
                />
                <span style={{ fontSize: 13, color: colors.text.muted }}>%</span>
                {etfAllocation.length > 1 && (
                  <button
                    onClick={() => removeEtf(i)}
                    style={{
                      background: "transparent", border: "none", cursor: "pointer",
                      color: colors.text.muted, fontSize: 16, padding: "0 4px", lineHeight: 1,
                    }}
                    title="Remove"
                  >
                    &times;
                  </button>
                )}
              </div>
            ))}

            {/* Validation + Add ETF */}
            <div style={{ marginTop: 10, display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
              {totalPct !== 100 && (
                <span style={{ fontSize: 11, color: colors.warning, fontWeight: 600 }}>
                  Total: {totalPct}% (must be 100%)
                </span>
              )}
              {totalPct === 100 && (
                <span style={{ fontSize: 11, color: colors.accent.teal, fontWeight: 500 }}>
                  {allocationLabel(etfAllocation)}
                </span>
              )}
              <div style={{ flex: 1 }} />
              {hasAvailable && (
                <select
                  value=""
                  onChange={e => { if (e.target.value) addEtf(e.target.value); }}
                  style={{
                    padding: "4px 8px", fontSize: 12, cursor: "pointer",
                    background: colors.bg.input || "#1a1f2e", border: `1px solid ${colors.border.medium}`,
                    borderRadius: 6, color: colors.text.secondary,
                  }}
                >
                  <option value="">+ Add ETF</option>
                  {coreEtfs.length > 0 && <optgroup label="Core">{coreEtfs.map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}</optgroup>}
                  {satelliteEtfs.length > 0 && <optgroup label="Satellite">{satelliteEtfs.map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}</optgroup>}
                </select>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
