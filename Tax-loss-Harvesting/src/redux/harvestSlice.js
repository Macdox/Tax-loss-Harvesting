import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  holdings: [],
  selectedHoldings: [],
  capitalGains: {
    stcg: {
      short: 0,
      shortLoss: 0,
    },
    ltcg: {
      short: 0,
      shortLoss: 0,
    },
  },
};

const normalizeGains = (gains) => ({
  stcg: {
    profits: gains?.stcg?.profits ?? gains?.stcg?.short ?? 0,
    losses: gains?.stcg?.losses ?? gains?.stcg?.shortLoss ?? 0,
  },
  ltcg: {
    profits: gains?.ltcg?.profits ?? gains?.ltcg?.short ?? 0,
    losses: gains?.ltcg?.losses ?? gains?.ltcg?.shortLoss ?? 0,
  },
});

const calculateAfterHarvest = (capitalGains, holdings, selectedIds) => {
  if (!capitalGains) return {
    stcg: { profits: 0, losses: 0 },
    ltcg: { profits: 0, losses: 0 },
  };

  const norm = normalizeGains(capitalGains);
  let stProfits = Number(norm.stcg.profits) || 0;
  let stLosses = Number(norm.stcg.losses) || 0;
  let ltProfits = Number(norm.ltcg.profits) || 0;
  let ltLosses = Number(norm.ltcg.losses) || 0;

  selectedIds.forEach(id => {
    const h = holdings.find(h => h.id === id);
    if (!h) return;
    if (h.stcg && typeof h.stcg.gain === 'number' && !isNaN(h.stcg.gain)) {
      if (h.stcg.gain > 0) stProfits += h.stcg.gain;
      else if (h.stcg.gain < 0) stLosses += Math.abs(h.stcg.gain);
    }
    if (h.ltcg && typeof h.ltcg.gain === 'number' && !isNaN(h.ltcg.gain)) {
      if (h.ltcg.gain > 0) ltProfits += h.ltcg.gain;
      else if (h.ltcg.gain < 0) ltLosses += Math.abs(h.ltcg.gain);
    }
  });

  // Ensure all values are numbers and not NaN
  stProfits = isNaN(stProfits) ? 0 : stProfits;
  stLosses = isNaN(stLosses) ? 0 : stLosses;
  ltProfits = isNaN(ltProfits) ? 0 : ltProfits;
  ltLosses = isNaN(ltLosses) ? 0 : ltLosses;

  return {
    stcg: { profits: stProfits, losses: stLosses },
    ltcg: { profits: ltProfits, losses: ltLosses },
  };
};

const harvestSlice = createSlice({
  name: 'harvest',
  initialState,
  reducers: {
    setCapitalGains(state, action) {
      state.capitalGains = normalizeGains(action.payload);
      state.afterHarvestGains = normalizeGains(action.payload);
    },
    setHoldings(state, action) {
      // Ensure every holding has a unique id (use coin if available)
      state.holdings = action.payload.map((h, idx) => ({
        ...h,
        id: h.id || h.coin || `holding-${idx}`
      }));
    },
    toggleHolding(state, action) {
      const id = action.payload;
      const isSelected = state.selectedHoldings.includes(id);

      state.selectedHoldings = isSelected
        ? state.selectedHoldings.filter(i => i !== id)
        : [...state.selectedHoldings, id];

      state.afterHarvestGains = calculateAfterHarvest(
        state.capitalGains,
        state.holdings,
        state.selectedHoldings
      );
    },
    selectAllHoldings(state) {
      state.selectedHoldings = state.holdings.map(h => h.id);
      state.afterHarvestGains = calculateAfterHarvest(
        state.capitalGains,
        state.holdings,
        state.selectedHoldings
      );
    },
    clearSelectedHoldings(state) {
      state.selectedHoldings = [];
      state.afterHarvestGains = state.capitalGains;
    },
  },
});

export const {
  setCapitalGains,
  setHoldings,
  toggleHolding,
  selectAllHoldings,
  clearSelectedHoldings,
} = harvestSlice.actions;

export default harvestSlice.reducer;
