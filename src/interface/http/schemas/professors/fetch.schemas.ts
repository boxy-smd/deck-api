import { z } from 'zod'

const fetchProfessorsResponseSchema = z.object(
  {
    professors: z.array(
      z.object({
        id: z.string({
          description: 'Professor id.',
        }),
        name: z.string({
          description: 'Professor name.',
        }),
      }),
    ),
  },
  {
    description: 'Professors fetched.',
  },
)

export const fetchProfessorsSchemas = {
  summary: 'Fetch professors',
  tags: ['Professors'],
  response: {
    200: fetchProfessorsResponseSchema,
  },
}
