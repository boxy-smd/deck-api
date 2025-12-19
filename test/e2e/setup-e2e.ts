import { AppModule } from '@/@presentation/app.module'
import { type INestApplication, ValidationPipe } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import { config } from 'dotenv'

config({ path: '.env', override: true })
config({ path: '.env.test', override: true })

export async function createTestApp(): Promise<INestApplication> {
  const app = await NestFactory.create(AppModule, {
    // Enable logger to debug 500 errors
    logger: ['error', 'warn', 'log'],
  })

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

// Sem isolamento - usa schema public diretamente
beforeAll(() => {
  console.log('[Setup] Using public schema for E2E tests')
})
