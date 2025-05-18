import { setCapitalGains, setHoldings } from "./harvestSlice";

export const fetchInitialData = () => async (dispatch) => {
  try {
    // If you have local mock data:
    const capitalGainsRaw = await import('../apis/capitalGains.json').then(mod => mod.default);
    const capitalGains = capitalGainsRaw.capitalGains || capitalGainsRaw;

    const holdings = await import('../apis/holding.json').then(mod => mod.default);

    dispatch(setCapitalGains(capitalGains));
    dispatch(setHoldings(holdings.map((h, index) => ({ ...h, id: h.coin || `holding-${index}` }))));
  } catch (error) {
    console.error('Failed to fetch data:', error);
  }
};
