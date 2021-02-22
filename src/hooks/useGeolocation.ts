import { useState, useCallback, useMemo } from "react";
import { Geolocation } from "@ionic-native/geolocation";

export interface Geolocation {
  latitude: number;
  longitude: number;
}

interface UseGeolocationRet {
  geolocation: Geolocation | null;
  requestGeolocation(): Promise<void>;
}

export const useGeolocation = (): UseGeolocationRet => {
  const [geolocation, setGeolocationState] = useState<Geolocation | null>(null);
  const requestGeolocation = useCallback(
    (): Promise<void> =>
      Geolocation.getCurrentPosition().then(
        ({ coords: { latitude, longitude } }) =>
          setGeolocationState({ longitude, latitude })
      ),
    []
  );

  return useMemo(() => ({ geolocation, requestGeolocation }), [
    geolocation,
    requestGeolocation,
  ]);
};
