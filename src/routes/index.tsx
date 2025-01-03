import { createFileRoute } from "@tanstack/react-router";
import { RotateCcwIcon } from "lucide-react";
import { useEffect, useState, useRef } from "react";

export const Route = createFileRoute("/")({
  component: IndexComponent,
});

const TIME_IN_SECONDS = 25 * 60;
const CHANNEL_NAME = "pomodoro-sync";

type TimerMessage =
  | {
      type: "state_update";
      payload: {
        seconds: number;
        status: "idle" | "active" | "paused";
        completedSessions: number;
      };
    }
  | {
      type: "request_state";
    }
  | {
      type: "provide_state";
      payload: {
        seconds: number;
        status: "idle" | "active" | "paused";
        completedSessions: number;
      };
    };

function IndexComponent() {
  const [intervalId, setIntervalId] = useState<number | null>(null);
  const [seconds, setSeconds] = useState(TIME_IN_SECONDS);
  const [status, setStatus] = useState<"idle" | "active" | "paused">("idle");
  const [completedSessions, setCompletedSessions] = useState(0);
  const channelRef = useRef<BroadcastChannel | null>(null);

  useEffect(() => {
    channelRef.current = new BroadcastChannel(CHANNEL_NAME);

    channelRef.current.postMessage({ type: "request_state" });

    channelRef.current.onmessage = (event: MessageEvent<TimerMessage>) => {
      const message = event.data;

      switch (message.type) {
        case "state_update":
          if (message.payload.status === "active" && status !== "active") {
            if (intervalId) {
              clearInterval(intervalId);
              setIntervalId(null);
            }
          }
          setSeconds(message.payload.seconds);
          setStatus(message.payload.status);
          setCompletedSessions(message.payload.completedSessions);
          break;

        case "request_state":
          if (status === "active") {
            channelRef.current?.postMessage({
              type: "provide_state",
              payload: {
                seconds,
                status,
                completedSessions,
              },
            });
          }
          break;

        case "provide_state":
          if (status !== "active") {
            setSeconds(message.payload.seconds);
            setStatus(message.payload.status);
            setCompletedSessions(message.payload.completedSessions);
          }
          break;
      }
    };

    return () => {
      channelRef.current?.close();
    };
  }, [status, intervalId, seconds, completedSessions]);

  useEffect(() => {
    if (seconds === 0) {
      if (intervalId) {
        clearInterval(intervalId);
        setIntervalId(null);
      }
      setStatus("idle");
      setCompletedSessions((prev) => prev + 1);
      setSeconds(TIME_IN_SECONDS);

      channelRef.current?.postMessage({
        type: "state_update",
        payload: {
          seconds: TIME_IN_SECONDS,
          status: "idle",
          completedSessions: completedSessions + 1,
        },
      });
    }
  }, [seconds, intervalId, completedSessions]);

  const handleStart = () => {
    setStatus("active");
    const interval = setInterval(() => {
      setSeconds((prev) => {
        const newSeconds = prev - 1;
        channelRef.current?.postMessage({
          type: "state_update",
          payload: {
            seconds: newSeconds,
            status: "active",
            completedSessions,
          },
        });
        return newSeconds;
      });
    }, 1000);
    setIntervalId(interval);

    channelRef.current?.postMessage({
      type: "state_update",
      payload: {
        seconds,
        status: "active",
        completedSessions,
      },
    });
  };

  const handlePause = () => {
    if (intervalId) {
      clearInterval(intervalId);
      setIntervalId(null);
      setStatus("paused");

      channelRef.current?.postMessage({
        type: "state_update",
        payload: {
          seconds,
          status: "paused",
          completedSessions,
        },
      });
    }
  };

  const handleReset = () => {
    if (intervalId) {
      clearInterval(intervalId);
      setIntervalId(null);
    }
    setSeconds(TIME_IN_SECONDS);
    setStatus("idle");

    channelRef.current?.postMessage({
      type: "state_update",
      payload: {
        seconds: TIME_IN_SECONDS,
        status: "idle",
        completedSessions,
      },
    });
  };

  return (
    <div className="flex items-center h-svh">
      <div className="flex flex-col items-center justify-center h-full gap-1 w-96 bg-neutral-50">
        {completedSessions > 0 ? (
          <div className="text-base font-medium leading-none tracking-widest text-gray-500">
            #{completedSessions}
          </div>
        ) : null}
        <div className="text-6xl font-medium tabular-nums">
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
          {status !== "idle" && (
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
