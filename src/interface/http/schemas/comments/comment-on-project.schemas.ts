import { z } from 'zod'

import { errorResponseSchema, zodErrorSchema } from '../common.schemas.ts'

const commentOnProjectParamsSchema = z.object({
  projectId: z
    .string({
      description: 'The project id',
      invalid_type_error: 'Project id must be a string',
      required_error: 'Project id is required',
    })
    .uuid('Invalid project id'),
})

const commentOnProjectBodySchema = z.object(
  {
    content: z.string({
      description: 'The comment content',
      required_error: 'Content is required',
    }),
  },
  {
    description: 'Comment on project body.',
    required_error: 'Body is required.',
    invalid_type_error: 'Body must be an object.',
  },
)

const commentOnProjectResponseSchema = z.object(
  {
    commentId: z.string().uuid(),
  },
  {
    description: 'Comment created successfully.',
  },
)

export const commentOnProjectSchemas = {
  summary: 'Comment on project',
  tags: ['Comments', 'Projects'],
  params: commentOnProjectParamsSchema,
  body: commentOnProjectBodySchema,
  response: {
    201: commentOnProjectResponseSchema,
    400: zodErrorSchema,
    403: errorResponseSchema,
    404: errorResponseSchema,
  },
}

export type CommentOnProjectParams = z.infer<
  typeof commentOnProjectParamsSchema
>
export type CommentOnProjectBody = z.infer<typeof commentOnProjectBodySchema>
