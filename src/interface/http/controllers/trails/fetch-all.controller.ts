import type { FastifyReply, FastifyRequest } from 'fastify'

import { makeFetchAllTrailsUseCase } from '@/interface/factories/trails/make-fetch-all-trails-use-case.ts'
import { TrailPresenter } from '../../presenters/trail.ts'

export async function fetchAllTrails(
  _request: FastifyRequest,
  reply: FastifyReply,
) {
  const fetchAllTrailsUseCase = makeFetchAllTrailsUseCase()

  const result = await fetchAllTrailsUseCase.execute()

  return reply.status(200).send({ trails: result.map(TrailPresenter.toHTTP) })
}
