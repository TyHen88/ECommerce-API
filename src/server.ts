import app from "./app";
import { env } from "./config/env";
import prisma from "./config/database";

const server = app.listen(env.port, () => {
  console.log(`🚀 Server running on port ${env.port}`);
  console.log(`📚 API Documentation: http://localhost:${env.port}/api-docs`);
  console.log(`🏥 Health Check: http://localhost:${env.port}/health`);
});

// Graceful shutdown
process.on("SIGTERM", async () => {
  console.log("SIGTERM signal received: closing HTTP server");
  server.close(async () => {
    console.log("HTTP server closed");
    await prisma.$disconnect();
    process.exit(0);
  });
});

process.on("SIGINT", async () => {
  console.log("SIGINT signal received: closing HTTP server");
  server.close(async () => {
    console.log("HTTP server closed");
    await prisma.$disconnect();
    process.exit(0);
  });
});

export default server;
