import type { FastifyInstance } from 'fastify'
import { ZodError } from 'zod'

type FastifyErrorHandler = FastifyInstance['errorHandler']

export const errorHandler: FastifyErrorHandler = (error, _, reply) => {
  if (error instanceof ZodError) {
    return reply.status(400).send({
      message: 'Error during validation.',
      errors: error.flatten().fieldErrors,
    })
  }

  if (error instanceof Error) {
    return reply.status(400).send({ message: error.message })
  }

  return reply.status(500).send({ message: 'Internal server error!', error })
}
