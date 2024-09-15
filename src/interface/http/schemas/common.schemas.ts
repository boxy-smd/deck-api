import { z } from 'zod'

export const zodErrorSchema = z.object(
  {
    message: z.string({
      description: 'Zod error message.',
    }),
    errors: z.object(
      {
        fields: z.record(z.array(z.string())),
        form: z.array(z.string()),
      },
      {
        description: 'Zod error fields and form.',
      },
    ),
  },
  {
    description: 'Zod error response.',
  },
)

export const errorResponseSchema = z.object(
  {
    message: z.string({
      description: 'Error message.',
    }),
  },
  {
    description: 'Error response.',
  },
)
