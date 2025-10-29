import { z } from 'zod'

import { zodErrorSchema } from '../common.schemas'

const refreshResponseSchema = z.object(
  {
    token: z.string(),
  },
  {
    description: 'Student token refreshed successfully.',
  },
)

export const refreshSchemas = {
  summary: 'Refresh token',
  tags: ['Students'],
  response: {
    200: refreshResponseSchema,
    400: zodErrorSchema,
  },
}
