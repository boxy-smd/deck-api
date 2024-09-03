import { z } from 'zod'

const fetchSubjectsResponseSchema = z.object(
  {
    subjects: z.array(
      z.object({
        id: z.string({
          description: 'Subject id.',
        }),
        name: z.string({
          description: 'Subject name.',
        }),
      }),
    ),
  },
  {
    description: 'Subjects fetched.',
  },
)

export const fetchSubjectsSchemas = {
  summary: 'Fetch subjects',
  tags: ['Subjects'],
  response: {
    200: fetchSubjectsResponseSchema,
  },
}
