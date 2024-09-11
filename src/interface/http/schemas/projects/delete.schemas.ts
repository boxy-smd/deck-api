import { z } from 'zod'

import { errorResponseSchema, zodErrorSchema } from '../common.ts'

const deleteProjectParamsSchemas = z.object({
  projectId: z.string({
    description: 'Project id.',
    required_error: 'Project id is required.',
    message: 'Invalid project id.',
  }),
})

const deleteProjectResponseSchema = z.undefined()

export const deleteProjectSchemas = {
  summary: 'Delete a project',
  tags: ['Projects'],
  params: deleteProjectParamsSchemas,
  response: {
    204: deleteProjectResponseSchema,
    400: zodErrorSchema,
    404: errorResponseSchema,
  },
}

export type DeleteProjectParams = z.infer<typeof deleteProjectParamsSchemas>
