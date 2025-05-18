import React, { useState } from "react";
import {
  Alert,
  Collapse,
  IconButton,
  Typography,
} from "@mui/material";
import { Info, InfoIcon} from "lucide-react";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { styled } from "@mui/material/styles";

const ExpandButton = styled(IconButton)(({ open }) => ({
  transform: open ? "rotate(180deg)" : "rotate(0deg)",
  transition: "transform 0.2s ease",
  marginLeft: "auto",
  padding: 4,
}));

export default function DropdownAlert() {
  const [open, setOpen] = useState(false);

  return (
    <Alert
      icon={false}
      onClick={() => setOpen(!open)}
      sx={{
        border: "1.5px solid #0052FE",
        borderRadius: "10px",
        backgroundColor: "#EAF2FF",
        px: 2,
        py: 0,
        cursor: "pointer",
        width: '100%', // Make alert full width
        display: 'block', // Prevent column layout
        boxSizing: 'border-box',
      }}
    >
      {/* Header Row */}
      <div className="flex gap-2 items-center">
        <Typography
          component="span"
        >
          <InfoIcon color="#0052FE" size={24} />
        </Typography>
        <Typography sx={{ color: "#0F172A", fontWeight: 600, fontSize: 16, lineHeight: 1.5 }}>
          Important Notes & Disclaimers
        </Typography>


        <ExpandButton
          open={open ? 1 : 0}
          onMouseDown={(e) => e.preventDefault()}
        >
          <ExpandMoreIcon fontSize="small" />
        </ExpandButton>
      </div>

      {/* Expandable Content */}
      <Collapse in={open} color="#0F172A">
        <ul className="list-disc pl-6 mt-2 text-[#0F172A] text-[14px] font-weight-400">
          <li>
            Tax-loss harvesting is currently not allowed under Indian tax regulations.
            Please consult your tax advisor before making any decisions.
          </li>
          <li>
            Tax harvesting does not apply to derivatives or futures. These are handled
            separately as business income under tax rules.
          </li>
          <li>
            Price and market value data is fetched from Coingecko, not from individual
            exchanges. As a result, values may slightly differ from the ones on your exchange.
          </li>
          <li>
            Some countries do not have a short-term / long-term bifurcation.
            For now, we are calculating everything as long-term.
          </li>
          <li>
            Only realized losses are considered for harvesting.
            Unrealized losses in held assets are not counted.
          </li>
        </ul>
      </Collapse>
    </Alert>
  );
}
