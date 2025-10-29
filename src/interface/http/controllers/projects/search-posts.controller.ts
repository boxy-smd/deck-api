import type { FastifyReply, FastifyRequest } from 'fastify'

import { makeSearchPostsByProfessorNameUseCase } from '@/interface/factories/projects/make-search-posts-by-professor-name-use-case'
import { makeSearchPostsByTagUseCase } from '@/interface/factories/projects/make-search-posts-by-tag-use-case'
import { makeSearchPostsByTitleUseCase } from '@/interface/factories/projects/make-search-posts-by-title-use-case'
import { PostPresenter } from '../../presenters/post'
import type { SearchPostsQuery } from '../../schemas/projects/search-posts.schemas'

export async function searchPosts(
  request: FastifyRequest<{
    Querystring: SearchPostsQuery
  }>,
  reply: FastifyReply,
) {
  const { professorName, tag, title } = request.query

  let posts: Post[] = []

  if (professorName) {
    const searchPostsByProfessorNameUseCase =
      makeSearchPostsByProfessorNameUseCase()

    posts = await searchPostsByProfessorNameUseCase.execute({
      name: professorName,
    })
  }

  if (tag) {
    const searchPostsByTagUseCase = makeSearchPostsByTagUseCase()

    posts = await searchPostsByTagUseCase.execute({
      tag,
    })
  }

  if (title) {
    const searchPostsByTitleUseCase = makeSearchPostsByTitleUseCase()

    posts = await searchPostsByTitleUseCase.execute({
      title,
    })
  }

  return reply.status(200).send({
    posts: posts.map(PostPresenter.toHTTP),
  })
}
