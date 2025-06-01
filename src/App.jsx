// 서버: npm run server

import Functions from "./components/Functions";
import FooterQuote from "./components/FooterQuote";
import TodoSection from "./components/TodoSection";
import { useState, useEffect } from "react";
import axios from "axios";

function App() {
  const [activeTab, setActiveTab] = useState("clock");

  const [quote, setQuote] = useState(null);

  useEffect(() => {
    async function fetchQuote() {
      const response = await axios.get("https://dummyjson.com/quotes/random");
      setQuote(response.data);
    }
    fetchQuote();
  }, []);

  return (
    <div
      id="app-container"
      className="min-h-screen flex flex-col items-center p-4 bg-gray-100 text-gray-900"
    >
      <header className="mb-4">
        <h1 className="text-2xl font-bold">Things Todo</h1>
      </header>
      <main className="w-full max-w-xl space-y-4">
        <Functions activeTab={activeTab} setActiveTab={setActiveTab} />
        <TodoSection />
      </main>
      <FooterQuote quote={quote} />
    </div>
  );
}

export default App;
