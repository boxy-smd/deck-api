import { ValidationPipe } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import { AppModule } from './app.module'
import { env } from './infra/config/env/env'

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger:
      env.NODE_ENV === 'production'
        ? ['error', 'warn']
        : ['log', 'error', 'warn', 'debug', 'verbose'],
  })

  app.enableCors({
    origin: ['http://localhost:3000', 'https://deck-smd.vercel.app'],
    credentials: true,
  })

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  )

  const config = new DocumentBuilder()
    .setTitle('Deck API')
    .setDescription(
      'Esse é o backend do projeto **Deck**, um projeto de uma aplicação que servirá como repositório de trabalhos realizados por alunos do curso de Sistemas e Mídias Digitais da Universidade Federal do Ceará.',
    )
    .setVersion('1.0.0')
    .setContact('Boxy Team', '', 'boxy@gmail.com')
    .addBearerAuth()
    .addTag('Students', 'Operations related to students')
    .addTag('Professors', 'Operations related to professors')
    .addTag('Subjects', 'Operations related to subjects')
    .addTag('Trails', 'Operations related to trails')
    .addTag('Projects', 'Operations related to projects')
    .addTag('Comments', 'Operations related to comments')
    .addTag('Reports', 'Operations related to reports')
    .build()

  const document = SwaggerModule.createDocument(app, config)
  SwaggerModule.setup('docs', app, document)

  await app.listen(env.PORT, '0.0.0.0')
  console.log(`🚀 Application is running on: http://localhost:${env.PORT}`)
  console.log(`📚 Docs available at http://localhost:${env.PORT}/docs`)
}

bootstrap()
