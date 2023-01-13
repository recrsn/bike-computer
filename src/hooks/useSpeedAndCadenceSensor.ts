import useSensors from "./useSensors";
import { useCallback, useEffect, useRef, useState } from "react";

const TYRE_CIRCUMFERENCE_METRES = 2.155;
const MAX_UINT16 = 65535;
const CSC_TIME_FACTOR = 1024;

function diff(last: number, current: number, overflow: number) {
  const diff = current - last;
  if (diff < 0) {
    return diff + overflow;
  }
  return diff;
}

export function useSpeedAndCadenceSensor() {
  const [speed, setSpeed] = useState<number>();
  const [crankCadence, setCrankCadence] = useState<number>();
  const [recording, setRecording] = useState(false);
  const initialWheelRevolutions = useRef(0);
  const [distance, setDistance] = useState<number | undefined>();

  const { speedAndCadenceSensors } = useSensors();

  const sensorRef = useRef<BluetoothRemoteGATTCharacteristic[]>([]);
  const lastWheelRevolutionsRef = useRef<number>(0);
  const lastCrackRevolutionsRef = useRef<number>(0);
  const lastWheelEventTimeRef = useRef<number>(0);
  const lastCrankEventTimeRef = useRef<number>(0);

  const onCharacteristicValueChange = useCallback(
    (event: Event) => {
      // @ts-ignore
      const value = event.target!.value as DataView;
      const flags = value.getUint8(0);
      // @ts-ignore
      console.log(
        (event.target! as BluetoothRemoteGATTCharacteristic).service.device
          .name,
        flags
      );

      let index = 1;

      const wheelRevolutionDataPresent = flags & 0x1;
      if (wheelRevolutionDataPresent) {
        const cumulativeWheelRevolutions = value.getUint32(index, true);
        index += 4;
        const lastWheelEventTime = value.getUint16(index, true);
        index += 2;

        const speed =
          (((lastWheelRevolutionsRef.current - cumulativeWheelRevolutions) *
              TYRE_CIRCUMFERENCE_METRES) /
            diff(
              lastWheelEventTimeRef.current,
              lastWheelEventTime,
              MAX_UINT16
            )) *
          CSC_TIME_FACTOR;
        setSpeed(speed);

        if (recording) {
          setDistance((cumulativeWheelRevolutions - initialWheelRevolutions.current) * TYRE_CIRCUMFERENCE_METRES);
        }
      }


      const crankRevolutionDataPresent = flags & 0x2;
      if (crankRevolutionDataPresent) {
        const cumulativeCrankRevolutions = value.getUint16(index, true);
        index += 2;
        const lastCrankEventTime = value.getUint16(index, true);
        index += 2;

        const crankCadence =
          (diff(
              lastCrackRevolutionsRef.current,
              cumulativeCrankRevolutions,
              MAX_UINT16
            ) /
            diff(
              lastCrankEventTimeRef.current,
              lastCrankEventTime,
              MAX_UINT16
            )) *
          CSC_TIME_FACTOR;
        setCrankCadence(crankCadence);
        console.log(
          crankCadence,
          cumulativeCrankRevolutions,
          lastCrankEventTime
        );
      }
    },
    [setSpeed, setCrankCadence]
  );

  const startRecording = useCallback(() => {
    setRecording(true);
    setDistance(0);
    initialWheelRevolutions.current = lastWheelRevolutionsRef.current;
  }, [setRecording, setDistance]);

  const stopRecording = useCallback(() => {
    setRecording(false);
  }, [setRecording]);

  useEffect(() => {
    if (!speedAndCadenceSensors) {
      return;
    }
    const sensors = sensorRef.current;

    speedAndCadenceSensors.forEach((sensor) => {
      sensor.device
        .gatt!.connect()
        .then((server) => server.getPrimaryService("cycling_speed_and_cadence"))
        .then((service) => service.getCharacteristic("csc_measurement"))
        .then((characteristic) => {
          sensors.push(characteristic);
          return characteristic.startNotifications();
        })
        .then((characteristic) =>
          characteristic.addEventListener(
            "characteristicvaluechanged",
            onCharacteristicValueChange
          )
        );
    });

    return () => {
      sensors.forEach((characteristic) => {
        characteristic
          .stopNotifications()
          .then(() =>
            characteristic.removeEventListener(
              "characteristicvaluechanged",
              onCharacteristicValueChange
            )
          );
      });
    };
  }, [onCharacteristicValueChange, speedAndCadenceSensors]);

  return {
    speed,
    distance,
    crankCadence,
    startRecording,
    stopRecording
  };
}
