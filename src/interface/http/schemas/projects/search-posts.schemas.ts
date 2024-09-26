import { z } from 'zod'

import { errorResponseSchema, zodErrorSchema } from '../common.schemas.ts'

const searchPostsQuerySchema = z.object(
  {
    professorName: z
      .string({
        description: 'Name of the professor to search posts.',
        invalid_type_error: 'Professor name must be a string.',
      })
      .min(1, 'Professor name must have at least 1 character.')
      .optional(),
    tag: z
      .string({
        description: 'Tag to search posts.',
        invalid_type_error: 'Tag must be a string.',
      })
      .min(1, 'Tag must have at least 1 character.')
      .optional(),
    title: z
      .string({
        description: 'Title to search posts.',
        invalid_type_error: 'Title must be a string.',
      })
      .min(1, 'Title must have at least 1 character.')
      .optional(),
  },
  {
    description: 'Query to search posts.',
  },
)

const searchPostsResponseSchema = z.object(
  {
    posts: z
      .array(
        z.object({
          id: z.string().uuid(),
          title: z.string(),
          description: z.string(),
          bannerUrl: z.string().optional(),
          content: z.string().optional(),
          publishedYear: z.number(),
          status: z.enum(['DRAFT', 'PUBLISHED']),
          semester: z.number(),
          createdAt: z.date(),
          updatedAt: z.date().optional(),
          authorId: z.string(),
          author: z.object({
            name: z.string(),
            username: z.string(),
            profileUrl: z.string().optional(),
          }),
          subjectId: z.string().uuid().optional(),
          subject: z.string().optional(),
          trails: z.array(z.string()),
          professors: z.array(z.string()).optional(),
        }),
      )
      .optional(),
  },
  {
    description: 'Posts searched successfully.',
  },
)

export const searchPostsSchemas = {
  summary: 'Fetch posts',
  tags: ['Projects'],
  querystring: searchPostsQuerySchema,
  response: {
    200: searchPostsResponseSchema,
    400: zodErrorSchema,
    404: errorResponseSchema,
  },
}

export type SearchPostsQuery = z.infer<typeof searchPostsQuerySchema>
