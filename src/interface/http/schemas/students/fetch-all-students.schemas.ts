import { z } from 'zod'

import { zodErrorSchema } from '../common.ts'

const fetchAllStudentsResponseSchema = z.array(
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

export const fetchAllStudentsSchemas = {
  summary: 'Fetch all students',
  tags: ['Students'],
  response: {
    200: fetchAllStudentsResponseSchema,
    400: zodErrorSchema,
  },
}
