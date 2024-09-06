import { z } from 'zod'

import { zodErrorSchema } from '../common.ts'

const fetchStudentsByQuerySchema = z.object({
  name: z.string({
    description: 'Student name.',
  }),
  username: z.string({
    description: 'Student username.',
  }),
})

const fetchStudentsByQueryResponseSchema = z.array(
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

export const fetchStudentsByQuerySchemas = {
  summary: 'Fetch students by query',
  tags: ['Students'],
  querystring: fetchStudentsByQuerySchema,
  response: {
    200: fetchStudentsByQueryResponseSchema,
    400: zodErrorSchema,
  },
}

export type FetchStudentsByQuerySchema = z.infer<
  typeof fetchStudentsByQuerySchema
>
