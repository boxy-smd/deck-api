import { z } from 'zod'

export const envSchema = z.object({
  NODE_ENV: z.enum(['dev', 'test', 'production']).default('dev'),
  JWT_SECRET: z.string(),
  DATABASE_URL: z.string(),
  PORT: z.coerce.number().default(3333),
  FIREBASE_API_KEY: z.string().optional(),
  FIREBASE_APP_ID: z.string().optional(),
  FIREBASE_AUTH_DOMAIN: z.string().optional(),
  FIREBASE_MESSAGING_SENDER_ID: z.string().optional(),
  FIREBASE_PROJECT_ID: z.string().optional(),
  FIREBASE_STORAGE_BUCKET: z.string().optional(),
})

export type Env = z.infer<typeof envSchema>
