import { z } from 'zod'
import { zodErrorSchema } from '../common.ts'

const uploadBannerResponseSchema = z.object(
  {
    banner: z.object({
      id: z.string({
        description: 'Banner id.',
      }),
      url: z.string({
        description: 'Banner url.',
      }),
    }),
  },
  {
    description: 'Banner uploaded.',
  },
)

export const uploadBannerSchemas = {
  summary: 'Upload banner',
  tags: ['Banners'],
  response: {
    201: uploadBannerResponseSchema,
    400: zodErrorSchema,
  },
}
