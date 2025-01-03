import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";

export const Route = createFileRoute("/")({
  component: IndexComponent,
});

const TIME_IN_SECONDS = 25 * 60;

function IndexComponent() {
  const [intervalId, setIntervalId] = useState<number | null>(null);
  const [seconds, setSeconds] = useState(TIME_IN_SECONDS);
  const [status, setStatus] = useState<"idle" | "active" | "paused">("idle");

  const handleStart = () => {
    setStatus("active");
    const interval = setInterval(() => {
      setSeconds((prevSeconds) => {
        if (prevSeconds <= 1) {
          clearInterval(interval);
          setStatus("idle");
          return TIME_IN_SECONDS;
        }
        return prevSeconds - 1;
      });
    }, 1000);
    setIntervalId(interval);
  };

  const handlePause = () => {
    if (intervalId) {
      clearInterval(intervalId);
      setIntervalId(null);
      setStatus("paused");
    }
  };
  return (
    <div className="flex items-center h-svh">
      <div className="flex flex-col items-center justify-center h-full gap-3 w-96 bg-neutral-50">
        <div className="text-6xl font-medium">
          {Math.floor(seconds / 60)
            .toString()
            .padStart(2, "0")}
          :{(seconds % 60).toString().padStart(2, "0")}
        </div>

        {status === "idle" && (
          <button
            onClick={handleStart}
            className="px-3 text-white bg-blue-600 rounded-lg h-9"
          >
            Start Session
          </button>
        )}

        {status === "active" && (
          <button
            onClick={handlePause}
            className="px-3 text-white bg-red-600 rounded-lg h-9"
          >
            Pause
          </button>
        )}

        {status === "paused" && (
          <button
            onClick={handleStart}
            className="px-3 text-white bg-green-600 rounded-lg h-9"
          >
            Resume
          </button>
        )}
      </div>
      <div className="flex-1"></div>
    </div>
  );
}
