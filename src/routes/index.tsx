import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  component: IndexComponent,
});

function IndexComponent() {
  return (
    <div className="flex items-center h-svh">
      <div className="flex items-center justify-center h-full w-96 bg-neutral-50">
        <div className="text-6xl font-medium">25:00</div>
      </div>
      <div className="flex-1"></div>
    </div>
  );
}
