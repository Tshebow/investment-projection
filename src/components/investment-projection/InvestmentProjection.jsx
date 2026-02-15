import { useState, useMemo } from "react";
import { useSelector } from "react-redux";
import { SCENARIOS, ETFS, INSTRUMENTS, DCA_OPTIONS } from "./constants.js";
import { simulate, simulatePortfolio, computeCGT, computeTOB, fmt, fmtPct } from "./simulation.js";
import { colors, fonts } from "./theme.js";
import { selectActiveProfile } from "./investmentSlice.js";
import SummaryCards from "./SummaryCards.jsx";
import Controls from "./Controls.jsx";
import ProfileTabs from "./ProfileTabs.jsx";
import GrowthChart from "./tabs/GrowthChart.jsx";
import DcaSchedule from "./tabs/DcaSchedule.jsx";
import TaxComparison from "./tabs/TaxComparison.jsx";

export default function InvestmentProjection() {
  const {
    principal, startAge, years, monthlyExtra,
    dcaIdx, etfAllocation, inflationAdjusted, inflationRate,
  } = useSelector(selectActiveProfile);

  const [activeTab, setActiveTab] = useState("growth");

  const deflate = (nominal, year) => {
    if (!inflationAdjusted) return nominal;
    return nominal / Math.pow(1 + inflationRate / 100, year);
  };

  const dcaMonths = DCA_OPTIONS[dcaIdx].months;

  const results = useMemo(() => {
    const out = {};
    for (const [k, s] of Object.entries(SCENARIOS)) {
      out[k] = simulatePortfolio({ etfAllocation, principal, dcaMonths, annualReturn: s.rate, years, monthlyExtra, startAge });
    }
    return out;
  }, [principal, dcaMonths, etfAllocation, years, monthlyExtra, startAge]);

  const etfComparison = useMemo(() => {
    const out = {};
    for (const [k, e] of Object.entries(ETFS)) {
      out[k] = simulate({ principal, dcaMonths, annualReturn: 0.07, tobRate: e.tob, ter: e.ter, years, monthlyExtra, startAge });
    }
    return out;
  }, [principal, dcaMonths, years, monthlyExtra, startAge]);

  const moderate = results.moderate;
  const finalModerate = moderate[moderate.length - 1];

  const displayPortfolio = Math.round(deflate(finalModerate.portfolio, years));
  const displayInvested = Math.round(deflate(finalModerate.invested, years));
  const displayGain = displayPortfolio - displayInvested;
  const displayCgt = computeCGT(finalModerate.gain);

  const dcaSchedule = useMemo(() => {
    const monthlyDCA = principal / dcaMonths;
    const rows = [];
    let cumulative = 0;
    // Compute blended TOB across allocation
    for (let m = 1; m <= Math.min(dcaMonths, 36); m++) {
      cumulative += monthlyDCA;
      let tob = 0;
      for (const { key, pct } of etfAllocation) {
        const etfTob = INSTRUMENTS[key].costs.transactionTax;
        tob += computeTOB(monthlyDCA * pct / 100, etfTob);
      }
      rows.push({ month: m, amount: Math.round(monthlyDCA), tob: Math.round(tob * 100) / 100, cumulative: Math.round(cumulative), extra: monthlyExtra });
    }
    return rows;
  }, [principal, dcaMonths, etfAllocation, monthlyExtra]);

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
      const cgtVal = computeCGT(final.gain);
      const grossAdj = Math.round(deflate(final.portfolio, years));
      const tobAdj = Math.round(deflate(final.totalTOB, years));
      const cgtAdj = Math.round(deflate(cgtVal, years));
      return { name: e.label, totalTOB: tobAdj, cgt: cgtAdj, netPortfolio: grossAdj - cgtAdj, grossPortfolio: grossAdj };
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [etfComparison, years, inflationAdjusted, inflationRate]);

  return (
    <div style={{
      minHeight: "100vh",
      background: `linear-gradient(170deg, ${colors.bg.primary} 0%, ${colors.bg.secondary} 40%, ${colors.bg.primary} 100%)`,
      color: colors.text.primary,
      fontFamily: fonts.body,
      padding: "32px 24px",
    }}>
      <div style={{
        position: "fixed", top: 0, left: 0, right: 0, bottom: 0, pointerEvents: "none",
        backgroundImage: `radial-gradient(circle at 1px 1px, ${colors.chart.gridDot} 1px, transparent 0)`,
        backgroundSize: "40px 40px", zIndex: 0,
      }} />

      <div style={{ maxWidth: 820, margin: "0 auto", position: "relative", zIndex: 1 }}>
        <ProfileTabs />
        {/* Header */}
        <div style={{ marginBottom: 36 }}>
          <div style={{ fontFamily: fonts.body, fontSize: 11, color: colors.accent.teal, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 8 }}>
            Belgian ETF Investment Projection
          </div>
          <h1 style={{ fontFamily: fonts.heading, fontSize: 32, fontWeight: 800, color: colors.text.bright, margin: 0, lineHeight: 1.2 }}>
            Your {fmt(principal)} → {fmt(displayPortfolio)}
          </h1>
          <p style={{ color: colors.text.muted, fontSize: 14, margin: "8px 0 0" }}>
            Moderate scenario ({fmtPct(7)}/yr) over {years} years · Age {startAge + years} at withdrawal
            {inflationAdjusted && <span style={{ color: colors.warning, marginLeft: 8 }}>· in today&apos;s euros</span>}
          </p>
        </div>

        <SummaryCards {...{ displayInvested, displayPortfolio, displayGain, displayCgt, principal, monthlyExtra, inflationAdjusted }} />
        <Controls />

        {/* Tab Navigation */}
        <div style={{ display: "flex", gap: 4, marginBottom: 24, borderBottom: `1px solid ${colors.border.tab}`, paddingBottom: 2 }}>
          {[
            { key: "growth", label: "Growth Projection" },
            { key: "dca", label: "DCA Schedule" },
            { key: "tax", label: "Tax Comparison" },
          ].map(t => (
            <button key={t.key} onClick={() => setActiveTab(t.key)} style={{
              padding: "10px 18px", background: "transparent", border: "none",
              borderBottom: activeTab === t.key ? `2px solid ${colors.accent.teal}` : "2px solid transparent",
              color: activeTab === t.key ? colors.accent.tealLight : colors.text.muted,
              fontFamily: fonts.body, fontSize: 14, fontWeight: 600, cursor: "pointer", transition: "all 0.2s",
            }}>
              {t.label}
            </button>
          ))}
        </div>

        {activeTab === "growth" && (
          <GrowthChart {...{ chartData, results, displayPortfolio, deflate, years, startAge, inflationAdjusted, inflationRate }} />
        )}
        {activeTab === "dca" && (
          <DcaSchedule {...{ dcaSchedule, dcaMonths, dcaIdx, principal, etfAllocation, monthlyExtra }} />
        )}
        {activeTab === "tax" && (
          <TaxComparison {...{ taxCompData, years, startAge, finalModerateGain: finalModerate.gain }} />
        )}

        {/* Disclaimer */}
        <div style={{
          marginTop: 32, padding: 16,
          background: colors.bg.overlay, border: `1px solid ${colors.border.dimmed}`,
          borderRadius: 10, fontSize: 11, color: colors.text.dimmed, lineHeight: 1.6, textAlign: "center",
        }}>
          This is a simplified projection tool, not financial advice. Actual returns vary and can be negative.
          Past performance doesn&apos;t guarantee future results. Tax rules may change. Consult a professional before investing.
          Model assumes constant returns (no volatility). Inflation adjustment uses a constant rate applied as a discount factor to convert nominal values to today&apos;s purchasing power.
        </div>
      </div>
    </div>
  );
}
