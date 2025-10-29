import { z } from 'zod'

import { errorResponseSchema, zodErrorSchema } from '../common.schemas'

const deleteProjectParamsSchemas = z.object({
  projectId: z.string({
    description: 'Project id.',
    required_error: 'Project id is required.',
    message: 'Invalid project id.',
  }),
})

export const deleteProjectSchemas = {
  summary: 'Delete a project',
  tags: ['Projects'],
  params: deleteProjectParamsSchemas,
  response: {
    204: z.object({}),
    400: zodErrorSchema,
    403: errorResponseSchema,
    404: errorResponseSchema,
  },
}

export type DeleteProjectParams = z.infer<typeof deleteProjectParamsSchemas>
