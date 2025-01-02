import { createRootRoute } from "@tanstack/react-router";

export const Route = createRootRoute({
  component: RootComponent,
});

function RootComponent() {
  return (
    <h1 className="h-screen flex justify-center items-center">Hello, World!</h1>
  );
}
