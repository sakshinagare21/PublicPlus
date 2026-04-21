import rateLimit from 'express-rate-limit';

// General API limiter
export const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 1000, // Limit each IP to 1000 requests per window
    message: {
        status: 429,
        message: "High traffic detected. Please slow down slightly."
    },
    standardHeaders: true,
    legacyHeaders: false,
});

// OTP Limiter: 20 OTP per 10 min
export const otpLimiter = rateLimit({
    windowMs: 10 * 60 * 1000, // 10 minutes
    max: 20, 
    message: {
        status: 429,
        message: "Too many OTP attempts. Please wait 10 minutes."
    },
    standardHeaders: true,
    legacyHeaders: false,
});

// Login Limiter: 50 login attempt per 15 min
export const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 50,
    message: {
        status: 429,
        message: "Too many login attempts. Please try again after 15 minutes."
    },
    standardHeaders: true,
    legacyHeaders: false,
});

// Report Limiter: 100 report per hour
export const reportLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 100,
    message: {
        status: 429,
        message: "Report submission limit reached. Please try again later."
    },
    standardHeaders: true,
    legacyHeaders: false,
});
