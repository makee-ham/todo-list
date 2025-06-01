import { memo } from "react";

export default memo(function FooterQuote({ quote }) {
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
