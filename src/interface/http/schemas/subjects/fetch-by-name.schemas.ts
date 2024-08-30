import { z } from 'zod'

const fetchSubjectsByNameQuerySchema = z.object({
  name: z
    .string({
      description: 'Subject name.',
    })
    .min(1, 'Name must have at least 1 character.'),
})

const fetchSubjectsByNameResponseSchema = z.object({
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
})

export const fetchSubjectsByNameSchemas = {
  summary: 'Fetch subjects by name',
  tags: ['subjects'],
  querystring: fetchSubjectsByNameQuerySchema,
  response: {
    200: fetchSubjectsByNameResponseSchema,
  },
}

export type FetchSubjectsByNameQuerySchema = z.infer<
  typeof fetchSubjectsByNameQuerySchema
>
