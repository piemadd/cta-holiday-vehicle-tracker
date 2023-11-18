import { DataManager } from "./dataManager.js";
import { agencies } from "./config.js";
import { useEffect, useState } from "preact/hooks";

const hoursMinutesUntilArrival = (arrivalTime) => {
  const now = new Date();
  const arrival = new Date(arrivalTime);

  const minutes = Math.floor((arrival - now) / 1000 / 60);
  const hours = Math.floor(minutes / 60);

  if (minutes < 1 && hours < 1) return "Due";
  if (hours === 0) return `${minutes % 60}m`;
  if (minutes % 60 === 0) return `${hours}h`;

  return `${hours}h ${minutes % 60}m`;
};

const timeFormat = (time) => {
  const date = new Date(time);
  return date.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
};

const List = ({ style, dataManagerObject, agencyOverride, vehicleType }) => {
  const agency = agencyOverride ?? "ctat";

  const dataManager = dataManagerObject ?? new DataManager();
  const [tripID, setTripID] = useState("");
  const [trip, setTrip] = useState({});
  const [lastUpdated, setLastUpdated] = useState(new Date().valueOf());
  const [loadingMessage, setLoadingMessage] = useState("Loading Data");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const updateData = () => {
      dataManager.getData(agency, "lastUpdated").then((data) => {
        setLastUpdated(data);
      });

      dataManager.getData(agency, "trains").then((data) => {
        const trainKeys = Object.keys(data);

        if (trainKeys.length === 0) {
          setLoadingMessage(
            `The Holiday ${vehicleType} is not currently running`
          );
          return;
        }

        setTrip(data[trainKeys[0]]);
        setTripID(trainKeys[0]);
        setIsLoading(false);
      });
    };

    setInterval(() => {
      updateData();
    }, 10000);

    updateData();
  }, []);

  return isLoading ? (
    <div className='contentList' style={style}>
      <div className='trainHeader'>
        <p>{loadingMessage}</p>
        <p>
          As of{" "}
          {new Date(lastUpdated).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
          })}
        </p>
      </div>
    </div>
  ) : (
    <div className='contentList' style={style}>
      <div className='trainHeader' style={{
        backgroundColor: `#${trip.lineColor}`,
        color: `#${trip.lineTextColor}`
      }}>
        <h2>
          {trip.line}
          {agencies[agency].addLine ? " Line " : " "}#{tripID}
        </h2>
        <p>
          As of{" "}
          {new Date(lastUpdated).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
          })}
        </p>
        <p>Service to {trip.dest}</p>
      </div>
      <section className='trainStops'>
        {trip.predictions.map((prediction, i) => {
          if (i === 0) console.log(prediction);
          return (
            <div className='trainStop'>
              <p>
                <strong>{prediction.stationName}</strong>
              </p>
              <span>
                <h3>{hoursMinutesUntilArrival(prediction.actualETA)}</h3>
                <p style='font-size: 0.8em;'>
                  {timeFormat(prediction.actualETA)}
                </p>
              </span>
            </div>
          );
        })}
      </section>
    </div>
  );
};

export default List;
