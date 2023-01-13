import Field from "../components/Field";
import { useBikeComputer } from "../hooks/useBikeComputer";
import ElapsedTimeField from "../components/ElapsedTimeField";
import { Link } from "react-router-dom";
import { GearIcon } from "@radix-ui/react-icons";

function formatValue(value: number | undefined, precision: number = 2) {
  if (value === null || value === undefined || Number.isNaN(value)) {
    return "--";
  }

  return value.toFixed(precision).toString();
}

const GPS_MIN_ACCURACY = 20;

export default function BikeComputerPage() {
  const bikeComputer = useBikeComputer();
  const gpsAvailable = bikeComputer.accuracy < GPS_MIN_ACCURACY;
  return (
    <div className="flex flex-col">
      <div className="flex flex-row justify-end px-2 py-1">
        <Link to="/settings">
          <GearIcon width={24} height={24} />
        </Link>
      </div>
      <ElapsedTimeField segments={bikeComputer.segments} />
      <hr />
      <Field
        title="Speed"
        value={formatValue(bikeComputer.speed)}
        unit="Km/h"
      />
      <hr />
      <Field
        title="Distance"
        value={formatValue(bikeComputer.distance / 1000)}
        unit="Km"
      />
      <hr />
      <Field
        title="Altitude"
        value={formatValue(bikeComputer.altitude)}
        unit="m"
      />
      <hr />
      <Field
        title="Cadence"
        value={formatValue(bikeComputer.crankCadence, 0)}
        unit="rpm"
      />
      <hr />
      <Field
        title="Heart Rate"
        value={formatValue(bikeComputer.hrm?.heartRate, 0)}
        unit="bps"
      />
      <div className="flex flex-col buttons p-2">
        {bikeComputer.running ? (
          <div className="flex flex-row space-x-2">
            <button
              className="grow bg-orange-500 text-white text-2xl p-2 rounded"
              onClick={bikeComputer.pause}
            >
              Pause
            </button>
            <button
              className="grow bg-red-500 text-white text-2xl p-2 rounded"
              onClick={bikeComputer.stop}
            >
              Stop
            </button>
          </div>
        ) : (
          <button
            disabled={!gpsAvailable}
            className="bg-green-500 text-white text-2xl p-2 rounded"
            onClick={bikeComputer.start}
          >
            {gpsAvailable ? "Start" : "Waiting for GPS"}
          </button>
        )}
      </div>
    </div>
  );
}
