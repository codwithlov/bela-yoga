import { connectToDatabase } from "@/lib/db";
import { LoginRateLimit } from "@/models/LoginRateLimit";

const WINDOW_MINUTES = Number(process.env.LOGIN_RATE_LIMIT_WINDOW_MINUTES || 10);
const MAX_ATTEMPTS = Number(process.env.LOGIN_RATE_LIMIT_MAX_ATTEMPTS || 5);
const BLOCK_MINUTES = Number(process.env.LOGIN_RATE_LIMIT_BLOCK_MINUTES || 15);

export async function consumeLoginRateLimit(fingerprint: { key: string }) {
  await connectToDatabase();

  const now = new Date();
  const windowStart = new Date(now.getTime() - WINDOW_MINUTES * 60 * 1000);
  const blockUntil = new Date(now.getTime() + BLOCK_MINUTES * 60 * 1000);

  let record = await LoginRateLimit.findOne({ key: fingerprint.key });

  if (!record) {
    await LoginRateLimit.create({
      key: fingerprint.key,
      attempts: 1,
      windowStartedAt: now,
      lastAttemptAt: now,
    });
    return { allowed: true, retryAfterSeconds: 0 };
  }

  if (record.blockedUntil && record.blockedUntil > now) {
    return {
      allowed: false,
      retryAfterSeconds: Math.max(1, Math.ceil((record.blockedUntil.getTime() - now.getTime()) / 1000)),
    };
  }

  if (record.windowStartedAt < windowStart) {
    record.attempts = 0;
    record.windowStartedAt = now;
    record.blockedUntil = undefined;
  }

  record.attempts += 1;
  record.lastAttemptAt = now;

  if (record.attempts > MAX_ATTEMPTS) {
    record.blockedUntil = blockUntil;
    await record.save();
    return {
      allowed: false,
      retryAfterSeconds: Math.max(1, Math.ceil((blockUntil.getTime() - now.getTime()) / 1000)),
    };
  }

  await record.save();
  return { allowed: true, retryAfterSeconds: 0 };
}

export async function clearLoginRateLimit(fingerprint: { key: string }) {
  await connectToDatabase();
  await LoginRateLimit.deleteOne({ key: fingerprint.key });
}