import type { FastifyReply, FastifyRequest } from 'fastify'

import { makeFetchTrailsUseCase } from '@/interface/factories/trails/make-fetch-trail-use-case.ts'

export async function fetchTrails(
  _request: FastifyRequest,
  reply: FastifyReply,
) {
  const fetchTrailUseCase = makeFetchTrailsUseCase()

  const result = await fetchTrailUseCase.execute()

  return reply.status(200).send({
    trails: result.map(trail => ({
      id: trail.id,
      name: trail.name,
    })),
  })
}
