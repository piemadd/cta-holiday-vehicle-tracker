import { useState } from "preact/hooks";
import List from "./list";
import Map from "./map";
import { DataManager } from "./dataManager";
import useWindowSize from "./useWindowSize";

export const App = () => {
  const [trackingMode, setTrackingMode] = useState("Train");
  const [viewType, setViewType] = useState("List");

  const size = useWindowSize();

  const dataManager = new DataManager();

  return (
    <>
      <main>
        <section className='header'>
          <h1>Holiday {trackingMode} Tracker</h1>
          <h2>
            <i>
              Powered by{" "}
              <a href='https://transitstat.us' target='_blank'>
                Transitstat.us
              </a>
            </i>
          </h2>
          <p>
            <i>
              Also follow the train and Bus{" "}
              <a href='https://bsky.app/profile/holiday.transitstat.us' target='_blank'>
                on Bluesky
              </a>
            </i>
          </p>
          <section className='modeSelectSection'>
            <div className='modeSelect'>
              <button
                style={{
                  background: trackingMode === "Train" ? "#257433" : "#184a21",
                  textDecoration:
                    trackingMode === "Train" ? "underline dotted" : "none",
                }}
                onClick={() => setTrackingMode("Train")}
              >
                Train
              </button>
              <button
                style={{
                  background: trackingMode === "Bus" ? "#882b2b" : "#611f1f",
                  textDecoration:
                    trackingMode === "Bus" ? "underline dotted" : "none",
                }}
                onClick={() => setTrackingMode("Bus")}
              >
                Bus
              </button>
            </div>
            {size.width < 780 && (
              <div className='modeSelect'>
                <button
                  style={{
                    background: viewType === "List" ? "#257433" : "#184a21",
                    textDecoration:
                      viewType === "List" ? "underline dotted" : "none",
                  }}
                  onClick={() => setViewType("List")}
                >
                  List
                </button>
                <button
                  style={{
                    background: viewType === "Map" ? "#882b2b" : "#611f1f",
                    textDecoration:
                      viewType === "Map" ? "underline dotted" : "none",
                  }}
                  onClick={() => setViewType("Map")}
                >
                  Map
                </button>
              </div>
            )}
          </section>
        </section>
        <section className='contentHolder'>
          <List
            dataManagerObject={dataManager}
            vehicleType={"Train"}
            style={{
              display:
                trackingMode === "Train" &&
                (viewType === "List" || size.width > 780)
                  ? "flex"
                  : "none",
            }}
          />
          <Map
            style={{
              display:
                trackingMode === "Train" &&
                (viewType === "Map" || size.width > 780)
                  ? "flex"
                  : "none",
            }}
            dataManagerObject={dataManager}
          />

          <List
            dataManagerObject={dataManager}
            vehicleType={"Bus"}
            agencyOverride={"ctab"}
            style={{
              display:
                trackingMode === "Bus" &&
                (viewType === "List" || size.width > 780)
                  ? "flex"
                  : "none",
            }}
          />
          <Map
            style={{
              display:
                trackingMode === "Bus" &&
                (viewType === "Map" || size.width > 780)
                  ? "flex"
                  : "none",
            }}
            dataManagerObject={dataManager}
            agencyOverride={"ctab"}
          />
        </section>
        <footer>
          <p>
            v0.1.0 | &copy;<a href='https://piemadd.com/'>Piero</a> 2024 |{" "}
            <a href='https://transitstat.us/api' target='_blank'>
              API
            </a>
          </p>
        </footer>
      </main>
    </>
  );
};
