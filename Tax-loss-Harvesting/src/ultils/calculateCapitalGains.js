export function calculatePostHarvestGains(allHoldings, selectedIds) {
  let stcg = { profits: 0, losses: 0 };
  let ltcg = { profits: 0, losses: 0 };

  allHoldings.forEach((holding) => {
    const isSelected = selectedIds.includes(holding.id);

    // Only reduce gains if selected
    const stcgValue = isSelected ? 0 : holding.stcg;
    const ltcgValue = isSelected ? 0 : holding.ltcg;

    if (stcgValue >= 0) stcg.profits += stcgValue;
    else stcg.losses += Math.abs(stcgValue);

    if (ltcgValue >= 0) ltcg.profits += ltcgValue;
    else ltcg.losses += Math.abs(ltcgValue);
  });

  return { stcg, ltcg };
}
