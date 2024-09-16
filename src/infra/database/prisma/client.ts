import { env } from '@/infra/config/env/env.ts'
import { PrismaClient } from '@prisma/client'

export const prisma = new PrismaClient({
  errorFormat: 'pretty',
  log: env.NODE_ENV === 'dev' ? ['query', 'warn', 'error'] : [],
})
