import { useEffect, useState } from "react";
import useFetch from "./useFetch";
import useGeolocation from "./useGeolocation";

const API_KEY = "350e68d17c258c106cbb393c3b51ba8d";

export default function useOpenWeatherAPI() {
  const { location, error: geoError } = useGeolocation();
  const [url, setUrl] = useState(null);

  useEffect(() => {
    if (location.lat && location.lon)
      setUrl(
        `https://api.openweathermap.org/data/2.5/forecast?lat=${location.lat}&lon=${location.lon}&units=metric&lang=kr&appid=${API_KEY}`
      );
  }, [location]);

  const { data, loading, error: fetchError } = useFetch(url);

  return { data, loading, geoError, fetchError };
}
