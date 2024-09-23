import fastifyCookie from '@fastify/cookie'
import fastifyCors from '@fastify/cors'
import fastifyJWT from '@fastify/jwt'
import fastifyMultipart from '@fastify/multipart'
import fastifySwagger from '@fastify/swagger'
import fastifyScalar from '@scalar/fastify-api-reference'
import { fastify } from 'fastify'
import {
  jsonSchemaTransform,
  serializerCompiler,
  validatorCompiler,
} from 'fastify-type-provider-zod'

import { envToLogger } from '@/infra/config/env/env-to-logger.ts'
import { env } from '@/infra/config/env/env.ts'
import { errorHandler } from '@/interface/error-handler.ts'
import { studentsRoutes } from '@/interface/http/routes/students.routes.ts'
import { commentsRoutes } from './interface/http/routes/comments.routes.ts'
import { draftsRoutes } from './interface/http/routes/drafts.routes.ts'
import { professorsRoutes } from './interface/http/routes/professors.routes.ts'
import { projectsRoutes } from './interface/http/routes/projects.routes.ts'
import { subjectsRoutes } from './interface/http/routes/subjects.routes.ts'
import { trailsRoutes } from './interface/http/routes/trails.routes.ts'

async function buildServer() {
  const app = fastify({
    logger: envToLogger[env.NODE_ENV],
  })

  app.register(fastifyCors, {
    origin: ['http://localhost:3000'],
    credentials: true,
  })

  app.register(fastifyJWT, {
    cookie: {
      cookieName: 'refreshToken',
      signed: false,
    },
    secret: env.JWT_SECRET,
    sign: {
      expiresIn: '10m',
    },
  })

  app.register(fastifyCookie, {
    secret: env.JWT_SECRET,
  })

  app.register(fastifyMultipart, {
    limits: {
      files: 1,
      fileSize: 5 * 1024 * 1024, // 5MB
    },
  })

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
        { name: 'Students', description: 'Operations related to students' },
        { name: 'Professors', description: 'Operations related to professors' },
        { name: 'Subjects', description: 'Operations related to subjects' },
        { name: 'Trails', description: 'Operations related to trails' },
        { name: 'Drafts', description: 'Operations related to drafts' },
        { name: 'Projects', description: 'Operations related to projects' },
        { name: 'Comments', description: 'Operations related to comments' },
        { name: 'Reports', description: 'Operations related to reports' },
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

  app.register(studentsRoutes)
  app.register(subjectsRoutes)
  app.register(professorsRoutes)
  app.register(trailsRoutes)
  app.register(draftsRoutes)
  app.register(projectsRoutes)
  app.register(commentsRoutes)

  app.get('/health-check', () => {
    return {
      status: 'ok',
    }
  })

  app.setErrorHandler(errorHandler)

  return app
}

export const app = await buildServer()
