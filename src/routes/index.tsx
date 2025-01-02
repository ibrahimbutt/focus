import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  component: IndexComponent,
});

function IndexComponent() {
  return (
    <h1 className="flex items-center justify-center h-screen">Hello, World!</h1>
  );
}
