import { z } from 'zod'

import { errorResponseSchema, zodErrorSchema } from '../common.schemas.ts'

const createDraftBodySchema = z.object(
  {
    title: z
      .string({
        description: 'Project title.',
        message: 'Title is required.',
      })
      .min(3, {
        message: 'Title must have at least 3 characters.',
      }),
    description: z
      .string({
        description: 'Project description.',
      })
      .optional(),
    bannerUrl: z
      .string({
        description: 'Project banner url.',
      })
      .url()
      .optional(),
    content: z
      .string({
        description: 'Project content.',
      })
      .optional(),
    publishedYear: z
      .number({
        description: 'Project published year.',
        message: 'Published year is required.',
      })
      .min(2000)
      .max(new Date().getFullYear())
      .optional(),
    semester: z
      .number({
        description: 'Project semester.',
        message: 'Semester is required.',
      })
      .min(1, {
        message: 'Semester must be between 1 and 12.',
      })
      .max(12, {
        message: 'Semester must be between 1 and 12.',
      })
      .optional(),
    allowComments: z
      .boolean({
        description: 'Project allow comments.',
      })
      .optional(),
    subjectId: z
      .string({
        description: 'Project subject id.',
      })
      .optional(),
    trailsIds: z
      .array(
        z
          .string({
            description: 'Project trails ids.',
            message: 'Trail id is required.',
          })
          .uuid('Invalid trail id.'),
      )
      .optional(),
    professorsIds: z
      .array(
        z
          .string({
            description: 'Project professors ids.',
          })
          .uuid('Invalid professor id.'),
      )
      .optional(),
  },
  {
    description: 'Create draft body.',
    required_error: 'Body is required.',
    invalid_type_error: 'Body must be an object.',
  },
)

const createDraftResponseSchema = z.object(
  {
    draft_id: z.string().uuid(),
  },
  {
    description: 'Draft created successfully.',
  },
)

export const createDraftSchemas = {
  summary: 'Create a draft',
  tags: ['Drafts'],
  body: createDraftBodySchema,
  response: {
    201: createDraftResponseSchema,
    400: zodErrorSchema,
    403: errorResponseSchema,
    404: errorResponseSchema,
  },
}

export type CreateDraftBody = z.infer<typeof createDraftBodySchema>
