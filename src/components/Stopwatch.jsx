import { useRef, useState } from "react";

export default function Stopwatch() {
  const isStartRef = useRef(false);
  const stopwatchTimeRef = useRef(0);
  const intervalIdRef = useRef(null);
  const [displayTime, setDisplayTime] = useState(0);

  const formatTime = (ms) => {
    const totalSeconds = Math.floor(ms / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
  };

  const toggleStart = () => {
    isStartRef.current = !isStartRef.current;

    if (isStartRef.current) {
      intervalIdRef.current = setInterval(() => {
        stopwatchTimeRef.current += 1000;
        setDisplayTime(stopwatchTimeRef.current);
      }, 1000);
    } else {
      clearInterval(intervalIdRef.current);
    }
  };

  const reset = () => {
    clearInterval(intervalIdRef.current);
    isStartRef.current = false;
    stopwatchTimeRef.current = 0;
    setDisplayTime(0);
  };

  return (
    <div id="stopwatch-container">
      <div id="stopwatch-display">{formatTime(displayTime)}</div>
      <div className="flex gap-2 mt-2">
        <button onClick={toggleStart} className="px-3 py-1 border rounded">
          {isStartRef.current ? "정지" : "시작"}
        </button>
        <button onClick={reset} className="px-3 py-1 border rounded">
          초기화
        </button>
      </div>
    </div>
  );
}
