import { useState, useEffect } from "react";
import { locationService, GeoCoordinates } from "../services/location";

export function useLocation() {
  const [coords, setCoords] = useState<GeoCoordinates>({
    latitude: 11.0168,
    longitude: 76.9558,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    locationService.getCurrentPosition().then((pos) => {
      if (mounted) {
        setCoords(pos);
        setLoading(false);
      }
    });
    return () => {
      mounted = false;
    };
  }, []);

  return { coords, loading };
}
