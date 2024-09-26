import { makeFilterPostsByQueryUseCase } from '@/interface/factories/projects/make-filter-posts-by-query-use-case.ts'
import type { FastifyReply, FastifyRequest } from 'fastify'
import { PostPresenter } from '../../presenters/post.ts'
import type { FilterPostsQuery } from '../../schemas/projects/filter-posts.schemas.ts'

export async function filterPosts(
  request: FastifyRequest<{
    Querystring: FilterPostsQuery
  }>,
  reply: FastifyReply,
) {
  const { trailsIds, semester, subjectId, publishedYear } = request.query

  const filterPostsByQueryUseCase = makeFilterPostsByQueryUseCase()

  const isTrailArray = Array.isArray(trailsIds)

  const result = await filterPostsByQueryUseCase.execute({
    trailsIds: trailsIds ? (isTrailArray ? trailsIds : [trailsIds]) : undefined,
    semester,
    subjectId,
    publishedYear,
  })

  return reply.status(200).send({
    posts: result.map(PostPresenter.toHTTP),
  })
}
