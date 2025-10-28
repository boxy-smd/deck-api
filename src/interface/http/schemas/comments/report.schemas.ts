import { z } from 'zod'

import { errorResponseSchema, zodErrorSchema } from '../common.schemas.ts'

const reportCommentParamsSchema = z.object({
  commentId: z
    .string({
      description: 'The comment id.',
      invalid_type_error: 'Comment id must be a string.',
      required_error: 'Comment id is required.',
    })
    .uuid('Invalid comment id.'),
})

const reportCommentBodySchema = z.object(
  {
    content: z.string({
      description: 'The report content.',
      required_error: 'Content is required.',
    }),
    projectId: z
      .string({
        description: 'The project id.',
        required_error: 'Project id is required.',
      })
      .uuid('Invalid project id.'),
  },
  {
    description: 'Report comment body.',
    required_error: 'Body is required.',
    invalid_type_error: 'Body must be an object.',
  },
)

const reportCommentResponseSchema = z.object(
  {
    message: z.string(),
  },
  {
    description: 'Comment reported successfully.',
  },
)

export const reportCommentSchemas = {
  summary: 'Report comment',
  tags: ['Comments', 'Reports'],
  params: reportCommentParamsSchema,
  body: reportCommentBodySchema,
  response: {
    201: reportCommentResponseSchema,
    400: zodErrorSchema,
    403: errorResponseSchema,
    404: errorResponseSchema,
  },
}

export type ReporCommentParams = z.infer<typeof reportCommentParamsSchema>
export type ReporCommentBody = z.infer<typeof reportCommentBodySchema>
