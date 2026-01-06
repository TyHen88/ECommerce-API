import dotenv from "dotenv";
dotenv.config();

export const env = {
  port: Number(process.env.PORT) || 3000,
  nodeEnv: process.env.NODE_ENV || "development",
  databaseUrl: process.env.DATABASE_URL || "",
  jwtSecret:
    process.env.JWT_SECRET ||
    "hgd6KysgfdEzkUG2U0w7hMnxmea5EnZfEvx+DuLDA0c7qQwAQRrTvhTGYItvkxU21AgXZuWXS99Rcrc9dJs+dQ==",
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || "7d",
  redisUrl: process.env.REDIS_URL || "redis://localhost:6379",
  stripeSecretKey: process.env.STRIPE_SECRET_KEY || "",
  stripePublishableKey: process.env.STRIPE_PUBLISHABLE_KEY || "",
  kafkaBrokers: process.env.KAFKA_BROKERS?.split(",") || ["localhost:9092"],
  kafkaClientId: process.env.KAFKA_CLIENT_ID || "ecommerce-api",
};
