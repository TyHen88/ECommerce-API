import { Kafka } from "kafkajs";
import { env } from "./env";

export const kafka = new Kafka({
  clientId: env.kafkaClientId,
  brokers: env.kafkaBrokers,
});

export const producer = kafka.producer();

// Initialize producer connection
producer.connect().catch(console.error);

export const publishEvent = async (topic: string, event: any) => {
  try {
    await producer.send({
      topic,
      messages: [
        {
          value: JSON.stringify(event),
        },
      ],
    });
    console.log(`Event published to topic: ${topic}`);
  } catch (error) {
    console.error(`Error publishing event to ${topic}:`, error);
    throw error;
  }
};

