import { z } from 'zod'

const fetchAllSubjectsResponseSchema = z.object(
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

export const fetchAllSubjectsSchemas = {
  summary: 'Fetch all subjects',
  tags: ['Subjects'],
  response: {
    200: fetchAllSubjectsResponseSchema,
  },
}
