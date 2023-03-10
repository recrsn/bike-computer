import { List, ListItem, ListItemText } from "../components/List";
import useSensors, { Feature, Sensor } from "../hooks/useSensors";
import { useNavigate } from "react-router-dom";
import { ArrowLeftIcon, PlusIcon } from "@radix-ui/react-icons";
import { Banner, BannerTitle } from "../components/Banner";
import IconButton from "../components/IconButton";

function SensorInfo({ sensor }: { sensor: Sensor }) {
  return (
    <div className="flex flex-col">
      <span className="text-green-300">Connected to {sensor.device.name}</span>
      <span className="text-sm">
        {sensor.deviceInfo.manufacturer} {sensor.deviceInfo.model}
      </span>
    </div>
  );
}

export default function SettingsPage() {
  const navigate = useNavigate();
  const { available, heartRateMonitor, speedAndCadenceSensors, search } = useSensors();

  const speedSensor = speedAndCadenceSensors
    .filter((s) => s.features.includes(Feature.WheelRevolution))
    .pop();
  const cadenceSensor = speedAndCadenceSensors
    .filter((s) => s.features.includes(Feature.CrankRevolution))
    .pop();

  return (
    <div className="flex flex-col p-2">
      <div className="p-2 flex flex-row">
        <div className="flex flex-row p-2 items-center justify-center">
          <button onClick={() => navigate(-1)}>
            <ArrowLeftIcon width={24} height={24} />
          </button>
        </div>
        <h1 className="text-4xl">Settings</h1>
        <div className="grow" />
        <div className="flex flex-row p-2 items-center justify-center">
          <IconButton disabled={!available} theme="success" onClick={search}>
            <PlusIcon width={24} height={24} />
          </IconButton>
        </div>
      </div>
      {!available && (
        <Banner theme={"error"}>
          <BannerTitle>Bluetooth is not available</BannerTitle>
          <p>
            Connecting to BLE sensors require Bluetooth support and currently only works on
            Google Chrome on Desktop and Android.
          </p>
        </Banner>
      )}
      <List>
        <ListItem title="Heart rate monitor">
          <ListItemText>
            {heartRateMonitor ? (
              <SensorInfo sensor={heartRateMonitor} />
            ) : (
              <span className="text-red-700">Not connected</span>
            )}
          </ListItemText>
        </ListItem>
        <hr />
        <ListItem title="Cadence sensor">
          <ListItemText>
            {cadenceSensor ? (
              <SensorInfo sensor={cadenceSensor} />
            ) : (
              <span className="text-red-700">Not connected</span>
            )}
          </ListItemText>
        </ListItem>
        <hr />
        <ListItem title="Speed sensor">
          <ListItemText>
            {speedSensor ? (
              <SensorInfo sensor={speedSensor} />
            ) : (
              <span className="text-red-700">Not connected</span>
            )}
          </ListItemText>
        </ListItem>
        <hr />
      </List>
    </div>
  );
}
