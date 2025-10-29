import { z } from 'zod'

import { errorResponseSchema, zodErrorSchema } from '../common.schemas.ts'

const deleteCommentParamsSchemas = z.object({
  commentId: z.string({
    description: 'Comment id.',
    required_error: 'Comment id is required.',
    message: 'Invalid comment id.',
  }),
  projectId: z.string({
    description: 'Project id.',
    required_error: 'Project id is required.',
    message: 'Invalid project id.',
  }),
})

export const deleteCommentSchemas = {
  summary: 'Delete a comment',
  tags: ['Comments'],
  params: deleteCommentParamsSchemas,
  response: {
    204: z.object({}),
    400: zodErrorSchema,
    403: errorResponseSchema,
    404: errorResponseSchema,
  },
}

export type DeleteCommentParams = z.infer<typeof deleteCommentParamsSchemas>
