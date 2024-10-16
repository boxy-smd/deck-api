import { z } from 'zod'

import { zodErrorSchema } from '../common.schemas.ts'

const fetchSubjectsQuerySchema = z.object({
  name: z
    .string({
      description: 'Subject name.',
      invalid_type_error: 'Subject name must be a string.',
    })
    .min(1, 'Name must have at least 1 character.')
    .optional(),
})

const fetchSubjectsResponseSchema = z.object(
  {
    subjects: z.array(
      z.object({
        id: z.string(),
        name: z.string(),
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
