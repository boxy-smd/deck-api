import { z } from 'zod'
import { errorResponseSchema, zodErrorSchema } from '../common.ts'

const publishProjectBodySchema = z.object({
  title: z
    .string({
      description: 'Project title.',
    })
    .min(3, {
      message: 'Title must have at least 3 characters.',
    }),
  description: z.string({
    description: 'Project description.',
  }),
  bannerUrl: z
    .string({
      description: 'Project banner url.',
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
    })
    .min(2000)
    .max(new Date().getFullYear()),
  status: z.enum(['DRAFT', 'PUBLISHED'], {
    description: 'Project status.',
  }),
  semester: z
    .number({
      description: 'Project semester.',
    })
    .min(1)
    .max(12),
  allowComments: z.boolean({
    description: 'Project allow comments.',
  }),
  authorId: z
    .string({
      description: 'Project author id.',
    })
    .uuid({
      message: 'Author id must be a valid UUID.',
    }),
  subjectId: z.string({
    description: 'Project subject id.',
  }),
  trailsIds: z
    .array(
      z
        .string({
          description: 'Project trails ids.',
        })
        .uuid({
          message: 'Trail id must be a valid UUID.',
        }),
    )
    .optional(),
  professorsIds: z
    .array(
      z
        .string({
          description: 'Project professors ids.',
        })
        .uuid({
          message: 'Professor id must be a valid UUID.',
        }),
    )
    .optional(),
})

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
    404: errorResponseSchema,
  },
}

export type PublishProjectBodySchema = z.infer<
  typeof publishProjectBodySchema
>
