import { useState } from "react";
import Timer from "./Timer";
import Stopwatch from "./Stopwatch";
import Clock from "./Clock";
import Weather from "./Weather";

export default function Functions() {
  const [activeTab, setActiveTab] = useState("clock");

  const handleTabClick = (tabId) => setActiveTab(tabId);

  const functionTabs = [
    { id: "clock", label: "현재 시각" },
    { id: "timer", label: "타이머" },
    { id: "stopwatch", label: "스톱워치" },
    { id: "weather", label: "5등분의 날씨" },
  ];

  return (
    <section id="functions-container">
      <div id="function-tabs">
        {functionTabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            className={`${activeTab === tab.id ? "active" : ""}`}
            onClick={() => handleTabClick(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div id="feature-area">
        <div style={{ display: activeTab === "clock" ? "block" : "none" }}>
          <Clock />
        </div>
        <div style={{ display: activeTab === "timer" ? "block" : "none" }}>
          <Timer />
        </div>
        <div style={{ display: activeTab === "stopwatch" ? "block" : "none" }}>
          <Stopwatch />
        </div>
        <div style={{ display: activeTab === "weather" ? "block" : "none" }}>
          <Weather />
        </div>
      </div>
    </section>
  );
}
