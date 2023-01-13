import useSensors from "./useSensors";
import { useCallback, useEffect, useRef, useState } from "react";

type HeartRateMonitorValue = {
  heartRate: number;
  contactDetected?: boolean;
  energyExpended?: number;
};

export function useHeartRate() {
  const { heartRateMonitor } = useSensors();
  const [value, setValue] = useState<HeartRateMonitorValue>();
  const hrmRef = useRef<BluetoothRemoteGATTCharacteristic>();

  const onCharacteristicValueChange = useCallback(
    (event: Event) => {
      // @ts-ignore
      const value = event.target!.value as DataView;
      const flags = value.getUint8(0);
      const result: HeartRateMonitorValue = {
        heartRate: 0,
      };

      let index = 1;

      const rate16Bits = flags & 0x1;
      if (rate16Bits) {
        result.heartRate = value.getUint16(index, true);
        index += 2;
      } else {
        result.heartRate = value.getUint8(index);
        index += 1;
      }
      const contactDetected = flags & 0x2;
      const contactSensorPresent = flags & 0x4;
      if (contactSensorPresent) {
        result.contactDetected = !!contactDetected;
      }
      const energyPresent = flags & 0x8;
      if (energyPresent) {
        result.energyExpended = value.getUint16(index, true);
        index += 2;
      }

      setValue(result);
    },
    [setValue]
  );

  useEffect(() => {
    if (!heartRateMonitor) {
      return;
    }

    heartRateMonitor.device
      .gatt!.connect()
      .then((server) => server.getPrimaryService("heart_rate"))
      .then((service) => service.getCharacteristic("heart_rate_measurement"))
      .then((characteristic) => {
        hrmRef.current = characteristic;
        return characteristic.startNotifications();
      })
      .then((characteristic) =>
        characteristic.addEventListener(
          "characteristicvaluechanged",
          onCharacteristicValueChange
        )
      );

    return () => {
      if (hrmRef.current) {
        const hrm = hrmRef.current;
        hrm
          .stopNotifications()
          .then(() =>
            hrm.removeEventListener(
              "characteristicvaluechanged",
              onCharacteristicValueChange
            )
          );
      }
    };
  }, [heartRateMonitor, onCharacteristicValueChange]);

  return value;
}
