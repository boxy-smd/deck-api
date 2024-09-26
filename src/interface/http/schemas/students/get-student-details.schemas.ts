import { z } from 'zod'

import { errorResponseSchema, zodErrorSchema } from '../common.schemas.ts'

const getStudentDetailsResponseSchema = z.object(
  {
    details: z.object({
      id: z.string(),
      name: z.string(),
      username: z.string(),
      semester: z.number(),
      about: z.string().optional(),
      profileUrl: z.string().optional(),
      trails: z.array(z.string()),
      posts: z.array(
        z.object({
          id: z.string(),
          title: z.string(),
          description: z.string(),
          bannerUrl: z.string().optional(),
          content: z.string(),
          publishedYear: z.number(),
          semester: z.number(),
          createdAt: z.date(),
          updatedAt: z.date(),
          subject: z.string(),
          trails: z.array(z.string()),
          professors: z.array(z.string()),
        }),
      ),
      drafts: z.array(
        z.object({
          id: z.string(),
          title: z.string(),
          bannerUrl: z.string().optional(),
          content: z.string().optional(),
          publishedYear: z.number().optional(),
          semester: z.number().optional(),
          createdAt: z.date().optional(),
          updatedAt: z.date().optional(),
          subjectId: z.string().optional(),
          trailsIds: z.array(z.string()).optional(),
          professorsIds: z.array(z.string()).optional(),
        }),
      ),
    }),
  },
  {
    description: 'Student details get successfully.',
  },
)

export const getStudentDetailsSchemas = {
  summary: 'Get student details',
  tags: ['Students'],
  response: {
    200: getStudentDetailsResponseSchema,
    400: zodErrorSchema,
    404: errorResponseSchema,
  },
}

export type GetStudentDetailsResponse = z.infer<
  typeof getStudentDetailsResponseSchema
>
