import { z } from 'zod'
import { zodErrorSchema } from '../common.ts'

const fetchSubjectsQuerySchema = z.object({
  name: z
    .string({
      description: 'Subject name.',
    })
    .min(1, 'Name must have at least 1 character.')
    .optional(),
})

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
  querystring: fetchSubjectsQuerySchema,
  response: {
    200: fetchSubjectsResponseSchema,
    400: zodErrorSchema,
  },
}

export type FetchSubjects = z.infer<typeof fetchSubjectsQuerySchema>
