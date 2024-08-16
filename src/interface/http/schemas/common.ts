import { z } from 'zod'

export const zodErrorSchema = z.object(
  {
    message: z.string(),
    errors: z.record(z.array(z.string())).optional(),
  },
  {
    description: 'Zod error response.',
  },
)

export const errorResponseSchema = z.object(
  {
    message: z.string(),
  },
  {
    description: 'Error response.',
  },
)
