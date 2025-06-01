import { useRef, useState } from "react";

export default function Timer() {
  const isStartRef = useRef(false);
  const timerTimeRef = useRef(0);
  const intervalIdRef = useRef(null);
  const [displayTime, setDisplayTime] = useState(0);
  const [hour, setHour] = useState("0");
  const [minute, setMinute] = useState("0");
  const [second, setSecond] = useState("0");

  const handleSetTime = () => {
    const h = parseInt(hour, 10) || 0;
    const m = parseInt(minute, 10) || 0;
    const s = parseInt(second, 10) || 0;

    const ms = (h * 3600 + m * 60 + s) * 1000;

    timerTimeRef.current = ms;
    setDisplayTime(ms);
  };

  const formatTime = (ms) => {
    const totalSeconds = Math.floor(ms / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
  };

  const toggleStart = () => {
    if (!isStartRef.current) handleSetTime();

    isStartRef.current = !isStartRef.current;

    if (isStartRef.current) {
      intervalIdRef.current = setInterval(() => {
        if (timerTimeRef.current <= 0) {
          clearInterval(intervalIdRef.current);
          return;
        }
        timerTimeRef.current -= 1000;
        setDisplayTime(timerTimeRef.current);
      }, 1000);
    } else {
      clearInterval(intervalIdRef.current);
    }
  };

  const reset = () => {
    clearInterval(intervalIdRef.current);
    isStartRef.current = false;
    timerTimeRef.current = 0;
    setDisplayTime(0);
    setHour("0");
    setMinute("0");
    setSecond("0");
  };

  return (
    <div id="timer-container">
      <div id="timer-display">
        {isStartRef.current ? (
          formatTime(displayTime)
        ) : (
          <span>
            <input
              type="number"
              min="0"
              value={hour}
              onChange={(e) => setHour(e.target.value)}
            />
            시간{" "}
            <input
              type="number"
              min="0"
              value={minute}
              onChange={(e) => setMinute(e.target.value)}
            />
            분{" "}
            <input
              type="number"
              min="0"
              value={second}
              onChange={(e) => setSecond(e.target.value)}
            />
            초
          </span>
        )}
      </div>
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
