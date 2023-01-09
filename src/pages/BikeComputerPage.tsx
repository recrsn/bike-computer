import Field from "../components/Field";
import { useBikeComputer } from "../hooks/useBikeComputer";
import ElapsedTimeField from "../components/ElapsedTimeField";

export default function BikeComputerPage() {
  const bikeComputer = useBikeComputer();
  return (
    <div className="flex flex-col">
      <div></div>
      <ElapsedTimeField segments={bikeComputer.segments} />
      <hr />
      <Field title="Speed" value="0" unit="Km/h" />
      <hr />
      <Field title="Distance" value="0" unit="Km" />
      <hr />
      <Field title="Altitude" value="0" unit="m" />
      <hr />
      <Field title="Cadence" value="0" unit="rpm" />
      <hr />
      <Field title="Heart Rate" value="0" unit="bps" />
      <div className="flex flex-col buttons p-2">
        {bikeComputer.running ? (
          <div className="flex flex-row space-x-2">
            <button className="grow bg-orange-500 text-white text-2xl p-2 rounded"
                    onClick={bikeComputer.pause}>Pause
            </button>
            <button className="grow bg-red-500 text-white text-2xl p-2 rounded"
                    onClick={bikeComputer.stop}>Stop
            </button>
          </div>
        ) : (
          <button className="bg-green-500 text-white text-2xl p-2 rounded"
                  onClick={bikeComputer.start}>Start</button>
        )}
      </div>
    </div>
  );
}
