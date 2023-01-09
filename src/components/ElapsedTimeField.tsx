import Field from "./Field";
import { Segment } from "../hooks/useBikeComputer";
import { useEffect, useState } from "react";

function formatElapsedTime(elapsedMs: number) {
  const elapsedSeconds = elapsedMs / 1000;
  const hours = Math.floor(elapsedSeconds / 3600);
  const minutes = Math.floor((elapsedSeconds % 3600) / 60);
  const seconds = Math.floor(elapsedSeconds % 60);
  return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
}

type ElapsedTimeFieldProps = {
  segments: Segment[];
}

export default function ElapsedTimeField({ segments }: ElapsedTimeFieldProps) {
  const elapsedTimeInSegments = segments.filter(segment => !!segment.end).reduce((acc, segment) => acc + (segment.end?.getTime()! - segment.start.getTime()), 0);
  const lastSegment = segments[segments.length - 1];

  const [time, setTime] = useState(elapsedTimeInSegments);
  const running = lastSegment && !lastSegment.end;

  useEffect(() => {
    if (!running) return;
    const interval = setInterval(() => {
      setTime(elapsedTimeInSegments + new Date().getTime() - lastSegment.start.getTime());
    }, 1000);
    return () => clearInterval(interval);
  }, [running, elapsedTimeInSegments, lastSegment]);


  return (
    <Field title="Time" value={formatElapsedTime(time)} size="large" />
  );
}