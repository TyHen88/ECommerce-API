import morgan from "morgan";
import { IncomingMessage } from "http";

// Custom token for ISO timestamp
morgan.token("time", () => new Date().toISOString());

// Custom token for client IP (handles proxies)
morgan.token("ip", (req: IncomingMessage) => {
  const forwarded = req.headers["x-forwarded-for"];
  if (typeof forwarded === "string") {
    return forwarded.split(",")[0].trim();
  }
  if (Array.isArray(forwarded)) {
    return forwarded[0].trim();
  }
  return req.socket.remoteAddress || "-";
});

export const morganFormat = morgan(
  (tokens, req, res) => {
    const statusCode = Number(tokens.status(req, res)) || 0;
    const responseTime = Number(tokens["response-time"](req, res)) || 0;

    const logData = {
      timestamp: tokens.time(req, res),
      level: statusCode >= 500 ? "error" : statusCode >= 400 ? "warn" : "info",
      service: "ecommerce-api",
      env: process.env.NODE_ENV || "development",
      http: {
        method: tokens.method(req, res),
        path: tokens.url(req, res),
        statusCode,
        durationMs: responseTime,
        userAgent: tokens["user-agent"](req, res),
      },
      client: {
        ip: tokens.ip(req, res),
      },
    };

    // Pretty print in development, compact in production
    return process.env.NODE_ENV === "development"
      ? JSON.stringify(logData, null, 2) + "\n"
      : JSON.stringify(logData) + "\n";
  },
  {
    skip: (req) => {
      return (
        process.env.NODE_ENV === "test" ||
        req.url === "/health" ||
        req.url === "/healthz"
      );
    },
  }
);