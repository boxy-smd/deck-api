import type { INestApplication } from '@nestjs/common'
import type { NodePgDatabase } from 'drizzle-orm/node-postgres'

import { DRIZZLE } from '@/@infra/database/drizzle/drizzle.provider'
import * as schema from '@/@infra/database/drizzle/schema'

/**
 * Obtém a instância do Drizzle do container de injeção de dependências
 */
export function getDrizzleInstance(
  app: INestApplication,
): NodePgDatabase<typeof schema> {
  return app.get(DRIZZLE)
}
