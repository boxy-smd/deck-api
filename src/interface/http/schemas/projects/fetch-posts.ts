import { z } from 'zod'

import { errorResponseSchema, zodErrorSchema } from '../common.schemas.ts'

const fetchPostsResponseSchema = z.object(
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
    description: 'Posts fetched successfully.',
  },
)

export const fetchPostsSchemas = {
  summary: 'Fetch posts',
  tags: ['Projects'],
  response: {
    200: fetchPostsResponseSchema,
    400: zodErrorSchema,
    404: errorResponseSchema,
  },
}

export type FetchPostsResponse = z.infer<typeof fetchPostsResponseSchema>
