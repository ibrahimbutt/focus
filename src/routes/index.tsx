import { createFileRoute } from "@tanstack/react-router";
import { RotateCcwIcon } from "lucide-react";
import { useEffect, useState } from "react";

export const Route = createFileRoute("/")({
  component: IndexComponent,
});

const TIME_IN_SECONDS = 1 * 10;

function IndexComponent() {
  const [intervalId, setIntervalId] = useState<number | null>(null);
  const [seconds, setSeconds] = useState(TIME_IN_SECONDS);
  const [status, setStatus] = useState<"idle" | "active" | "paused">("idle");
  const [completedSessions, setCompletedSessions] = useState(0);

  useEffect(() => {
    if (seconds === 0) {
      if (intervalId) {
        clearInterval(intervalId);
        setIntervalId(null);
      }
      setStatus("idle");
      setCompletedSessions((prev) => prev + 1);
      setSeconds(TIME_IN_SECONDS);
    }
  }, [seconds, intervalId]);

  const handleStart = () => {
    setStatus("active");
    const interval = setInterval(() => {
      setSeconds((prev) => prev - 1);
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

  const handleReset = () => {
    if (intervalId) {
      clearInterval(intervalId);
      setIntervalId(null);
    }
    setSeconds(TIME_IN_SECONDS);
    setStatus("idle");
  };

  return (
    <div className="flex items-center h-svh">
      <div className="flex flex-col items-center justify-center h-full gap-1 w-96 bg-neutral-50">
        {completedSessions > 0 ? (
          <div className="text-base font-medium leading-none tracking-widest text-gray-500 ">
            #{completedSessions}
          </div>
        ) : null}
        <div className="text-6xl font-medium ">
          {Math.floor(seconds / 60)
            .toString()
            .padStart(2, "0")}
          :{(seconds % 60).toString().padStart(2, "0")}
        </div>
        <div className="flex gap-2 mt-3">
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

          {status != "idle" && (
            <button
              onClick={handleReset}
              className="px-3 text-gray-500 bg-gray-200 rounded-lg h-9"
            >
              <RotateCcwIcon size={16} />
            </button>
          )}
        </div>
      </div>
      <div className="flex-1"></div>
    </div>
  );
}
