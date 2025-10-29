import { INestApplication, ValidationPipe } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import { AppModule } from '@/@presentation/app.module'

let app: INestApplication

export async function createTestApp(): Promise<INestApplication> {
  if (app) {
    return app
  }

  const moduleRef = await Test.createTestingModule({
    imports: [AppModule],
  }).compile()

  app = moduleRef.createNestApplication()

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

export async function closeTestApp(): Promise<void> {
  if (app) {
    await app.close()
    app = null
  }
}
