import { create } from "zustand";

export enum Feature {
  HeartRate = "heart_rate",
  WheelRevolution = "wheel_revolution",
  CrankRevolution = "crank_revolution",
}

type DeviceInfo = {
  manufacturer?: string;
  model?: string;
};

export type Sensor = {
  features: Feature[];
  device: BluetoothDevice;
  deviceInfo: DeviceInfo;
};

type SensorsState = {
  heartRateMonitor?: Sensor;
  speedAndCadenceSensor: Sensor[];

  setHeartRateMonitor: (device: Sensor) => void;
  addSpeedAndCadenceSensor: (device: Sensor) => void;
};

const useSensorStore = create<SensorsState>()((set) => ({
  heartRateMonitor: undefined,
  speedAndCadenceSensor: [],
  setHeartRateMonitor: (device) => set(() => ({ heartRateMonitor: device })),
  addSpeedAndCadenceSensor: (device) =>
    set((state) => ({
      speedAndCadenceSensor: [...state.speedAndCadenceSensor, device]
    }))
}));

async function readDeviceInfo(btDevice: BluetoothDevice): Promise<DeviceInfo> {
  const deviceInfo = await btDevice.gatt!.getPrimaryService(
    "device_information"
  );
  if (!deviceInfo) {
    return {};
  }

  const decoder = new TextDecoder("utf-8");

  const [manufacturer, model] = await Promise.all([
    deviceInfo.getCharacteristic("manufacturer_name_string"),
    deviceInfo.getCharacteristic("model_number_string")
  ]);

  return {
    manufacturer: manufacturer
      ? decoder.decode(await manufacturer.readValue())
      : undefined,
    model: model ? decoder.decode(await model.readValue()) : undefined
  };
}

const HEART_RATE_SERVICE_UUID = "0000180d-0000-1000-8000-00805f9b34fb";
const SPEED_AND_CADENCE_SERVICE_UUID = "00001816-0000-1000-8000-00805f9b34fb";
export default function useSensors() {
  const [heartRateMonitor, setHeartRateMonitor] = useSensorStore((state) => [
    state.heartRateMonitor,
    state.setHeartRateMonitor
  ]);
  const [speedAndCadenceSensors, addSpeedAndCadenceSensor] = useSensorStore(
    (state) => [state.speedAndCadenceSensor, state.addSpeedAndCadenceSensor]
  );

  const search = async () => {
    const btDevice = await navigator.bluetooth.requestDevice({
      filters: [
        { services: ["heart_rate"] },
        { services: ["cycling_speed_and_cadence"] }
      ],
      optionalServices: ["device_information"]
    });

    const server = await btDevice.gatt!.connect();

    const [services, deviceInfo] = await Promise.all([
      server.getPrimaryServices(),
      readDeviceInfo(btDevice)
    ]);

    for (const service of services) {
      if (service.uuid === HEART_RATE_SERVICE_UUID) {
        setHeartRateMonitor({
          device: btDevice,
          deviceInfo,
          features: [Feature.HeartRate]
        });
      }

      if (service.uuid === SPEED_AND_CADENCE_SERVICE_UUID) {
        const characteristic = await service.getCharacteristic("csc_feature");
        const value = await characteristic.readValue();
        const flags = value.getUint16(0, true);
        console.log(flags);

        const features: Feature[] = [];
        if (flags & 0x01) {
          features.push(Feature.WheelRevolution);
        }

        if (flags & 0x02) {
          features.push(Feature.CrankRevolution);
        }

        console.log(features);

        addSpeedAndCadenceSensor({ device: btDevice, deviceInfo, features });
      }
    }
  };

  return {
    heartRateMonitor,
    speedAndCadenceSensors,
    search,
    available: "bluetooth" in navigator
  };
}
