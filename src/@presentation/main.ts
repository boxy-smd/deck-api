import { ValidationPipe } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import { EnvService } from '@/@infra/config/env/env.service'
import { AppModule } from './app.module'

async function bootstrap() {
  console.log('🔧 Starting application...')
  console.log('📍 NODE_ENV:', process.env.NODE_ENV)
  console.log('📍 PORT:', process.env.PORT)

  try {
    const app = await NestFactory.create(AppModule, {
      logger:
        process.env.NODE_ENV === 'production'
          ? ['error', 'warn', 'log']
          : ['log', 'error', 'warn', 'debug', 'verbose'],
    })

    console.log('✅ NestJS application created')

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
    const port = configService.get('PORT')

    console.log('✅ Config service loaded, port:', port)

    const document = SwaggerModule.createDocument(app, config)
    SwaggerModule.setup('docs', app, document, {
      jsonDocumentUrl: '/docs-json',
    })

    console.log('✅ Swagger configured')
    console.log(`🎯 Attempting to listen on port ${port}...`)

    await app.listen(port, '0.0.0.0')

    console.log(`🚀 Application is running on: http://0.0.0.0:${port}`)
    console.log(`📚 Docs available at http://0.0.0.0:${port}/docs`)
    console.log(`💚 Health check at http://0.0.0.0:${port}/health-check`)
  } catch (error) {
    console.error('❌ Failed to start application:', error)
    process.exit(1)
  }
}

bootstrap()
