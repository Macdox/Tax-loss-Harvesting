import { Box, Grid } from "@mui/material";
import React from "react";

function Harvesting({
  bg = "#FFFFFF",
  fontColor = "#0F172A",
  title = "Tax Harvesting",
  shortTermLabel = "Short-term",
  longTermLabel = "Long-term",
  profitsLabel = "Profits",
  lossesLabel = "Losses",
  netLabel = "Net Capital Gains",
  profits = { short: "", long: "" },
  losses = { short: "", long: "" },
  net = { short: "", long: "" },
  gainstype = "",
  Gain = "",
  saving = "",
  showSaving = false,
  onToggleSaving = () => {},
}) {
  return (
    <Box
      sx={{
        width: "100%",
        height: "100%",
        background: bg,
        borderRadius: "8px",
        boxShadow: "0px 4px 16px rgba(0, 0, 0, 0.1)",
        color: fontColor,
        padding: "20px",
      }}
    >
      <h2 className="text-xl font-semibold" style={{ color: fontColor }}>
        {title}
      </h2>
      <div className="w-full pr-10 mt-2">
        <div
          className="grid grid-cols-3 font-semibold text-sm gap-4"
          style={{ color: fontColor }}
        >
          <div></div>
          <div className="text-right">{shortTermLabel}</div>
          <div className="text-right">{longTermLabel}</div>
        </div>

        {/*Profits*/}
        <div
          className="grid grid-cols-3 my-2 gap-4"
          style={{ color: fontColor }}
        >
          <div className="font-medium">{profitsLabel}</div>
          <div className="text-right">{profits.short}</div>
          <div className="text-right">{profits.long}</div>
        </div>

        {/*Losses*/}
        <div
          className="grid grid-cols-3 my-2 gap-4"
          style={{ color: fontColor }}
        >
          <div className="font-medium">{lossesLabel}</div>
          <div className="text-right">{losses.short}</div>
          <div className="text-right">{losses.long}</div>
        </div>

        {/*Net gains*/}
        <div
          className="grid grid-cols-3 my-2 gap-4 font-bold"
          style={{ color: fontColor }}
        >
          <div>{netLabel}</div>
          <div className="text-right">{net.short}</div>
          <div className="text-right">{net.long}</div>
        </div>

        <div className="py-5 flex items-center gap-6">
          <h1 className=" text-xl font-semibold">
            {gainstype} Capital Gains:
          </h1>
          <span className="text-[28px] leading-[36px] font-semibold">
            {" "}
            {Gain}
          </span>
        </div>

        {showSaving && (
          <div
            className="py-2 flex items-center gap-2 cursor-pointer"
            style={{
              color: "#fff",
              borderRadius: 6,
              padding: "4px 0",
              width: "fit-content",
              fontSize: 16,
            }}
            onClick={onToggleSaving}
          >
            <span role="img" aria-label="party">
              🎉
            </span>
            You are going to save upto&nbsp;
            <span style={{ fontWeight: 600, fontSize: 16 }}>{saving}</span>
          </div>
        )}
      </div>
    </Box>
  );
}

export default Harvesting;
