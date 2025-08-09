import Redis from "ioredis"
import dotenv from 'dotenv'
dotenv.config()

// export const redis = new Redis(process.env.UPSTASH_REDIS_URL);
export const redis = new Redis(process.env.UPSTASH_REDIS_URL, {
  tls: {
    rejectUnauthorized: false
  }
});
//key-value
await redis.set('foo', 'bar');
