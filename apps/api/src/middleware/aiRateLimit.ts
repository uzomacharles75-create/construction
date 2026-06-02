import { rateLimit, ipKeyGenerator } from 'express-rate-limit';

/**
 * Throttles the AI endpoints (chat + BOQ pricing) to curb abuse and cost.
 * Keyed by authenticated user id, with a safe IP fallback.
 * 20 requests per minute per user.
 */
export const aiRateLimiter = rateLimit({
  windowMs: 60 * 1000,
  limit: 20,
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req: any) => req.user?.id || ipKeyGenerator(req.ip),
  message: {
    message: 'Too many AI requests — please wait a minute and try again.',
  },
});
