import { createSlice } from "@reduxjs/toolkit";

const investmentSlice = createSlice({
  name: "investment",
  initialState: {
    principal: 70000,
    startAge: 35,
    years: 25,
    monthlyExtra: 500,
    dcaIdx: 2,
    etfKey: "iwda",
    inflationAdjusted: false,
    inflationRate: 2.0,
  },
  reducers: {
    setPrincipal: (state, action) => { state.principal = action.payload; },
    setStartAge: (state, action) => { state.startAge = action.payload; },
    setYears: (state, action) => { state.years = action.payload; },
    setMonthlyExtra: (state, action) => { state.monthlyExtra = action.payload; },
    setDcaIdx: (state, action) => { state.dcaIdx = action.payload; },
    setEtfKey: (state, action) => { state.etfKey = action.payload; },
    setInflationAdjusted: (state, action) => { state.inflationAdjusted = action.payload; },
    setInflationRate: (state, action) => { state.inflationRate = action.payload; },
  },
});

export const {
  setPrincipal,
  setStartAge,
  setYears,
  setMonthlyExtra,
  setDcaIdx,
  setEtfKey,
  setInflationAdjusted,
  setInflationRate,
} = investmentSlice.actions;

export default investmentSlice.reducer;
