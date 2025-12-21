import { type INestApplication, ValidationPipe } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import { AppModule } from '@/@presentation/app.module'

/**
 * Cria uma instância da aplicação NestJS para testes E2E
 * Aplica os mesmos pipes e configurações do ambiente de produção
 */
export async function createTestApp(): Promise<INestApplication> {
  const app = await NestFactory.create(AppModule, {
    logger: ['error', 'warn', 'log'],
  })

  // Aplica ValidationPipe global (mesma config de produção)
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  )

  await app.init()

  return app
}
