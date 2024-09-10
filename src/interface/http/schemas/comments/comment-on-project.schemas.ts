import { z } from 'zod'
import { errorResponseSchema, zodErrorSchema } from '../common.ts'

const commentOnProjectParamsSchema = z.object({
  projectId: z.string({
    description: 'The project id',
    required_error: 'Project id is required',
  }),
})

const commentOnProjectBodySchema = z.object({
  content: z.string({
    description: 'The comment content',
    required_error: 'Content is required',
  }),
  authorId: z.string({
    description: 'The author id',
    required_error: 'Author id is required',
  }),
})

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
    404: errorResponseSchema,
  },
}

export type CommentOnProjectParams = z.infer<
  typeof commentOnProjectParamsSchema
>
export type CommentOnProjectBody = z.infer<typeof commentOnProjectBodySchema>
