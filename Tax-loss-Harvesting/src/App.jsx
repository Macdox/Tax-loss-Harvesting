import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Box } from "@mui/material";
import DropdownAlert from "./componets/DropdownAlert";
import Harvesting from "./componets/Harvesting";
import { fetchInitialData } from "./redux/harvestThunks";
import Holding from "./componets/Holding";
import Tooltip from '@mui/material/Tooltip';

function App() {
  const dispatch = useDispatch();

  // ── read everything we need from Redux ───────────────────────────────────
  const {
    capitalGains: preHarvest = { stcg: {}, ltcg: {} }, // data that came from API
    afterHarvestGains,                                // slice keeps this updated
    holdings = [],
    selectedHoldings = [],
  } = useSelector((state) => state.harvest);

  // kick‑off initial API call once
  useEffect(() => {
    dispatch(fetchInitialData());
  }, [dispatch]);

  // money formatter helper
  const format = (val, forceSign = false) => {
    if (typeof val === "number") {
      if (val < 0 || forceSign)
        return (val < 0 ? "- $ " : "$ ") + Math.abs(val).toLocaleString();
      return "$ " + val.toLocaleString();
    }
    return "$ 0";
  };

  // Only show post-harvest data if user has selected holdings
  const hasSelection = selectedHoldings && selectedHoldings.length > 0;

  // Fallback to pre-harvest data if no selection
  const postData = hasSelection ? afterHarvestGains : preHarvest;

  // Calculate realised capital gains for pre and post
  const preRealised = (preHarvest.stcg.profits - preHarvest.stcg.losses) + (preHarvest.ltcg.profits - preHarvest.ltcg.losses);
  const postRealised = (postData.stcg.profits - postData.stcg.losses) + (postData.ltcg.profits - postData.ltcg.losses);

  // Only show savings if post-harvest realised capital gains is less than pre-harvest
  const showSaving = hasSelection && postRealised < preRealised;

  return (
    <div className="w-screen h-screen bg-[#F1F5F9] overflow-y-scroll">
      {/* ── top bar ── */}
      <div className="w-full h-auto bg-white py-4 px-20 shadow-md">
        <img src="./logo.svg" alt="logo" />
      </div>

      <div className="w-full h-auto bg-[#F1F5F9] md:px-20 px-4">
        <div className="flex items-baseline gap-4 my-5">
          <h1 className="text-2xl font-semibold text-[#0F172A]">Tax Harvesting</h1>
          <Tooltip
            title={
              <span style={{ fontSize: 15, lineHeight: 1.5 }}>
                Lorem ipsum dolor sit amet consectetur. Euismod id posuere nibh semper mattis scelerisque tellus. Vel mattis diam duis morbi tellus dui consectetur.
                <a href="#" style={{ color: '#60A5FA', textDecoration: 'underline', marginLeft: 4 }}>Know More</a>
              </span>
            }
            arrow
            placement="bottom"
            componentsProps={{ tooltip: { sx: { bgcolor: '#1E293B', color: '#fff', maxWidth: 600, fontSize: 15, borderRadius: 2, px: 2, py: 1.5 } } }}
          >
            <p className="text-sm font-medium text-[#0052FE] underline cursor-pointer select-none">How it works?</p>
          </Tooltip>
        </div>

        <DropdownAlert />

        {/* ── cards row ── */}
        <div className="w-full md:flex md:gap-4 my-5">
          {/* PRE  */}
          <div className="flex-1 min-w-[280px]">
            <Harvesting
              title="Pre Harvesting"
              profits={{
                short: format(preHarvest.stcg.profits),
                long: format(preHarvest.ltcg.profits),
              }}
              losses={{
                short: format(preHarvest.stcg.losses, true),
                long: format(preHarvest.ltcg.losses, true),
              }}
              net={{
                short: format(preHarvest.stcg.profits - preHarvest.stcg.losses),
                long: format(preHarvest.ltcg.profits - preHarvest.ltcg.losses),
              }}
              gainstype="Realised"
              Gain={format(
                preHarvest.stcg.profits -
                  preHarvest.stcg.losses +
                  preHarvest.ltcg.profits -
                  preHarvest.ltcg.losses
              )}
            />
          </div>

          {/* POST */}
          <div className="flex-1 min-w-[280px]">
            <Harvesting
              title="After Harvesting"
              bg="linear-gradient(90deg, #3C9AFF 0%, #0066FE 100%)"
              fontColor="#FFFFFF"
              profits={{
                short: format(postData.stcg.profits),
                long: format(postData.ltcg.profits),
              }}
              losses={{
                short: format(postData.stcg.losses, true),
                long: format(postData.ltcg.losses, true),
              }}
              net={{
                short: format(postData.stcg.profits - postData.stcg.losses),
                long: format(postData.ltcg.profits - postData.ltcg.losses),
              }}
              gainstype="Effective"
              Gain={format(
                postData.stcg.profits -
                  postData.stcg.losses +
                  postData.ltcg.profits -
                  postData.ltcg.losses
              )}
              showSaving={showSaving}
              saving={showSaving ? format(preRealised - postRealised) : undefined}
              onToggleSaving={() => console.log("Toggle saving")}
            />
          </div>
        </div>

        {/* ── holdings table ── */}
        <Holding holdings={holdings} />
      </div>
    </div>
  );
}

export default App;
