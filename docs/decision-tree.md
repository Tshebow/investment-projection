---
title: Investment Decision Tree
tags: [decision-tree, flowchart, overview]
date: 2026-02-14
---

# Investment Decision Tree

A visual overview of the Belgian ETF investment process — from initial capital to tax implications.

```mermaid
flowchart TD
    START["Available Capital"] --> EMERGENCY["Emergency Fund\n3-6 months expenses\n(keep in savings account)"]
    EMERGENCY --> INVESTABLE["Remaining = Investable Amount"]

    INVESTABLE --> BROKER{"Choose Broker"}
    BROKER --> |"Beginner / Want tax handling"| BELGIAN["Belgian Broker\n(Saxo Bank or Bolero)"]
    BROKER --> |"Cost-focused / Tax-savvy"| FOREIGN["Foreign Broker\n(DEGIRO, MeDirect)"]

    BELGIAN --> |"Handles TOB + Reynders\n+ Dividend tax + CGT"| ETF_CHOICE
    FOREIGN --> |"Declare foreign account\nto National Bank + handle\nsome taxes yourself"| ETF_CHOICE

    ETF_CHOICE{"Choose ETF Strategy"}
    ETF_CHOICE --> CORE{"Core Holding"}
    ETF_CHOICE --> SATELLITE{"Satellite (optional)"}

    CORE --> |"Simplest"| IWDA["IWDA\niShares MSCI World\n~1,500 stocks\nTER: 0.20% · TOB: 0.12%"]
    CORE --> |"Broadest single ETF"| VWCE["VWCE\nVanguard FTSE All-World\n~3,800 stocks\nTER: 0.19% · TOB: 1.32%"]
    CORE --> |"DIY Global"| COMBO["IWDA (90%) + EMIM (10%)\nSame as VWCE coverage\nTOB stays 0.12%"]
    CORE --> |"Pure US large-cap"| CSPX["CSPX\niShares Core S&P 500\n~503 stocks\nTER: 0.07% · TOB: 0.12%"]

    SATELLITE --> |"Small-cap premium"| WSML["WSML\niShares MSCI World Small Cap\n~3,400 stocks\nTER: 0.35% · TOB: 0.12%"]
    SATELLITE --> |"Tech/growth tilt"| EQQQ["EQQQ\nInvesco Nasdaq-100\n100 stocks\nTER: 0.30% · TOB: 0.12%"]
    SATELLITE --> |"Europe overweight"| VEUR["VEUR\nVanguard FTSE Dev. Europe\n~550 stocks\nTER: 0.10% · TOB: 0.12%"]

    IWDA --> DCA
    VWCE --> DCA
    COMBO --> DCA
    CSPX --> DCA
    WSML --> DCA
    EQQQ --> DCA
    VEUR --> DCA

    DCA["DCA Strategy\nInvest fixed amount monthly"]

    DCA --> TAXES["Taxes to Know"]
    TAXES --> TOB["TOB\n0.12% per transaction\n(or 1.32% for VWCE)\nMax caps apply"]
    TAXES --> CGT["Capital Gains Tax\n10% on gains from 2026\nExemption indexed to inflation"]
    TAXES --> REYNDERS["Reynders Tax\n30% on bond component\n(pure equity ETFs = exempt)"]
    TAXES --> DIVIDEND["Dividend Tax\n30% on distributions\n(accumulating ETFs = exempt)"]

    style START fill:#2563eb,color:#fff,stroke:#1d4ed8
    style EMERGENCY fill:#f59e0b,color:#000,stroke:#d97706
    style BELGIAN fill:#16a34a,color:#fff,stroke:#15803d
    style FOREIGN fill:#0891b2,color:#fff,stroke:#0e7490
    style CORE fill:#7c3aed,color:#fff,stroke:#6d28d9
    style SATELLITE fill:#a855f7,color:#fff,stroke:#9333ea
    style IWDA fill:#7c3aed,color:#fff,stroke:#6d28d9
    style VWCE fill:#7c3aed,color:#fff,stroke:#6d28d9
    style COMBO fill:#7c3aed,color:#fff,stroke:#6d28d9
    style CSPX fill:#7c3aed,color:#fff,stroke:#6d28d9
    style WSML fill:#a855f7,color:#fff,stroke:#9333ea
    style EQQQ fill:#a855f7,color:#fff,stroke:#9333ea
    style VEUR fill:#a855f7,color:#fff,stroke:#9333ea
    style DCA fill:#2563eb,color:#fff,stroke:#1d4ed8
    style TOB fill:#ef4444,color:#fff,stroke:#dc2626
    style CGT fill:#ef4444,color:#fff,stroke:#dc2626
    style REYNDERS fill:#ef4444,color:#fff,stroke:#dc2626
    style DIVIDEND fill:#ef4444,color:#fff,stroke:#dc2626
```

## Legend

| Node Color | Category |
|------------|----------|
| Blue | Starting point / strategy |
| Amber | Safety-first step (emergency fund) |
| Green | Belgian broker path |
| Cyan | Foreign broker path |
| Dark purple | Core ETF options |
| Light purple | Satellite ETF options |
| Red | Tax obligations |

### Reading the flowchart

1. **Start** with your available capital
2. **Fund your emergency reserve** before investing anything
3. **Choose a broker** based on your comfort with tax admin (Belgian = hands-off, foreign = cheaper but more work)
4. **Pick a core ETF** — IWDA is simplest, VWCE is broadest, IWDA+EMIM is cost-optimized, CSPX is pure US
5. **Optionally add satellites** — WSML for small-cap, EQQQ for tech/growth, VEUR for European tilt
6. **Deploy via DCA** — spread your initial capital over months, then continue with monthly contributions
7. **Understand the taxes** — all paths lead to the same four taxes, but your broker choice determines how much you handle yourself
