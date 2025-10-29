"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "env", {
    enumerable: true,
    get: function() {
        return env;
    }
});
const _zod = require("zod");
const envSchema = _zod.z.object({
    NODE_ENV: _zod.z.enum([
        'dev',
        'test',
        'production'
    ]).default('dev'),
    JWT_SECRET: _zod.z.string(),
    DATABASE_URL: _zod.z.string(),
    PORT: _zod.z.coerce.number().default(3333),
    FIREBASE_API_KEY: _zod.z.string().optional(),
    FIREBASE_APP_ID: _zod.z.string().optional(),
    FIREBASE_AUTH_DOMAIN: _zod.z.string().optional(),
    FIREBASE_MESSAGING_SENDER_ID: _zod.z.string().optional(),
    FIREBASE_PROJECT_ID: _zod.z.string().optional(),
    FIREBASE_STORAGE_BUCKET: _zod.z.string().optional()
});
const _env = envSchema.safeParse(process.env);
if (_env.success === false) {
    console.error('❌ Invalid environment variables', _env.error.format());
    throw new Error('Invalid environment variables.');
}
const env = _env.data;

//# sourceMappingURL=env.js.map