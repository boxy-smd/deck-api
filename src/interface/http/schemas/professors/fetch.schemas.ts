import { z } from 'zod'

import { zodErrorSchema } from '../common.schemas.ts'

const fetchProfessorsQuerySchema = z.object({
  name: z
    .string({
      description: 'Professor name.',
      invalid_type_error: 'Professor name must be a string.',
    })
    .min(1, 'Name must have at least 1 character.')
    .optional(),
})

const fetchProfessorsResponseSchema = z.object(
  {
    professors: z.array(
      z.object({
        id: z.string(),
        name: z.string(),
      }),
    ),
  },
  {
    description: 'Professors fetched.',
  },
)

export const fetchProfessorsSchemas = {
  summary: 'Fetch  professors',
  tags: ['Professors'],
  querystring: fetchProfessorsQuerySchema,
  response: {
    200: fetchProfessorsResponseSchema,
    400: zodErrorSchema,
  },
}

export type FetchProfessors = z.infer<typeof fetchProfessorsQuerySchema>
