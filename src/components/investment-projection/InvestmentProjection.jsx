import { useState, useMemo } from "react";
import { XAxis, YAxis, Tooltip, ResponsiveContainer, Area, AreaChart, CartesianGrid, BarChart, Bar } from "recharts";
import { SCENARIOS, ETFS, DCA_OPTIONS } from "./constants.js";
import { simulate, computeCGT, fmt, fmtPct } from "./simulation.js";

function Slider({ label, value, onChange, min, max, step = 1, format = (v) => v }) {
  return (
    <div style={{ marginBottom: 16 }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
        <span style={{ fontFamily: "'DM Sans'", fontSize: 13, color: "#94a3b8", fontWeight: 500 }}>{label}</span>
        <span style={{ fontFamily: "'DM Sans'", fontSize: 14, color: "#e2e8f0", fontWeight: 600 }}>{format(value)}</span>
      </div>
      <input
        type="range" min={min} max={max} step={step} value={value}
        onChange={e => onChange(Number(e.target.value))}
        style={{ width: "100%", accentColor: "#0d9488", cursor: "pointer", height: 6 }}
      />
    </div>
  );
}

function Chip({ active, onClick, children }) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: "6px 14px",
        borderRadius: 8,
        border: active ? "1.5px solid #0d9488" : "1.5px solid #334155",
        background: active ? "rgba(13,148,136,0.15)" : "transparent",
        color: active ? "#5eead4" : "#94a3b8",
        fontFamily: "'DM Sans'",
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

function StatCard({ label, value, sub, accent = false }) {
  return (
    <div style={{
      background: accent ? "linear-gradient(135deg, rgba(13,148,136,0.12), rgba(13,148,136,0.04))" : "rgba(30,41,59,0.6)",
      border: accent ? "1px solid rgba(13,148,136,0.3)" : "1px solid rgba(71,85,105,0.3)",
      borderRadius: 12,
      padding: "16px 18px",
      flex: 1,
      minWidth: 140,
    }}>
      <div style={{ fontFamily: "'DM Sans'", fontSize: 11, color: "#64748b", fontWeight: 600, letterSpacing: "0.05em", textTransform: "uppercase", marginBottom: 6 }}>{label}</div>
      <div style={{ fontFamily: "'Fraunces'", fontSize: 22, color: accent ? "#5eead4" : "#e2e8f0", fontWeight: 700 }}>{value}</div>
      {sub && <div style={{ fontFamily: "'DM Sans'", fontSize: 12, color: "#64748b", marginTop: 4 }}>{sub}</div>}
    </div>
  );
}

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{
      background: "#1e293b",
      border: "1px solid #334155",
      borderRadius: 10,
      padding: "12px 16px",
      fontFamily: "'DM Sans'",
      boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
    }}>
      <div style={{ color: "#94a3b8", fontSize: 12, marginBottom: 8 }}>Age {35 + label} · Year {label}</div>
      {payload.map((p, i) => (
        <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 3 }}>
          <div style={{ width: 8, height: 8, borderRadius: 4, background: p.color }} />
          <span style={{ color: "#cbd5e1", fontSize: 13 }}>{p.name}: <strong style={{ color: "#e2e8f0" }}>{fmt(p.value)}</strong></span>
        </div>
      ))}
    </div>
  );
};

export default function InvestmentProjection() {
  const [dcaIdx, setDcaIdx] = useState(2);
  const [etfKey, setEtfKey] = useState("iwda");
  const [years, setYears] = useState(25);
  const [monthlyExtra, setMonthlyExtra] = useState(500);
  const [activeTab, setActiveTab] = useState("growth");
  const [inflationAdjusted, setInflationAdjusted] = useState(false);
  const [inflationRate, setInflationRate] = useState(2.0);

  const deflate = (nominal, year) => {
    if (!inflationAdjusted) return nominal;
    return nominal / Math.pow(1 + inflationRate / 100, year);
  };

  const dcaMonths = DCA_OPTIONS[dcaIdx].months;
  const etf = ETFS[etfKey];

  const results = useMemo(() => {
    const out = {};
    for (const [k, s] of Object.entries(SCENARIOS)) {
      out[k] = simulate({
        principal: 70000,
        dcaMonths,
        annualReturn: s.rate,
        tobRate: etf.tob,
        ter: etf.ter,
        years,
        monthlyExtra,
      });
    }
    return out;
  }, [dcaMonths, etf, years, monthlyExtra]);

  const etfComparison = useMemo(() => {
    const out = {};
    for (const [k, e] of Object.entries(ETFS)) {
      out[k] = simulate({
        principal: 70000,
        dcaMonths,
        annualReturn: 0.07,
        tobRate: e.tob,
        ter: e.ter,
        years,
        monthlyExtra,
      });
    }
    return out;
  }, [dcaMonths, years, monthlyExtra]);

  const moderate = results.moderate;
  const finalModerate = moderate[moderate.length - 1];

  const displayPortfolio = Math.round(deflate(finalModerate.portfolio, years));
  const displayInvested = Math.round(deflate(finalModerate.invested, years));
  const displayGain = displayPortfolio - displayInvested;
  const displayCgt = computeCGT(finalModerate.gain);

  const dcaSchedule = useMemo(() => {
    const monthlyDCA = 70000 / dcaMonths;
    const rows = [];
    let cumulative = 0;
    for (let m = 1; m <= Math.min(dcaMonths, 36); m++) {
      cumulative += monthlyDCA;
      const tob = monthlyDCA * etf.tob;
      rows.push({
        month: m,
        amount: Math.round(monthlyDCA),
        tob: Math.round(tob * 100) / 100,
        cumulative: Math.round(cumulative),
        extra: monthlyExtra,
      });
    }
    return rows;
  }, [dcaMonths, etf, monthlyExtra]);

  const chartData = useMemo(() => {
    return moderate.map((m, i) => ({
      year: m.year,
      invested: Math.round(deflate(m.invested, m.year)),
      portfolio_conservative: Math.round(deflate(results.conservative[i]?.portfolio || 0, m.year)),
      portfolio_moderate: Math.round(deflate(m.portfolio, m.year)),
      portfolio_historical: Math.round(deflate(results.historical[i]?.portfolio || 0, m.year)),
    }));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [results, moderate, inflationAdjusted, inflationRate]);

  const taxCompData = useMemo(() => {
    return Object.entries(ETFS).map(([k, e]) => {
      const sim = etfComparison[k];
      const final = sim[sim.length - 1];
      const gain = final.gain;
      const cgtVal = computeCGT(gain);
      const grossAdj = Math.round(deflate(final.portfolio, years));
      const tobAdj = Math.round(deflate(final.totalTOB, years));
      const cgtAdj = Math.round(deflate(cgtVal, years));
      return {
        name: e.label,
        totalTOB: tobAdj,
        cgt: cgtAdj,
        netPortfolio: grossAdj - cgtAdj,
        grossPortfolio: grossAdj,
      };
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [etfComparison, years, inflationAdjusted, inflationRate]);

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(170deg, #0f172a 0%, #1a1f35 40%, #0f172a 100%)",
      color: "#e2e8f0",
      fontFamily: "'DM Sans', sans-serif",
      padding: "32px 24px",
    }}>
      {/* Subtle grid texture */}
      <div style={{
        position: "fixed", top: 0, left: 0, right: 0, bottom: 0, pointerEvents: "none",
        backgroundImage: "radial-gradient(circle at 1px 1px, rgba(71,85,105,0.15) 1px, transparent 0)",
        backgroundSize: "40px 40px",
        zIndex: 0,
      }} />

      <div style={{ maxWidth: 820, margin: "0 auto", position: "relative", zIndex: 1 }}>
        {/* Header */}
        <div style={{ marginBottom: 36 }}>
          <div style={{ fontFamily: "'DM Sans'", fontSize: 11, color: "#0d9488", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 8 }}>
            Belgian ETF Investment Projection
          </div>
          <h1 style={{ fontFamily: "'Fraunces'", fontSize: 32, fontWeight: 800, color: "#f1f5f9", margin: 0, lineHeight: 1.2 }}>
            Your €70k → {fmt(displayPortfolio)}
          </h1>
          <p style={{ color: "#64748b", fontSize: 14, margin: "8px 0 0" }}>
            Moderate scenario ({fmtPct(7)}/yr) over {years} years · Age {35 + years} at withdrawal
            {inflationAdjusted && <span style={{ color: "#f59e0b", marginLeft: 8 }}>· in today&apos;s euros</span>}
          </p>
        </div>

        {/* Summary Cards */}
        <div style={{ display: "flex", gap: 12, marginBottom: 32, flexWrap: "wrap" }}>
          <StatCard label="Total Invested" value={fmt(displayInvested)} sub={`€70k + ${fmt(monthlyExtra)}/mo`} />
          <StatCard label="Portfolio Value" value={fmt(displayPortfolio)} sub={inflationAdjusted ? "Today's euros" : "Moderate scenario"} accent />
          <StatCard label="Total Gain" value={fmt(displayGain)} sub={displayInvested > 0 ? `${fmtPct((displayGain / displayInvested) * 100)} return` : ""} />
          <StatCard label="Est. CGT (10%)" value={fmt(displayCgt)} sub="€10k/yr exempt (nominal)" />
        </div>

        {/* Controls */}
        <div style={{
          background: "rgba(30,41,59,0.5)",
          border: "1px solid rgba(71,85,105,0.3)",
          borderRadius: 16,
          padding: 24,
          marginBottom: 28,
          backdropFilter: "blur(8px)",
        }}>
          <div style={{ display: "flex", gap: 24, flexWrap: "wrap" }}>
            <div style={{ flex: 1, minWidth: 220 }}>
              <Slider label="Investment Horizon" value={years} onChange={setYears} min={5} max={35} format={v => `${v} years (age ${35 + v})`} />
              <Slider label="Monthly Contribution (after DCA)" value={monthlyExtra} onChange={setMonthlyExtra} min={0} max={3000} step={50} format={v => fmt(v)} />

              {/* Inflation toggle */}
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: inflationAdjusted ? 8 : 0 }}>
                <button
                  onClick={() => setInflationAdjusted(!inflationAdjusted)}
                  style={{
                    width: 42, height: 24, borderRadius: 12, border: "none", cursor: "pointer",
                    background: inflationAdjusted ? "#0d9488" : "#334155",
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
                <span style={{ fontSize: 13, color: inflationAdjusted ? "#5eead4" : "#94a3b8", fontWeight: 500 }}>
                  Adjust for inflation {inflationAdjusted ? "(today's euros)" : ""}
                </span>
              </div>
              {inflationAdjusted && (
                <Slider label="Inflation Rate" value={inflationRate} onChange={setInflationRate} min={1} max={5} step={0.5} format={v => `${v.toFixed(1)}%/year`} />
              )}
            </div>
            <div style={{ flex: 1, minWidth: 220 }}>
              <div style={{ marginBottom: 14 }}>
                <div style={{ fontSize: 13, color: "#94a3b8", fontWeight: 500, marginBottom: 8 }}>DCA period for €70k</div>
                <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                  {DCA_OPTIONS.map((o, i) => (
                    <Chip key={i} active={dcaIdx === i} onClick={() => setDcaIdx(i)}>{o.label}</Chip>
                  ))}
                </div>
              </div>
              <div>
                <div style={{ fontSize: 13, color: "#94a3b8", fontWeight: 500, marginBottom: 8 }}>ETF Choice</div>
                <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                  {Object.entries(ETFS).map(([k, e]) => (
                    <Chip key={k} active={etfKey === k} onClick={() => setEtfKey(k)}>
                      {e.label} <span style={{ opacity: 0.6, fontSize: 11 }}>({fmtPct(e.tob * 100)} TOB)</span>
                    </Chip>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div style={{ display: "flex", gap: 4, marginBottom: 24, borderBottom: "1px solid #1e293b", paddingBottom: 2 }}>
          {[
            { key: "growth", label: "Growth Projection" },
            { key: "dca", label: "DCA Schedule" },
            { key: "tax", label: "Tax Comparison" },
          ].map(t => (
            <button key={t.key} onClick={() => setActiveTab(t.key)} style={{
              padding: "10px 18px",
              background: "transparent",
              border: "none",
              borderBottom: activeTab === t.key ? "2px solid #0d9488" : "2px solid transparent",
              color: activeTab === t.key ? "#5eead4" : "#64748b",
              fontFamily: "'DM Sans'",
              fontSize: 14,
              fontWeight: 600,
              cursor: "pointer",
              transition: "all 0.2s",
            }}>
              {t.label}
            </button>
          ))}
        </div>

        {/* Growth Chart */}
        {activeTab === "growth" && (
          <div style={{
            background: "rgba(30,41,59,0.4)",
            border: "1px solid rgba(71,85,105,0.25)",
            borderRadius: 16,
            padding: "24px 16px 16px",
          }}>
            <div style={{ fontSize: 16, fontWeight: 700, fontFamily: "'Fraunces'", marginBottom: 4, paddingLeft: 8 }}>Portfolio Growth — 3 Scenarios</div>
            <div style={{ fontSize: 12, color: "#64748b", marginBottom: 20, paddingLeft: 8 }}>
              Conservative (5%), Moderate (7%), Historical (10%) annual returns after TER
              {inflationAdjusted && <span style={{ color: "#f59e0b" }}> · adjusted for {inflationRate}% inflation (today&apos;s euros)</span>}
            </div>
            <ResponsiveContainer width="100%" height={340}>
              <AreaChart data={chartData} margin={{ top: 10, right: 16, bottom: 0, left: 8 }}>
                <defs>
                  <linearGradient id="gradHistorical" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#2563eb" stopOpacity={0.25} />
                    <stop offset="100%" stopColor="#2563eb" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="gradModerate" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#0d9488" stopOpacity={0.2} />
                    <stop offset="100%" stopColor="#0d9488" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(71,85,105,0.2)" />
                <XAxis dataKey="year" tick={{ fill: "#64748b", fontSize: 12 }} tickLine={false} axisLine={{ stroke: "#334155" }} />
                <YAxis tick={{ fill: "#64748b", fontSize: 11 }} tickLine={false} axisLine={false} tickFormatter={v => v >= 1000000 ? `${(v/1000000).toFixed(1)}M` : v >= 1000 ? `${Math.round(v/1000)}k` : v} />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="invested" name="Total Invested" stroke="#475569" strokeWidth={2} fill="rgba(71,85,105,0.1)" strokeDasharray="6 3" />
                <Area type="monotone" dataKey="portfolio_conservative" name="Conservative (5%)" stroke="#64748b" strokeWidth={1.5} fill="none" />
                <Area type="monotone" dataKey="portfolio_moderate" name="Moderate (7%)" stroke="#0d9488" strokeWidth={2.5} fill="url(#gradModerate)" />
                <Area type="monotone" dataKey="portfolio_historical" name="Historical (10%)" stroke="#2563eb" strokeWidth={2} fill="url(#gradHistorical)" />
              </AreaChart>
            </ResponsiveContainer>
            <div style={{ display: "flex", gap: 20, justifyContent: "center", marginTop: 12, flexWrap: "wrap" }}>
              {[
                { label: "Invested", color: "#475569", dash: true },
                { label: `Conservative → ${fmt(Math.round(deflate(results.conservative[results.conservative.length-1].portfolio, years)))}`, color: "#64748b" },
                { label: `Moderate → ${fmt(displayPortfolio)}`, color: "#0d9488" },
                { label: `Historical → ${fmt(Math.round(deflate(results.historical[results.historical.length-1].portfolio, years)))}`, color: "#2563eb" },
              ].map((l, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <div style={{ width: 16, height: 2, background: l.color, borderRadius: 1, ...(l.dash ? { backgroundImage: `repeating-linear-gradient(90deg, ${l.color} 0 4px, transparent 4px 8px)`, background: "none" } : {}) }} />
                  <span style={{ fontSize: 11, color: "#94a3b8" }}>{l.label}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* DCA Schedule */}
        {activeTab === "dca" && (
          <div style={{
            background: "rgba(30,41,59,0.4)",
            border: "1px solid rgba(71,85,105,0.25)",
            borderRadius: 16,
            padding: 24,
          }}>
            <div style={{ fontSize: 16, fontWeight: 700, fontFamily: "'Fraunces'", marginBottom: 4 }}>
              DCA Deployment: {fmt(70000)} over {DCA_OPTIONS[dcaIdx].label}
            </div>
            <div style={{ fontSize: 12, color: "#64748b", marginBottom: 16 }}>
              {fmt(Math.round(70000 / dcaMonths))}/month into {ETFS[etfKey].label} + {fmt(monthlyExtra)}/month ongoing contribution
            </div>

            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontFamily: "'DM Sans'", fontSize: 13 }}>
                <thead>
                  <tr style={{ borderBottom: "1px solid #334155" }}>
                    {["Month", "DCA Amount", "Extra", "TOB Cost", "Cumulative Deployed"].map(h => (
                      <th key={h} style={{ padding: "10px 12px", textAlign: "right", color: "#64748b", fontWeight: 600, fontSize: 11, textTransform: "uppercase", letterSpacing: "0.05em" }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {dcaSchedule.slice(0, 12).map((r, i) => (
                    <tr key={i} style={{ borderBottom: "1px solid rgba(51,65,85,0.4)" }}>
                      <td style={{ padding: "9px 12px", textAlign: "right", color: "#94a3b8" }}>{r.month}</td>
                      <td style={{ padding: "9px 12px", textAlign: "right", color: "#e2e8f0", fontWeight: 500 }}>{fmt(r.amount)}</td>
                      <td style={{ padding: "9px 12px", textAlign: "right", color: "#5eead4" }}>+{fmt(r.extra)}</td>
                      <td style={{ padding: "9px 12px", textAlign: "right", color: "#f87171", fontSize: 12 }}>-{fmt(r.tob)}</td>
                      <td style={{ padding: "9px 12px", textAlign: "right", color: "#e2e8f0", fontWeight: 600 }}>{fmt(r.cumulative)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {dcaMonths > 12 && (
                <div style={{ padding: "12px", textAlign: "center", color: "#64748b", fontSize: 12 }}>
                  ... continues for {dcaMonths - 12} more months
                </div>
              )}
            </div>

            <div style={{
              marginTop: 20,
              padding: 16,
              background: "rgba(13,148,136,0.08)",
              border: "1px solid rgba(13,148,136,0.2)",
              borderRadius: 10,
              fontSize: 13,
              color: "#94a3b8",
              lineHeight: 1.6,
            }}>
              <strong style={{ color: "#5eead4" }}>Total TOB on initial €70k deployment:</strong> {fmt(Math.round(70000 * etf.tob))}
              <br />
              <strong style={{ color: "#5eead4" }}>Monthly TOB on {fmt(monthlyExtra)} contribution:</strong> {fmt(Math.round(monthlyExtra * etf.tob * 100) / 100)}/month
              <br />
              <span style={{ fontSize: 12, color: "#475569", marginTop: 4, display: "block" }}>
                After the DCA period ends, only your {fmt(monthlyExtra)}/month ongoing contribution continues.
              </span>
            </div>
          </div>
        )}

        {/* Tax Comparison */}
        {activeTab === "tax" && (
          <div style={{
            background: "rgba(30,41,59,0.4)",
            border: "1px solid rgba(71,85,105,0.25)",
            borderRadius: 16,
            padding: 24,
          }}>
            <div style={{ fontSize: 16, fontWeight: 700, fontFamily: "'Fraunces'", marginBottom: 4 }}>
              ETF Tax Impact Over {years} Years
            </div>
            <div style={{ fontSize: 12, color: "#64748b", marginBottom: 20 }}>
              Moderate scenario (7%/yr) — all ETFs compared at equal contributions
            </div>

            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={taxCompData} margin={{ top: 10, right: 16, bottom: 0, left: 8 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(71,85,105,0.2)" />
                <XAxis dataKey="name" tick={{ fill: "#94a3b8", fontSize: 13 }} tickLine={false} axisLine={{ stroke: "#334155" }} />
                <YAxis tick={{ fill: "#64748b", fontSize: 11 }} tickLine={false} axisLine={false} tickFormatter={v => v >= 1000 ? `${Math.round(v/1000)}k` : v} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="totalTOB" name="Total TOB Paid" fill="#f59e0b" radius={[4, 4, 0, 0]} />
                <Bar dataKey="cgt" name="Est. CGT (lump exit)" fill="#ef4444" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>

            <div style={{ marginTop: 20 }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontFamily: "'DM Sans'", fontSize: 13 }}>
                <thead>
                  <tr style={{ borderBottom: "1px solid #334155" }}>
                    {["ETF", "Gross Value", "Total TOB", "Est. CGT", "Net After Tax"].map(h => (
                      <th key={h} style={{ padding: "10px 12px", textAlign: "right", color: "#64748b", fontWeight: 600, fontSize: 11, textTransform: "uppercase", letterSpacing: "0.05em" }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {taxCompData.map((r, i) => (
                    <tr key={i} style={{ borderBottom: "1px solid rgba(51,65,85,0.4)" }}>
                      <td style={{ padding: "10px 12px", textAlign: "right", color: "#e2e8f0", fontWeight: 600 }}>{r.name}</td>
                      <td style={{ padding: "10px 12px", textAlign: "right", color: "#94a3b8" }}>{fmt(r.grossPortfolio)}</td>
                      <td style={{ padding: "10px 12px", textAlign: "right", color: "#f59e0b" }}>-{fmt(r.totalTOB)}</td>
                      <td style={{ padding: "10px 12px", textAlign: "right", color: "#ef4444" }}>-{fmt(r.cgt)}</td>
                      <td style={{ padding: "10px 12px", textAlign: "right", color: "#5eead4", fontWeight: 700, fontSize: 14 }}>{fmt(r.netPortfolio)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div style={{
              marginTop: 20,
              padding: 16,
              background: "rgba(239,68,68,0.06)",
              border: "1px solid rgba(239,68,68,0.15)",
              borderRadius: 10,
              fontSize: 12,
              color: "#94a3b8",
              lineHeight: 1.7,
            }}>
              <strong style={{ color: "#fca5a5" }}>CGT note:</strong> The estimate above assumes you sell everything in one year (worst case). In practice, you&apos;d spread withdrawals across multiple years to use the €10k/yr exemption. With {Math.ceil(finalModerate.gain / 10000)} years of staggered selling, your effective CGT could be <strong style={{ color: "#5eead4" }}>significantly lower or even €0</strong>.
              <br /><br />
              <strong style={{ color: "#fca5a5" }}>TOB difference IWDA vs VWCE:</strong> Over {years} years, choosing IWDA over VWCE saves you <strong style={{ color: "#5eead4" }}>{fmt(Math.abs(taxCompData[1]?.totalTOB - taxCompData[0]?.totalTOB))}</strong> in transaction taxes alone.
            </div>
          </div>
        )}

        {/* Disclaimer */}
        <div style={{
          marginTop: 32,
          padding: 16,
          background: "rgba(71,85,105,0.1)",
          border: "1px solid rgba(71,85,105,0.2)",
          borderRadius: 10,
          fontSize: 11,
          color: "#475569",
          lineHeight: 1.6,
          textAlign: "center",
        }}>
          This is a simplified projection tool, not financial advice. Actual returns vary and can be negative.
          Past performance doesn&apos;t guarantee future results. Tax rules may change. Consult a professional before investing.
          Model assumes constant returns (no volatility). Inflation adjustment uses a constant rate applied as a discount factor to convert nominal values to today&apos;s purchasing power.
        </div>
      </div>
    </div>
  );
}
