import { z } from 'zod'

import { errorResponseSchema, zodErrorSchema } from '../common.schemas.ts'

const filterPostsQuerySchema = z.object(
  {
    trailsIds: z
      .array(
        z
          .string({
            description: 'Trail ids to filter posts.',
            message: 'Invalid trail id.',
            invalid_type_error: 'Trail id must be a string.',
          })
          .uuid('Invalid trail id.'),
      )
      .or(
        z
          .string({
            description: 'Trail id to filter posts.',
            message: 'Invalid trail id.',
            invalid_type_error: 'Trail id must be a string.',
          })
          .uuid('Invalid trail id.'),
      )
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
    posts: z
      .array(
        z.object({
          id: z.string().uuid(),
          title: z.string(),
          description: z.string(),
          bannerUrl: z.string().optional(),
          content: z.string().optional(),
          publishedYear: z.number(),
          status: z.enum(['DRAFT', 'PUBLISHED', 'ARCHIVED']),
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
          subject: z.object({
            name: z.string(),
          }).optional(),
          trails: z.array(z.object({
            name: z.string(),
          })),
          professors: z.array(z.object({
            name: z.string(),
          })).optional(),
        }),
      )
      .optional(),
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
