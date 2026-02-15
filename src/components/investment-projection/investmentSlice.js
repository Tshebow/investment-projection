import { createSlice } from "@reduxjs/toolkit";
import { PROFILE_TEMPLATES } from "./constants.js";

const defaultProfile = PROFILE_TEMPLATES[0].defaults;

function loadFromLocalStorage() {
  try {
    const stored = localStorage.getItem("investment-profiles");
    if (stored) return JSON.parse(stored);
  } catch { /* ignore */ }
  return null;
}

const fallbackState = {
  activeProfileId: "profile-1",
  profileOrder: ["profile-1"],
  profiles: {
    "profile-1": { name: "My Portfolio", ...defaultProfile },
  },
};

let nextId = 2;

const investmentSlice = createSlice({
  name: "investment",
  initialState: loadFromLocalStorage() || fallbackState,
  reducers: {
    setPrincipal: (state, action) => { state.profiles[state.activeProfileId].principal = action.payload; },
    setStartAge: (state, action) => { state.profiles[state.activeProfileId].startAge = action.payload; },
    setYears: (state, action) => { state.profiles[state.activeProfileId].years = action.payload; },
    setMonthlyExtra: (state, action) => { state.profiles[state.activeProfileId].monthlyExtra = action.payload; },
    setDcaIdx: (state, action) => { state.profiles[state.activeProfileId].dcaIdx = action.payload; },
    setEtfKey: (state, action) => { state.profiles[state.activeProfileId].etfKey = action.payload; },
    setInflationAdjusted: (state, action) => { state.profiles[state.activeProfileId].inflationAdjusted = action.payload; },
    setInflationRate: (state, action) => { state.profiles[state.activeProfileId].inflationRate = action.payload; },

    createProfile: (state, action) => {
      const { name, defaults } = action.payload;
      const id = `profile-${nextId++}`;
      state.profiles[id] = { name, ...defaults };
      state.profileOrder.push(id);
      state.activeProfileId = id;
    },
    deleteProfile: (state, action) => {
      const id = action.payload;
      if (state.profileOrder.length <= 1) return;
      delete state.profiles[id];
      state.profileOrder = state.profileOrder.filter(p => p !== id);
      if (state.activeProfileId === id) {
        state.activeProfileId = state.profileOrder[0];
      }
    },
    switchProfile: (state, action) => {
      state.activeProfileId = action.payload;
    },
    renameProfile: (state, action) => {
      const { id, name } = action.payload;
      state.profiles[id].name = name;
    },
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
  createProfile,
  deleteProfile,
  switchProfile,
  renameProfile,
} = investmentSlice.actions;

export const selectActiveProfile = s => s.investment.profiles[s.investment.activeProfileId];

export default investmentSlice.reducer;
