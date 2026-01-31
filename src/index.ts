/**
 * Vercel serverless entry: exports the Express app as the request handler.
 * Local development uses server.ts which calls app.listen().
 */
import app from "./app";
export default app;
