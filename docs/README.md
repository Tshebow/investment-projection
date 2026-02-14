---
title: Investment Projection — Knowledge Base
tags: [index, docs]
date: 2026-02-14
---

# Investment Projection — Knowledge Base

This folder contains the domain knowledge behind the Belgian ETF Investment Projection Dashboard. Each document covers one aspect of Belgian investing and maps to specific dashboard features.

## Document Map

| Document | Topic | Related Dashboard Features |
|----------|-------|---------------------------|
| [[brokers]] | Broker comparison (Saxo, Bolero, DEGIRO, MeDirect) | Broker selection context for interpreting tax handling |
| [[etfs]] | ETF selection guide (IWDA, VWCE, IWDA+EMIM) | ETF choice chips, TOB rates, TER in simulation |
| [[taxes-2026]] | Belgian tax rules — TOB, CGT, Reynders, Dividend | Tax Comparison tab, CGT estimate card, TOB cost in DCA schedule |
| [[strategy]] | DCA strategy, emergency fund, investment approach | DCA period selector, monthly contribution slider, Growth Projection chart |
| [[decision-tree]] | Visual decision flowchart | Overall dashboard flow (choose broker → ETF → strategy → taxes) |
| [[sources]] | Reference links and citations | Factual basis for all calculations and descriptions |

## How to Use These Docs

- **Before building a feature:** Read the relevant doc to understand the domain rules.
- **After building a feature:** Revisit the doc to verify the implementation matches the domain.
- **When updating rules:** Update the doc first, then adjust the code to match.
