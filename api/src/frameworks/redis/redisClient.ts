import Redis from "ioredis";
import { injectable } from "tsyringe";
import { config } from "../../shared/config";
import { IRedisClient } from "../../entities/services/IRedisClient";

@injectable()
export class RedisClient implements IRedisClient {
  private client: Redis;

  constructor() {
    this.client = new Redis(`${config.redis.redisURL}`);

    this.client.on("connect", () => console.log("✅ Connected to Redis!"));
    this.client.on("error", (err) =>
      console.error("❌ Redis connection error:", err)
    );
  }

  async set(key: string, value: string): Promise<"OK" | null> {
    return this.client.set(key, value);
  }

  async setex(key: string, seconds: number, value: string): Promise<"OK"> {
    return this.client.setex(key, seconds, value);
  }

  async get(key: string): Promise<string | null> {
    return this.client.get(key);
  }

  async del(key: string): Promise<number> {
    return this.client.del(key);
  }

  async disconnect(): Promise<void> {
    await this.client.quit();
    console.log("🔌 Disconnected from Redis");
  }
  async releaseLock(key: string): Promise<number> {
    return await this.client.del(key)
  }
  async acquireLock(key: string, ttlMs = 3000): Promise<boolean> {
    const result = (await this.client.set(key, "locked", "PX", ttlMs, "NX")) as
      | "OK"
      | null;

    return result === "OK";
  }
}

export default new RedisClient();
