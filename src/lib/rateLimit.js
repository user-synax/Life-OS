// Simple in-memory rate limiter for Next.js API routes
// Note: For production with multiple instances, use Redis-based rate limiting (e.g., @upstash/ratelimit)

const rateLimitMap = new Map();

/**
 * Creates a rate limiter for API routes
 * @param {Object} options - Rate limit options
 * @param {number} options.windowMs - Time window in milliseconds (default: 15 minutes)
 * @param {number} options.max - Maximum requests per window (default: 5)
 * @returns {Function} Middleware function
 */
export function createRateLimiter({ windowMs = 15 * 60 * 1000, max = 5 } = {}) {
  return function rateLimit(req) {
    const identifier = req.headers.get('x-forwarded-for') || 
                       req.headers.get('x-real-ip') || 
                       'unknown';
    
    const key = `${identifier}:${req.nextUrl.pathname}`;
    const now = Date.now();
    
    const record = rateLimitMap.get(key);
    
    if (!record || now > record.resetTime) {
      // Create new record or reset expired one
      rateLimitMap.set(key, {
        count: 1,
        resetTime: now + windowMs
      });
      return { success: true };
    }
    
    if (record.count >= max) {
      return {
        success: false,
        resetTime: record.resetTime
      };
    }
    
    // Increment count
    record.count++;
    return { success: true };
  };
}

// Clean up expired entries periodically to prevent memory leaks
setInterval(() => {
  const now = Date.now();
  for (const [key, record] of rateLimitMap.entries()) {
    if (now > record.resetTime) {
      rateLimitMap.delete(key);
    }
  }
}, 60 * 1000); // Clean up every minute
