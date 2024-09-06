import { z } from 'zod'

const fetchAllTrailsResponseSchema = z.object(
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

export const fetchAllTrailsSchemas = {
  summary: 'Fetch all trails',
  tags: ['Trails'],
  response: {
    200: fetchAllTrailsResponseSchema,
  },
}
