import { useState } from "react";

export type Segment = {
  start: Date;
  end?: Date;
}

type BikeComputer = {
  running: boolean;
  distance: number;
  speed: number;
  cadence: number;
  heartRate: number;
  power: number;
  startTime?: Date;
  segments: Segment[];
  start: () => void;
  stop: () => void;
  pause: () => void;
  resume: () => void;
}

export function useBikeComputer(): BikeComputer {
  const [startTime, setStartTime] = useState<Date>();
  const [running, setRunning] = useState(false);

  const [distance, setDistance] = useState(0);
  const [speed, setSpeed] = useState(0);

  const [cadence, setCadence] = useState(0);
  const [heartRate, setHeartRate] = useState(0);

  const [power, setPower] = useState(0);
  const [segments, setSegments] = useState([] as Segment[]);

  const start = () => {
    setStartTime(new Date());
    setRunning(true);
    setSegments([{ start: new Date() }]);
  };

  const stop = () => {
    setRunning(false);
    setSegments([...segments, { start: segments[segments.length - 1].start, end: new Date() }]);
  };

  const pause = () => {
    setRunning(false);
    setSegments([...segments, { start: segments[segments.length - 1].start, end: new Date() }]);
  };

  const resume = () => {
    setRunning(true);
    setSegments([...segments, { start: new Date() }]);
  };

  return {
    running,
    distance,
    speed,
    cadence,
    heartRate,
    power,
    segments,
    startTime,
    start,
    stop,
    pause,
    resume
  };
}