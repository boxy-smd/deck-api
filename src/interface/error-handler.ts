import type { FastifyInstance } from 'fastify'
import { ResponseValidationError } from 'fastify-type-provider-zod'

type FastifyErrorHandler = FastifyInstance['errorHandler']

export const errorHandler: FastifyErrorHandler = (error, request, reply) => {
  request.log.error(request)

  if (error.validation) {
    return reply.status(422).send(new Error('Validation failed.'))
  }

  if (error instanceof ResponseValidationError) {
    return reply
      .status(400)
      .send({ message: 'Response validation failed.', details: error.details })
  }

  if (error instanceof Error) {
    return reply.status(400).send({ message: error.message })
  }

  return reply.status(500).send({ message: 'Internal server error!', error })
}
