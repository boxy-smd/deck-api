import { z } from 'zod'

import { errorResponseSchema, zodErrorSchema } from '../common.schemas.ts'

const filterPostsQuerySchema = z.object(
  {
    trailOneId: z
      .string({
        description: 'Trail one id to filter posts.',
        message: 'Invalid trail one id.',
        invalid_type_error: 'Trail one id must be a string.',
      })
      .uuid('Invalid trail one id.')
      .optional(),
    trailTwoId: z
      .string({
        description: 'Trail two id to filter posts.',
        message: 'Invalid trail two id.',
        invalid_type_error: 'Trail two id must be a string.',
      })
      .uuid('Invalid trail two id.')
      .optional(),
    trailThreeId: z
      .string({
        description: 'Trail three id to filter posts.',
        message: 'Invalid trail three id.',
        invalid_type_error: 'Trail three id must be a string.',
      })
      .uuid('Invalid trail three id.')
      .optional(),
    trailFourId: z
      .string({
        description: 'Trail four id to filter posts.',
        message: 'Invalid trail four id.',
        invalid_type_error: 'Trail four id must be a string.',
      })
      .uuid('Invalid trail four id.')
      .optional(),
    semester: z.coerce
      .number({
        description: 'Semester to filter posts.',
        message: 'Invalid semester.',
        invalid_type_error: 'Semester must be a number.',
      })
      .optional(),
    subjectId: z
      .string({
        description: 'Subject id to filter posts.',
        message: 'Invalid subject id.',
        invalid_type_error: 'Subject id must be a string.',
      })
      .uuid('Invalid subject id.')
      .optional(),
    publishedYear: z.coerce
      .number({
        description: 'Published year to filter posts.',
        message: 'Invalid published year.',
        invalid_type_error: 'Published year must be a number.',
      })
      .optional(),
  },
  {
    description: 'Query to filter posts.',
  },
)

const filterPostsResponseSchema = z.object(
  {
    posts: z.array(
      z.object({
        id: z.string().uuid(),
        title: z.string(),
        description: z.string(),
        bannerUrl: z.string(),
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
    ),
  },
  {
    description: 'Posts filtered successfully.',
  },
)

export const filterPostsSchemas = {
  summary: 'Filter posts',
  tags: ['Projects'],
  querystring: filterPostsQuerySchema,
  response: {
    200: filterPostsResponseSchema,
    400: zodErrorSchema,
    404: errorResponseSchema,
  },
}

export type FilterPostsQuery = z.infer<typeof filterPostsQuerySchema>
