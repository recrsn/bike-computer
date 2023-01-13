import { useCallback, useState } from "react";
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
  const {
    speed,
    crankCadence,
    distance,
    startRecording,
    stopRecording
  } = useSpeedAndCadenceSensor();
  const [startTime, setStartTime] = useState<Date>();
  const [running, setRunning] = useState(false);

  const [segments, setSegments] = useState([] as Segment[]);

  const start = useCallback(() => {
    setStartTime(new Date());
    setRunning(true);
    setSegments([{ start: new Date() }]);
    startRecording();
    gps.start();
  }, [gps]);

  const stop = useCallback(() => {
    setRunning(false);
    setSegments([
      ...segments,
      { start: segments[segments.length - 1].start, end: new Date() }
    ]);
    gps.stop();
    stopRecording();
  }, [gps, segments]);

  const pause = useCallback(() => {
    setRunning(false);
    setSegments([
      ...segments,
      { start: segments[segments.length - 1].start, end: new Date() }
    ]);
    gps.stop();
  }, [gps, segments]);

  const resume = useCallback(() => {
    setRunning(true);
    setSegments([...segments, { start: new Date() }]);
  }, [segments]);

  return {
    running,
    crankCadence,
    hrm,
    segments,
    startTime,

    accuracy: gps.accuracy,
    distance: distance ?? gps.distance ?? NaN,
    speed: speed ?? gps.speed ?? NaN,
    altitude: gps.altitude ?? NaN,

    start,
    stop,
    pause,
    resume
  };
}
