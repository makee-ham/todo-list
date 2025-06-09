// 서버: npm run server

import Functions from "./components/Functions";
import FooterQuote from "./components/FooterQuote";
import TodoSection from "./components/TodoSection";

function App() {
  return (
    <div
      id="app-container"
      className="min-h-screen flex flex-col items-center p-4 bg-gray-100 text-gray-900"
    >
      <header className="mb-4">
        <h1 className="text-2xl font-bold">Things Todo</h1>
      </header>
      <main className="w-full max-w-xl space-y-4">
        <Functions />
        <TodoSection />
      </main>
      <FooterQuote />
    </div>
  );
}

export default App;
