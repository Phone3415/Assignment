import { createApp } from "./app";

const PORT = Number(process.env.PORT) || 3000;
const app = createApp();

const server = app.listen(PORT, (): void => {
  console.log(`Server listening at http://localhost:${PORT}`);
});

function handleShutdown(signal: string): void {
  console.log(`Received ${signal}. Gracefully shutting down...`);
  server.close((): void => {
    console.log("HTTP server closed.");
    process.exit(0);
  });
}

process.on("SIGINT", () => handleShutdown("SIGINT"));
process.on("SIGTERM", () => handleShutdown("SIGTERM"));
