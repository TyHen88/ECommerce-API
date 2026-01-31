import { createClient } from "redis";
import { env } from "./env";

const isRedisConfigured =
  !env.disableRedis &&
  (env.nodeEnv !== "production" ||
    (env.redisUrl && !env.redisUrl.includes("localhost")));

const redisClient = createClient({
  url: env.redisUrl,
  socket: {
    connectTimeout: 5000,
  },
});

redisClient.on("error", (err) => console.error("Redis Client Error", err));
redisClient.on("connect", () => console.log("Redis Client Connected"));

if (isRedisConfigured && !redisClient.isOpen) {
  redisClient.connect().catch(console.error);
}

export const isRedisAvailable = isRedisConfigured;
export default redisClient;

