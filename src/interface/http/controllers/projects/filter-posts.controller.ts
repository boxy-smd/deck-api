import { makeFilterPostsByQueryUseCase } from '@/interface/factories/projects/make-filter-posts-by-query-use-case'
import type { FastifyReply, FastifyRequest } from 'fastify'
import { PostPresenter } from '../../presenters/post'
import type { FilterPostsQuery } from '../../schemas/projects/filter-posts.schemas'

export async function filterPosts(
  request: FastifyRequest<{
    Querystring: FilterPostsQuery
  }>,
  reply: FastifyReply,
) {
  const { trailsIds, semester, subjectId, publishedYear } = request.query

  const filterPostsByQueryUseCase = makeFilterPostsByQueryUseCase()

  // Handle comma-separated string or single trail ID
  const trailsArray = trailsIds 
    ? trailsIds.includes(',') 
      ? trailsIds.split(',').map(id => id.trim())
      : [trailsIds]
    : undefined

  const result = await filterPostsByQueryUseCase.execute({
    trailsIds: trailsArray,
    semester,
    subjectId,
    publishedYear,
  })

  return reply.status(200).send({
    posts: result.map(PostPresenter.toHTTP),
  })
}
