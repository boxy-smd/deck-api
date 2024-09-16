import { z } from 'zod'

const envSchema = z.object({
  NODE_ENV: z.enum(['dev', 'test', 'production']).default('dev'),
  JWT_SECRET: z.string(),
  DATABASE_URL: z.string(),
  PORT: z.coerce.number().default(3333),
  FIREBASE_API_KEY: z.string(),
  FIREBASE_APP_ID: z.string(),
  FIREBASE_AUTH_DOMAIN: z.string(),
  FIREBASE_MESSAGING_SENDER_ID: z.string(),
  FIREBASE_PROJECT_ID: z.string(),
  FIREBASE_STORAGE_BUCKET: z.string(),
})

const _env = envSchema.safeParse(process.env)

if (_env.success === false) {
  console.error('❌ Invalid environment variables', _env.error.format())

  throw new Error('Invalid environment variables.')
}

export const env = _env.data
