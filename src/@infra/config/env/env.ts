import { z } from 'zod'

export const envSchema = z.object({
  NODE_ENV: z.enum(['dev', 'test', 'production']).default('dev'),
  JWT_SECRET: z.string().min(1),
  JWT_EXPIRES_IN: z.string().default('7d'),
  DATABASE_URL: z.url().optional().or(z.literal('')),
  PORT: z.preprocess(val => {
    if (val) return Number(val)
    if (process.env.PORT) return Number(process.env.PORT)
    return 10000
  }, z.number().positive()),
  SUPABASE_URL: z.url(),
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(1),
  SUPABASE_BUCKET: z.string().default('uploads'),
})

export type Env = z.infer<typeof envSchema>
