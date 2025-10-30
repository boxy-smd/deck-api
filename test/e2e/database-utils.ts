import type { INestApplication } from '@nestjs/common'
import { PrismaService } from '@/@infra/database/prisma/prisma.service'

/**
 * Limpa todas as tabelas do banco de dados de teste
 */
export async function clearDatabase(app: INestApplication): Promise<void> {
  const prisma = app.get(PrismaService)

  // Ordem importa devido a foreign keys
  await prisma.comment.deleteMany()
  await prisma.report.deleteMany()
  await prisma.project.deleteMany()
  await prisma.user.deleteMany()
  await prisma.professor.deleteMany()
  await prisma.subject.deleteMany()
  await prisma.trail.deleteMany()
}

/**
 * Desconecta o Prisma após os testes
 */
export async function disconnectPrisma(app: INestApplication): Promise<void> {
  const prisma = app.get(PrismaService)
  await prisma.$disconnect()
}
