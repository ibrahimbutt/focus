import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  component: IndexComponent,
});

function IndexComponent() {
  return (
    <div className="flex items-center h-svh">
      <div className="flex flex-col items-center justify-center h-full gap-3 w-96 bg-neutral-50">
        <div className="text-6xl font-medium">25:00</div>
        <button className="px-3 text-white bg-blue-600 rounded-lg h-9">
          Start Session
        </button>
      </div>
      <div className="flex-1"></div>
    </div>
  );
}
