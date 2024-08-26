import { z } from 'zod'
import { errorResponseSchema, zodErrorSchema } from '../common.ts'

const createSubjectSchema = z.object({
  name: z
    .string({
      description: 'Subject name.',
    })
    .min(3, 'Name must have at least 3 characters.'),
})

const createSubjectResponseSchema = z.object(
  {
    subject_id: z.string({
      description: 'Subject id.',
    }),
  },
  {
    description: 'Subject created successfully.',
  },
)

export const createSubjectSchemas = {
  summary: 'Create subject',
  tags: ['subjects'],
  body: createSubjectSchema,
  response: {
    201: createSubjectResponseSchema,
    400: zodErrorSchema,
    409: errorResponseSchema,
  },
}

export type CreateSubjectBodySchema = z.infer<typeof createSubjectSchemas.body>
