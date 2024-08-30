import { z } from 'zod'

const fetchProfessorsByNameQuerySchema = z.object({
  name: z
    .string({
      description: 'Professor name.',
    })
    .min(1, 'Name must have at least 1 character.'),
})

const fetchProfessorsByNameResponseSchema = z.object(
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
    description: 'Professors fetched by name.',
  },
)

export const fetchProfessorsByNameSchemas = {
  summary: 'Fetch professors by name',
  tags: ['professors'],
  querystring: fetchProfessorsByNameQuerySchema,
  response: {
    200: fetchProfessorsByNameResponseSchema,
  },
}

export type FetchProfessorsByNameQuerySchema = z.infer<
  typeof fetchProfessorsByNameQuerySchema
>
