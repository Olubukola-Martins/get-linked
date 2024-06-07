"use client";
import Image from "next/image";
import { useState, useEffect } from "react";

const Timer = () => {
  const [totalSeconds, setTotalSeconds] = useState(1800); // 30 minutes in seconds
  const [isRunning, setIsRunning] = useState(true);

  useEffect(() => {
    let intervalId;

    if (isRunning && totalSeconds > 0) {
      intervalId = setInterval(() => {
        setTotalSeconds((prevSeconds) => {
          if (prevSeconds > 0) {
            return prevSeconds - 1;
          } else {
            clearInterval(intervalId);
            return 0;
          }
        });
      }, 1000);
    }

    return () => clearInterval(intervalId);
  }, [isRunning, totalSeconds]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="bg-[var(--deepGrey-bg)] py-2 sm:px-4 px-2 rounded-lg flex gap-2">
      <Image width={16} height={16} alt="timer" src={"/images/timer.svg"} />
      <p className="text-sm sm:text-lg text-[var(--app-purple)]">{formatTime(totalSeconds)} time left</p>
    </div>
  );
};

export default Timer;
