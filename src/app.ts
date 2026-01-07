import express from "express";
import routes from "./routes";
import { errorHandler } from "./shared/middleware/error.middleware";
import {
  apiLimiter,
  corsOptions,
  helmetConfig,
} from "./shared/middleware/security.middleware";
import { setupSwagger } from "./config/swagger-ui";
import cors from "cors";
import { morganFormat } from "./config/morgan";

const app = express();

// ==============================
// Security middleware
// ==============================
app.use(helmetConfig);
app.use(cors(corsOptions));
app.use(apiLimiter);

// ==============================
// Body parsing
// ==============================
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ==============================
// Logging (Morgan)
// ==============================
if (process.env.NODE_ENV !== "test") {
  app.use(morganFormat);
}

// ==============================
// Health check
// ==============================
app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

// ==============================
// Swagger
// ==============================
if (process.env.NODE_ENV !== "production") {
  setupSwagger(app);
}

// ==============================
// API routes
// ==============================
app.use("/api", routes);

// ==============================
// Error handler (LAST)
// ==============================
app.use(errorHandler);

export default app;
