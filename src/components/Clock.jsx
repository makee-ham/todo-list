import { useEffect, useState } from "react";

export default function Clock() {
  const [time, setTime] = useState("");

  const getTime = () => {
    const currentTime = new Date();
    const koreaTime = currentTime.toLocaleTimeString("ko-KR", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    });
    setTime(koreaTime);
  };

  useEffect(() => {
    getTime();
    const updateTime = setInterval(getTime, 1000);
    return () => clearInterval(updateTime);
  }, []);

  const [hour, minute, second] = time.split(":");

  return (
    <div id="clock-container">
      <span>현재 시각 : </span>
      <span>
        {hour}시 {minute}분 {second}초
      </span>
    </div>
  );
}
