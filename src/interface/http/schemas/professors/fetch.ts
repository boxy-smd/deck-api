import { z } from 'zod'
import { zodErrorSchema } from '../common.ts'

const fetchProfessorsQuerySchema = z.object({
  name: z
    .string({
      description: 'Professor name.',
    })
    .min(1, 'Name must have at least 1 character.')
    .optional(),
})

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
  summary: 'Fetch  professors',
  tags: ['Professors'],
  querystring: fetchProfessorsQuerySchema,
  response: {
    200: fetchProfessorsResponseSchema,
    400: zodErrorSchema,
  },
}

export type FetchProfessors = z.infer<typeof fetchProfessorsQuerySchema>
