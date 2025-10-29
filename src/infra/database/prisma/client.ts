import { env } from '@/infra/config/env/env'
import { PrismaClient } from '@prisma/client'

export const prisma = new PrismaClient({
  errorFormat: 'pretty',
  log: env.NODE_ENV === 'dev' ? ['query', 'warn', 'error'] : [],
})
