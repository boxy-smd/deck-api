import { EnvService } from '@/@infra/config/env/env.service'
import { ValidationPipe } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import { AppModule } from './app.module'

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger:
      process.env.NODE_ENV === 'production'
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
    .addTag('Usuários', 'Operações relacionadas a usuários')
    .addTag('Professores', 'Operações relacionadas a professores')
    .addTag('Disciplinas', 'Operações relacionadas a disciplinas')
    .addTag('Trilhas', 'Operações relacionadas a trilhas')
    .addTag('Projetos', 'Operações relacionadas a projetos')
    .addTag('Comentários', 'Operações relacionadas a comentários')
    .build()

  const configService = app.get(EnvService)

  const document = SwaggerModule.createDocument(app, config)
  SwaggerModule.setup('docs', app, document)

  await app.listen(configService.get('PORT'), '0.0.0.0')
  console.log(
    `🚀 Application is running on: http://localhost:${configService.get('PORT')}`,
  )
  console.log(
    `📚 Docs available at http://localhost:${configService.get('PORT')}/docs`,
  )
}

bootstrap()
