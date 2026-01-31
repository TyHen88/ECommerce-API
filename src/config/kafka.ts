import { Kafka } from "kafkajs";
import { env } from "./env";

export const kafka = new Kafka({
  clientId: env.kafkaClientId,
  brokers: env.kafkaBrokers,
});

export const producer = kafka.producer();

let producerConnected = false;

async function ensureProducerConnected() {
  if (producerConnected) return;
  try {
    await producer.connect();
    producerConnected = true;
  } catch (err) {
    console.error("Kafka producer connect failed:", err);
  }
}

export const publishEvent = async (topic: string, event: any) => {
  if (env.disableKafka) return;
  try {
    await ensureProducerConnected();
    if (!producerConnected) return;
    await producer.send({
      topic,
      messages: [{ value: JSON.stringify(event) }],
    });
    console.log(`Event published to topic: ${topic}`);
  } catch (error) {
    console.error(`Error publishing event to ${topic}:`, error);
  }
};

