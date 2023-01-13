import { useState } from "react";
import useGPS from "./useGPS";
import { useHeartRate } from "./useHeartRate";
import { useSpeedAndCadenceSensor } from "./useSpeedAndCadenceSensor";

export type Segment = {
  start: Date;
  end?: Date;
};

export function useBikeComputer() {
  const gps = useGPS();
  const hrm = useHeartRate();
  const { speed, crankCadence } = useSpeedAndCadenceSensor();
  const [startTime, setStartTime] = useState<Date>();
  const [running, setRunning] = useState(false);

  const [segments, setSegments] = useState([] as Segment[]);

  const start = () => {
    setStartTime(new Date());
    setRunning(true);
    setSegments([{ start: new Date() }]);
    gps.start();
  };

  const stop = () => {
    setRunning(false);
    setSegments([
      ...segments,
      { start: segments[segments.length - 1].start, end: new Date() }
    ]);
    gps.stop();
  };

  const pause = () => {
    setRunning(false);
    setSegments([
      ...segments,
      { start: segments[segments.length - 1].start, end: new Date() }
    ]);
    gps.stop();
  };

  const resume = () => {
    setRunning(true);
    setSegments([...segments, { start: new Date() }]);
  };

  return {
    running,
    crankCadence,
    hrm,
    segments,
    startTime,

    accuracy: gps.accuracy,
    distance: gps.distance,
    speed: speed ?? gps.speed ?? NaN,
    altitude: gps.altitude ?? NaN,

    start,
    stop,
    pause,
    resume
  };
}
