import { z } from 'zod'

import { zodErrorSchema } from '../common.schemas.ts'

const fetchTrailsResponseSchema = z.object(
  {
    trails: z.array(
      z.object({
        id: z.string(),
        name: z.string(),
      }),
    ),
  },
  {
    description: 'Trails fetched.',
  },
)

export const fetchTrailsSchemas = {
  summary: 'Fetch trails',
  tags: ['Trails'],
  response: {
    200: fetchTrailsResponseSchema,
    400: zodErrorSchema,
  },
}
