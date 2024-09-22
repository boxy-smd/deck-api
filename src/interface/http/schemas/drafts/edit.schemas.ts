import { z } from 'zod'

import { errorResponseSchema, zodErrorSchema } from '../common.schemas.ts'

const editDraftBodySchema = z.object(
  {
    title: z
      .string({
        description: 'Draft title.',
      })
      .min(3, {
        message: 'Title must have at least 3 characters.',
      })
      .optional(),
    description: z
      .string({
        description: 'Draft description.',
      })
      .optional(),
    bannerUrl: z
      .string({
        description: 'Draft banner url.',
      })
      .url()
      .optional(),
    content: z
      .string({
        description: 'Draft content.',
      })
      .optional(),
    publishedYear: z
      .number({
        description: 'Draft published year.',
      })
      .min(2000)
      .max(new Date().getFullYear())
      .optional(),
    semester: z
      .number({
        description: 'Draft semester.',
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
        description: 'Draft allow comments.',
      })
      .optional(),
    subjectId: z
      .string({
        description: 'Draft subject id.',
      })
      .uuid('Invalid subject id.')
      .optional(),
    trailsIds: z
      .array(
        z
          .string({
            description: 'Draft trail id.',
            required_error: 'Trail id is required.',
          })
          .uuid('Invalid trail id.'),
        {
          description: 'Draft trails ids.',
          required_error: 'Trails ids are required.',
        },
      )
      .optional(),
    professorsIds: z
      .array(
        z
          .string({
            description: 'Draft professor id.',
          })
          .uuid('Invalid professor id.'),
        {
          description: 'Draft professors ids.',
        },
      )
      .optional(),
  },
  {
    description: 'Draft edit body.',
    required_error: 'Body is required.',
    invalid_type_error: 'Body must be an object.',
  },
)

const editDraftParamsSchema = z.object(
  {
    draftId: z.string({
      description: 'Draft id.',
      invalid_type_error: 'Draft id must be a string.',
      required_error: 'Draft id is required.',
    }),
  },
  {
    description: 'Draft id.',
  },
)

const editDraftResponseSchema = z.object(
  {
    message: z.string(),
  },
  {
    description: 'Draft edited successfully.',
  },
)

export const editDraftSchemas = {
  summary: 'Edit a draft',
  tags: ['Drafts'],
  body: editDraftBodySchema,
  params: editDraftParamsSchema,
  response: {
    201: editDraftResponseSchema,
    400: zodErrorSchema,
    403: errorResponseSchema,
    404: errorResponseSchema,
  },
}

export type EditDraftBody = z.infer<typeof editDraftBodySchema>
export type EditDraftParams = z.infer<typeof editDraftParamsSchema>
export type EditDraftResponse = z.infer<typeof editDraftResponseSchema>
