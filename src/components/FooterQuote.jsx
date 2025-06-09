import axios from "axios";
import { memo, useEffect, useState } from "react";

export default memo(function FooterQuote() {
  const [quote, setQuote] = useState(null);

  useEffect(() => {
    async function fetchQuote() {
      const response = await axios.get("https://dummyjson.com/quotes/random");
      setQuote(response.data);
    }
    fetchQuote();
  }, []);

  return quote ? (
    <footer className="mt-6 text-sm text-gray-500 text-center">
      "{quote.quote}" — {quote.author}
    </footer>
  ) : (
    <footer className="mt-6 text-sm text-gray-500 text-center">
      명언 불러오는 중...
    </footer>
  );
});
