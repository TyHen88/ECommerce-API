import { createClient } from "redis";
import { env } from "./env";

const redisClient = createClient({
  url: env.redisUrl,
});

redisClient.on("error", (err) => console.error("Redis Client Error", err));
redisClient.on("connect", () => console.log("Redis Client Connected"));

// Connect to Redis
if (!redisClient.isOpen) {
  redisClient.connect().catch(console.error);
}

export default redisClient;

