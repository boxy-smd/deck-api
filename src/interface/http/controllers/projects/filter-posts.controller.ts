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
  const {
    trailOneId,
    trailTwoId,
    trailThreeId,
    trailFourId,
    semester,
    subjectId,
    publishedYear,
  } = request.query

  const trailsIds = [trailOneId, trailTwoId, trailThreeId, trailFourId].filter(
    trailId => trailId !== undefined,
  )

  const filterPostsByQueryUseCase = makeFilterPostsByQueryUseCase()

  const result = await filterPostsByQueryUseCase.execute({
    trailsIds,
    semester: Number(semester),
    subjectId,
    publishedYear: Number(publishedYear),
  })

  return reply.status(200).send({
    posts: result.map(PostPresenter.toHTTP),
  })
}
