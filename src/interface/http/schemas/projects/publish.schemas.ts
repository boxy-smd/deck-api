import { z } from 'zod'

import { errorResponseSchema, zodErrorSchema } from '../common.ts'

const publishProjectBodySchema = z.object(
  {
    title: z
      .string({
        description: 'Project title.',
        message: 'Title is required.',
      })
      .min(3, {
        message: 'Title must have at least 3 characters.',
      }),
    description: z.string({
      description: 'Project description.',
      message: 'Description is required.',
    }),
    bannerUrl: z
      .string({
        description: 'Project banner url.',
        message: 'Banner url is required.',
      })
      .url(),
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
      .max(new Date().getFullYear()),
    status: z.enum(['DRAFT', 'PUBLISHED'], {
      description: 'Project status.',
      message: 'Status is required.',
    }),
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
      }),
    allowComments: z.boolean({
      description: 'Project allow comments.',
    }),
    subjectId: z
      .string({
        description: 'Project subject id.',
      })
      .optional(),
    trailsIds: z.array(
      z
        .string({
          description: 'Project trails ids.',
          message: 'Trail id is required.',
        })
        .uuid('Invalid trail id.'),
    ),
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
    description: 'Project publish body.',
    required_error: 'Body is required.',
    invalid_type_error: 'Body must be an object.',
  },
)

const publishProjectResponseSchema = z.object(
  {
    message: z.string(),
  },
  {
    description: 'Project published successfully.',
  },
)

export const publishProjectSchemas = {
  summary: 'Publish a project',
  tags: ['Projects'],
  body: publishProjectBodySchema,
  response: {
    201: publishProjectResponseSchema,
    400: zodErrorSchema,
    403: errorResponseSchema,
    404: errorResponseSchema,
  },
}

export type PublishProjectBody = z.infer<typeof publishProjectBodySchema>
