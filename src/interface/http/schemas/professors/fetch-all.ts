import { z } from 'zod'

const fetchAllProfessorsResponseSchema = z.object(
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

export const fetchAllProfessorsSchemas = {
  summary: 'Fetch all professors',
  tags: ['Professors'],
  response: {
    200: fetchAllProfessorsResponseSchema,
  },
}
