import { z } from 'zod'

import { zodErrorSchema } from '../common.ts'

const fetchStudentsQuerySchema = z.object({
  name: z
    .string({
      description: 'Student name.',
    })
    .optional(),
})

const fetchStudentsResponseSchema = z.array(
  z.object(
    {
      id: z.string({
        description: 'Student id.',
      }),
      name: z.string({
        description: 'Student name.',
      }),
      username: z.string({
        description: 'Student username.',
      }),
      semester: z.number({
        description: 'Student semester.',
      }),
      profileUrl: z.string({
        description: 'Student profile url.',
      }),
      trailsIds: z.array(
        z.string({
          description: 'Trail id.',
        }),
      ),
    },
    {
      description: 'Student profile.',
    },
  ),
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
