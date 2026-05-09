// Rate limiting via Upstash Redis
// Docs: https://upstash.com/docs/redis/sdks/ratelimit-ts/overview

import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

let ratelimit: Ratelimit | null = null;

function getRateLimiter() {
  if (!ratelimit) {
    ratelimit = new Ratelimit({
      redis: Redis.fromEnv(),
      limiter: Ratelimit.slidingWindow(5, "60 s"), // 5 requests per minute per IP
    });
  }
  return ratelimit;
}

export async function checkRateLimit(identifier: string) {
  const limiter = getRateLimiter();
  return limiter.limit(identifier);
}
