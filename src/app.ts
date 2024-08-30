import fastifyCookie from '@fastify/cookie'
import fastifyCors from '@fastify/cors'
import fastifyJWT from '@fastify/jwt'
import fastifySwagger from '@fastify/swagger'
import fastifyScalar from '@scalar/fastify-api-reference'
import { fastify } from 'fastify'
import {
  jsonSchemaTransform,
  serializerCompiler,
  validatorCompiler,
} from 'fastify-type-provider-zod'

import { envToLogger } from '@/infra/config/entToLogger.ts'
import { env } from '@/infra/config/env.ts'
import { errorHandler } from '@/interface/error-handler.ts'
import { usersRoutes } from '@/interface/http/routes/users.routes.ts'
import { professorsRoutes } from './interface/http/routes/professors.routes.ts'
import { subjectsRoutes } from './interface/http/routes/subjects.routes.ts'
import { trailsRoutes } from './interface/http/routes/trails.routes.ts'

async function buildServer() {
  const app = fastify({
    logger: envToLogger[env.NODE_ENV],
  })

  app.register(fastifyCors, {
    origin: '*',
  })

  app.register(fastifyJWT, {
    secret: env.JWT_SECRET,
    cookie: {
      cookieName: 'refreshToken',
      signed: false,
    },
    sign: {
      expiresIn: '10m',
    },
  })

  app.register(fastifyCookie)

  app.setValidatorCompiler(validatorCompiler)
  app.setSerializerCompiler(serializerCompiler)

  app.register(fastifySwagger, {
    swagger: {
      consumes: ['application/json'],
      produces: ['application/json'],
      info: {
        title: 'Deck API',
        contact: {
          name: 'Boxy Team',
          email: 'boxy@gmail.com',
        },
        description:
          'Esse é o backend do projeto **Deck**, um projeto de uma aplicação que servirá como repositório de trabalhos realizados por alunos do curso de Sistemas e Mídias Digitais da Universidade Federal do Ceará.',
        version: '1.0.0',
      },
      tags: [
        { name: 'Users', description: 'Operations related to users' },
        { name: 'Professors', description: 'Operations related to professors' },
        { name: 'Subjects', description: 'Operations related to subjects' },
        { name: 'Trails', description: 'Operations related to trails' },
      ],
    },
    transform: jsonSchemaTransform,
  })

  app.register(fastifyScalar, {
    routePrefix: '/docs',
    configuration: {
      title: 'Deck API',
      spec: {
        content: () => app.swagger(),
      },
      theme: 'purple',
      metaData: {
        title: 'Deck API Reference',
        description: 'API Reference for Deck API',
      },
    },
  })

  app.register(usersRoutes)
  app.register(subjectsRoutes)
  app.register(professorsRoutes)
  app.register(trailsRoutes)

  app.get('/health-check', () => {
    return {
      status: 'ok',
    }
  })

  app.setErrorHandler(errorHandler)

  return app
}

export const app = await buildServer()
