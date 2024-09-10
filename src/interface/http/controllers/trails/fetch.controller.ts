import type { FastifyReply, FastifyRequest } from 'fastify'

import { makeFetchTrailsUseCase } from '@/interface/factories/trails/make-fetch-trails-use-case.ts'
import { TrailPresenter } from '../../presenters/trail.ts'

export async function fetchTrails(
  _request: FastifyRequest,
  reply: FastifyReply,
) {
  const fetchTrailsUseCase = makeFetchTrailsUseCase()

  const result = await fetchTrailsUseCase.execute()

  return reply.status(200).send({ trails: result.map(TrailPresenter.toHTTP) })
}
