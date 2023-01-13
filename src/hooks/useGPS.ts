import { useEffect, useState } from "react";

function getRadians(latlongDistance: number) {
  return (latlongDistance * Math.PI) / 180;
}

function computeDistance(
  position1: GeolocationCoordinates,
  position2: GeolocationCoordinates
) {
  const { latitude: lat1, longitude: lon1 } = position1;
  const { latitude: lat2, longitude: lon2 } = position2;

  const earthRadius = 6.3781e6; //metres
  const latRadians = getRadians(lat2 - lat1);
  const lonRadians = getRadians(lon2 - lon1);

  const a =
    Math.sin(latRadians / 2) * Math.sin(latRadians / 2) +
    Math.cos(getRadians(lat1)) *
      Math.cos(getRadians(lat2)) *
      Math.sin(lonRadians / 2) *
      Math.sin(lonRadians / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = earthRadius * c;

  return distance;
}

export default function useGPS() {
  const [started, setStarted] = useState(false);
  const [position, setPosition] = useState<GeolocationPosition>();

  const [speed, setSpeed] = useState<number | null>(0);
  const [distance, setDistance] = useState<number>(0);
  const [altitude, setAltitude] = useState<number | null>(0);
  const [accuracy, setAccuracy] = useState<number>(-1);

  useEffect(() => {
    const watchId = navigator.geolocation.watchPosition(
      (newPosition) => {
        setAccuracy(newPosition.coords.accuracy);

        if (!started) {
          return;
        }

        if (position) {
          const distance = computeDistance(position.coords, newPosition.coords);
          setDistance((prevDistance) => prevDistance + distance);
        }

        setPosition(newPosition);
        setSpeed(newPosition.coords.speed);
        setAltitude(newPosition.coords.altitude);
      },
      (error) => console.error(error),
      { enableHighAccuracy: true }
    );

    return () => navigator.geolocation.clearWatch(watchId);
  }, [position, started]);

  const start = () => {
    if (started) return;
    setStarted(true);
  };

  const stop = () => {
    if (!started) return;
    setStarted(false);
  };

  return { accuracy, speed, distance, altitude, start, stop };
}
