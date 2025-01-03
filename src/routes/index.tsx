import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";

export const Route = createFileRoute("/")({
  component: IndexComponent,
});

const TIME_IN_SECONDS = 25 * 60;

// TODO: Handle pausing
function IndexComponent() {
  const [seconds, setSeconds] = useState(TIME_IN_SECONDS);

  const handleStart = () => {
    const interval = setInterval(() => {
      setSeconds((seconds) => seconds - 1);
    }, 1000);

    return () => clearInterval(interval);
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
        <button
          onClick={handleStart}
          className="px-3 text-white bg-blue-600 rounded-lg h-9"
        >
          Start Session
        </button>
      </div>
      <div className="flex-1"></div>
    </div>
  );
}
