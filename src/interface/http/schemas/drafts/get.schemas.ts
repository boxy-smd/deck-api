import { z } from 'zod'

import { errorResponseSchema, zodErrorSchema } from '../common.schemas.ts'

const getDraftParamsSchema = z.object(
  {
    draftId: z
      .string({
        description: 'Draft id.',
        invalid_type_error: 'Draft id must be a string.',
        required_error: 'Draft id is required.',
      })
      .uuid('Invalid draft id.'),
  },
  {
    description: 'Draft id.',
  },
)

const getDraftResponseSchema = z.object(
  {
    draft: z.object({
      id: z.string(),
      title: z.string(),
      description: z.string().optional(),
      bannerUrl: z.string().optional(),
      content: z.string().optional(),
      publishedYear: z.number().optional(),
      semester: z.number().optional(),
      allowComments: z.boolean().optional(),
      createdAt: z.date().optional(),
      updatedAt: z.date().optional(),
      subjectId: z.string().optional(),
      trailsIds: z.array(z.string()).optional(),
      professorsIds: z.array(z.string()).optional(),
    }),
  },
  {
    description: 'Draft get successfully.',
  },
)

export const getDraftSchemas = {
  summary: 'Get a draft',
  tags: ['Drafts'],
  params: getDraftParamsSchema,
  response: {
    200: getDraftResponseSchema,
    400: zodErrorSchema,
    404: errorResponseSchema,
  },
}

export type GetDraftParams = z.infer<typeof getDraftParamsSchema>
