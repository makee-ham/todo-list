import { useEffect, useState } from "react";

export default function useFetch(url) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function doFetch() {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(url);
        if (!response.ok) throw new Error("페치에 문제 발생");
        const thisData = await response.json();
        setData(thisData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    doFetch();
  }, [url]);

  return { data, loading, error };
}
