import { z } from 'zod'
import { zodErrorSchema } from '../common.ts'

const fetchTrailsResponseSchema = z.object(
  {
    trails: z.array(
      z.object({
        id: z.string({
          description: 'Trail id.',
        }),
        name: z.string({
          description: 'Trail name.',
        }),
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
