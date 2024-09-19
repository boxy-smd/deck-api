import type { FastifyInstance } from 'fastify'
import { ZodError } from 'zod'

type FastifyErrorHandler = FastifyInstance['errorHandler']

export const errorHandler: FastifyErrorHandler = (error, request, reply) => {
  request.log.error(request)

  if (error instanceof ZodError) {
    const errors = {
      fields: error.flatten().fieldErrors,
      form: error.flatten().formErrors,
    }

    return reply.status(400).send({
      message: 'Error during validation.',
      errors,
    })
  }

  if (error instanceof Error) {
    return reply.status(400).send({ message: error.message })
  }

  return reply.status(500).send({ message: 'Internal server error!', error })
}
