import { useEffect, useRef, useState } from "react";

export default function useFetch(url) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const fetchedRef = useRef(false); // 리렌더링 관계 없이 한 번만 페치되도록.. (왜 안 되지)

  useEffect(() => {
    if (!url) return; // url 없을 때 동작 방지

    async function doFetch() {
      setLoading(true);
      setError(null);
      try {
        if (!fetchedRef.current) {
          fetchedRef.current = true;
          const response = await fetch(url);
          if (!response.ok) throw new Error("페치에 문제 발생");
          const thisData = await response.json();
          setData(thisData);
        }
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
