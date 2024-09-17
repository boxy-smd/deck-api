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
          bannerUrl: z.string(),
          content: z.string(),
          publishedYear: z.number(),
          semester: z.number(),
          createdAt: z.string(),
          updatedAt: z.string(),
          subject: z.string(),
          trails: z.array(z.string()),
          professors: z.array(z.string()),
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
