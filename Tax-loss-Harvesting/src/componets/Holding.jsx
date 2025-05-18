import { Box, Checkbox, Grid } from "@mui/material";
import React, { useState, useMemo, useEffect, useCallback } from "react";
import { useDispatch } from "react-redux";
import {
  toggleHolding,
  selectAllHoldings,
  clearSelectedHoldings,
} from "../redux/harvestSlice";

// Utility to abbreviate numbers (K/M/B), but show full value for abs(value) < 1 with up to 8 decimals
function abbreviateNumber(value) {
  if (value === null || value === undefined || isNaN(value)) return "-";
  const abs = Math.abs(Number(value));
  if (abs < 1) {
    let str = Number(value)
      .toFixed(8)
      .replace(/(\.\d*?[1-9])0+$/, "$1");
    if (/\.\d{1,3}$/.test(str))
      str += "0".repeat(4 - (str.split(".")[1]?.length || 0));
    return str;
  }
  if (abs >= 1.0e9) return (value / 1.0e9).toFixed(4) + "B";
  if (abs >= 1.0e6) return (value / 1.0e6).toFixed(4) + "M";
  if (abs >= 1.0e3) return (value / 1.0e3).toFixed(4) + "K";
  return Number(value).toFixed(4);
}

function ensureId(holding, idx) {
  // supply a deterministic fallback id if none present or duplicate
  return {
    ...holding,
    id: holding.id || `${holding.coin}-${idx}`,
  };
}

function Holding({ holdings = [] }) {
  const dispatch = useDispatch();

  // local mirror with selection flag
  const [rows, setRows] = useState([]);
  const [showAll, setShowAll] = useState(false);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });

  // initialise / reset when props change
  useEffect(() => {
    const uniqueRows = holdings.map(ensureId).map((h) => ({ ...h, selected: false }));
    setRows(uniqueRows);
    dispatch(clearSelectedHoldings());
  }, [holdings, dispatch]);

  // ---------- selection helpers ----------
  const allChecked = rows.length > 0 && rows.every((r) => r.selected);
  const someChecked = rows.some((r) => r.selected) && !allChecked;

  const handleParentCheckbox = (e) => {
    const checked = e.target.checked;
    setRows((prev) => prev.map((r) => ({ ...r, selected: checked })));
    checked ? dispatch(selectAllHoldings()) : dispatch(clearSelectedHoldings());
  };

  const handleChildCheckbox = useCallback(
    (id) => (e) => {
      const checked = e.target.checked;
      setRows((prev) => prev.map((r) => (r.id === id ? { ...r, selected: checked } : r)));
      dispatch(toggleHolding(id));
    },
    [dispatch]
  );

  // ---------- sorting ----------
  const getSortValue = (h, key) => {
    switch (key) {
      case "short-term":
        return h.stcg?.balance ?? 0;
      case "long-term":
        return h.ltcg?.balance ?? 0;
      case "holdings":
        return h.totalHolding ?? 0;
      case "current":
        return h.currentPrice ?? 0;
      default:
        return 0;
    }
  };

  const sortedRows = useMemo(() => {
    if (!sortConfig.key) return rows;
    const dir = sortConfig.direction === "asc" ? 1 : -1;
    return [...rows].sort((a, b) => {
      const av = getSortValue(a, sortConfig.key);
      const bv = getSortValue(b, sortConfig.key);
      return av === bv ? 0 : av > bv ? dir : -dir;
    });
  }, [rows, sortConfig]);

  const visibleRows = showAll ? sortedRows : sortedRows.slice(0, 4);

  const toggleSort = (key) =>
    setSortConfig((prev) =>
      prev.key === key
        ? { key, direction: prev.direction === "asc" ? "desc" : "asc" }
        : { key, direction: "asc" }
    );

  const sortArrow = (key) =>
    sortConfig.key === key ? (sortConfig.direction === "asc" ? "↑" : "↓") : "";

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 2,
        p: 2,
        bgcolor: "#FFFFFF",
        borderRadius: 2,
        boxShadow: 1,
      }}
    >
      <h1 className="text-xl font-semibold text-[#0F172A]">Holdings</h1>

      {/* header */}
      <Grid
        container
        spacing={6}
        sx={{
          px: 5,
          py: 0.5,
          alignItems: "center",
          textAlign: "right",
          justifyContent: "space-between",
          bgcolor: "#F1F5F9",
          borderRadius: 2,
        }}
      >
        <Grid item sx={{ minWidth: 220, maxWidth: 300 }}>
          <Box className="flex items-center gap-2 w-full">
            <Checkbox
              checked={allChecked}
              indeterminate={someChecked}
              onChange={handleParentCheckbox}
            />
            <span className="text-base font-medium text-[#0F172A]">Assets</span>
          </Box>
        </Grid>
        {[
          { label: "Holdings", key: "holdings", width: 140 },
          { label: "Total Current Values", key: "current", width: 110 },
          { label: "Short-term", key: "short-term", width: 110 },
          { label: "Long-term", key: "long-term", width: 110 },
        ].map(({ label, key, width }) => (
          <Grid item key={key} sx={{ minWidth: width, maxWidth: width }}>
            <h2
              className="text-base font-semibold text-[#0F172A] cursor-pointer select-none"
              onClick={() => toggleSort(key)}
            >
              {label} {sortArrow(key)}
            </h2>
            {key === "holdings" && (
              <p className="text-xs text-[#6B7280]">Current Market Rate</p>
            )}
          </Grid>
        ))}
        <Grid item sx={{ minWidth: 110, maxWidth: 110 }}>
          <h2 className="text-base font-semibold text-[#0F172A]">Amount to sell</h2>
        </Grid>
      </Grid>

      {/* rows */}
      {visibleRows.map((h) => (
        <Grid
          key={h.id} // ✅ unique & stable
          container
          spacing={6}
          sx={{
            px: 5,
            py: 0.5,
            alignItems: "center",
            justifyContent: "space-between",
            textAlign: "right",
          }}
        >
          {/* asset */}
          <Grid item sx={{ minWidth: 220, maxWidth: 300 }}>
            <Box className="flex items-center gap-2 w-full">
              <Checkbox checked={h.selected} onChange={handleChildCheckbox(h.id)} />
              <img src={h.logo} alt="logo" className="w-7" />
              <span className="text-left">
                <h2 className="text-base font-medium">{h.coin}</h2>
                <h3 className="text-sm font-normal">{h.coinName}</h3>
              </span>
            </Box>
          </Grid>

          {/* holdings */}
          <Grid item sx={{ minWidth: 140, maxWidth: 140 }}>
            <h2 className="text-base font-semibold text-[#0F172A]" title={h.totalHolding}>
              {abbreviateNumber(h.totalHolding)} {h.coin}
            </h2>
            <p className="text-xs font-medium text-[#6B7280]" title={h.averageBuyPrice}>
              $ {abbreviateNumber(h.averageBuyPrice)}/{h.coin}
            </p>
          </Grid>

          {/* current price */}
          <Grid item sx={{ minWidth: 110, maxWidth: 110 }}>
            <h2 className="text-base font-semibold text-[#0F172A]" title={h.currentPrice}>
              $ {abbreviateNumber(h.currentPrice)}
            </h2>
          </Grid>

          {/* short term */}
          <Grid item sx={{ minWidth: 110, maxWidth: 110 }}>
            <h2
              className={`text-base font-semibold ${
                h.stcg?.gain < 0 ? "text-red-600" : h.stcg?.gain > 0 ? "text-green-600" : "text-[#0F172A]"
              }`}
            >
              ${" "}
              {h.stcg
                ? (h.stcg.gain < 0 ? "-" : h.stcg.gain > 0 ? "+" : "") +
                  abbreviateNumber(Math.abs(h.stcg.gain))
                : "-"}
            </h2>
            <p
              className={`text-xs font-medium ${
                h.stcg?.gain < 0 ? "text-red-600" : h.stcg?.gain > 0 ? "text-green-600" : "text-[#6B7280]"
              }`}
            >
              {h.stcg
                ? (h.stcg.gain < 0 ? "-" : h.stcg.gain > 0 ? "+" : "") +
                  abbreviateNumber(Math.abs(h.stcg.balance))
                : "-"} {h.coin}
            </p>
          </Grid>

          {/* long term */}
          <Grid item sx={{ minWidth: 110, maxWidth: 110 }}>
            <h2
              className={`text-base font-semibold ${
                h.ltcg?.gain < 0 ? "text-red-600" : h.ltcg?.gain > 0 ? "text-green-600" : "text-[#0F172A]"
              }`}
            >
              ${" "}
              {h.ltcg
                ? (h.ltcg.gain < 0 ? "-" : h.ltcg.gain > 0 ? "+" : "") +
                  abbreviateNumber(Math.abs(h.ltcg.gain))
                : "-"} {h.coin}
            </h2>
            <p
              className={`text-xs font-medium ${
                h.ltcg?.gain < 0 ? "text-red-600" : h.ltcg?.gain > 0 ? "text-green-600" : "text-[#6B7280]"
              }`}
            >
              {h.ltcg
                ? (h.ltcg.gain < 0 ? "-" : h.ltcg.gain > 0 ? "+" : "") +
                  abbreviateNumber(Math.abs(h.ltcg.balance))
                : "-"} {h.coin}
            </p>
          </Grid>

          {/* amount to sell */}
          <Grid item sx={{ minWidth: 110, maxWidth: 110 }}>
            <h2 className="text-base font-semibold text-[#0F172A]" title={h.selected && h.totalHolding ? h.totalHolding : ""}>
              {h.selected ? abbreviateNumber(h.totalHolding) : "0.0000"} {h.coin}
            </h2>
          </Grid>
        </Grid>
      ))}

      {/* view more */}
      {rows.length > 4 && (
        <Box className="flex justify-start my-4 pl-4">
          <span
            className="text-[#0052FE] cursor-pointer underline text-base font-medium hover:text-blue-800 select-none"
            onClick={() => setShowAll((p) => !p)}
          >
            {showAll ? "View less" : "View all"}
          </span>
        </Box>
      )}
    </Box>
  );
}

export default Holding;
