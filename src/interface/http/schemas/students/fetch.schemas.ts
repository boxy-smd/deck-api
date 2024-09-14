import { z } from 'zod'

import { zodErrorSchema } from '../common.schemas.ts'

const fetchStudentsQuerySchema = z.object({
  name: z
    .string({
      description: 'Student name.',
    })
    .optional(),
})

const fetchStudentsResponseSchema = z.object(
  {
    students: z.array(
      z.object({
        id: z.string(),
        name: z.string(),
        username: z.string(),
        semester: z.number(),
        profileUrl: z.string(),
        trails: z.array(z.string()),
      }),
    ),
  },
  {
    description: 'Students fetched successfully.',
  },
)

export const fetchStudentsSchemas = {
  summary: 'Fetch students',
  tags: ['Students'],
  querystring: fetchStudentsQuerySchema,
  response: {
    200: fetchStudentsResponseSchema,
    400: zodErrorSchema,
  },
}

export type FetchStudentsQuery = z.infer<typeof fetchStudentsQuerySchema>
