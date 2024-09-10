import type { FastifyReply, FastifyRequest } from 'fastify'

import { makeFetchPostsUseCase } from '@/interface/factories/projects/make-fetch-posts-use-case.ts'
import { PostPresenter } from '../../presenters/post.ts'

export async function fetchPosts(
  _request: FastifyRequest,
  reply: FastifyReply,
) {
  const fetchPostsUseCase = makeFetchPostsUseCase()

  const result = await fetchPostsUseCase.execute()

  reply.status(200).send({
    posts: result.map(PostPresenter.toHTTP),
  })
}
