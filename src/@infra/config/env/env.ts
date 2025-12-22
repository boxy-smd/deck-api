import { z } from 'zod'

export const envSchema = z.object({
  NODE_ENV: z.enum(['dev', 'test', 'production']).default('dev'),
  JWT_SECRET: z.string().min(1),
  JWT_EXPIRES_IN: z.string().default('7d'),
  DATABASE_URL: z.string().url().optional().or(z.literal('')),
  PORT: z.preprocess(val => {
    if (val) return Number(val)
    if (process.env.PORT) return Number(process.env.PORT)
    return 10000
  }, z.number().positive()),
  FIREBASE_API_KEY: z.string().optional(),
  FIREBASE_APP_ID: z.string().optional(),
  FIREBASE_AUTH_DOMAIN: z.string().optional(),
  FIREBASE_MESSAGING_SENDER_ID: z.string().optional(),
  FIREBASE_PROJECT_ID: z.string().optional(),
  FIREBASE_STORAGE_BUCKET: z.string().optional(),
})

export type Env = z.infer<typeof envSchema>
