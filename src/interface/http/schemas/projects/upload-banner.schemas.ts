import { z } from 'zod'

import { zodErrorSchema } from '../common.schemas.ts'

const uploadBannerParamsSchema = z.object({
  projectId: z
    .string({
      description: 'Project id.',
      required_error: 'Project id is required.',
    })
    .uuid('Invalid project id.'),
})

const uploadBannerResponseSchema = z.object(
  {
    url: z.string(),
  },
  {
    description: 'Banner image uploaded successfully.',
  },
)

export const uploadBannerSchemas = {
  summary: 'Update banner',
  tags: ['Projects'],
  params: uploadBannerParamsSchema,
  response: {
    200: uploadBannerResponseSchema,
    400: zodErrorSchema,
    403: zodErrorSchema,
  },
}

export type UpdateBannerParams = z.infer<typeof uploadBannerSchemas.params>
