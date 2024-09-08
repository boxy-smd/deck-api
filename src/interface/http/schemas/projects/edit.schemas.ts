import { z } from 'zod'
import { errorResponseSchema, zodErrorSchema } from '../common.ts'

const editProjectBodySchema = z.object({
  authorId: z
    .string({
      description: 'Project author id.',
    })
    .uuid({
      message: 'Author id must be a valid UUID.',
    }),
  title: z
    .string({
      description: 'Project title.',
    })
    .min(3, {
      message: 'Title must have at least 3 characters.',
    })
    .optional(),
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
  status: z
    .enum(['DRAFT', 'PUBLISHED'], {
      description: 'Project status.',
    })
    .optional(),
  semester: z
    .number({
      description: 'Project semester.',
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
    .uuid({
      message: 'Subject id must be a valid UUID.',
    })
    .optional(),
  trailsIds: z
    .array(
      z
        .string({
          description: 'Project trails ids.',
          message: 'Trail id is required.',
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

const editProjectParamsSchemas = z.object(
  {
    projectId: z.string({
      description: 'Project id.',
      message: 'Invalid project id.',
    }),
  },
  {
    description: 'Project id.',
  },
)

const editProjectResponseSchema = z.object(
  {
    project: z.object({
      id: z.string(),
      title: z.string(),
      description: z.string(),
      bannerUrl: z.string(),
      content: z.string().optional(),
      publishedYear: z.number(),
      status: z.enum(['DRAFT', 'PUBLISHED']),
      semester: z.number(),
      allowComments: z.boolean(),
      authorId: z.string(),
      subjectId: z.string().optional(),
      trailsIds: z.array(z.string()),
      professorsIds: z.array(z.string()).optional(),
    }),
  },
  {
    description: 'Project edited successfully.',
  },
)

export const editProjectSchemas = {
  summary: 'Edit a project',
  tags: ['Projects'],
  body: editProjectBodySchema,
  params: editProjectParamsSchemas,
  response: {
    201: editProjectResponseSchema,
    400: zodErrorSchema,
    404: errorResponseSchema,
  },
}

export type EditProjectBody = z.infer<typeof editProjectBodySchema>
export type EditProjectParams = z.infer<typeof editProjectParamsSchemas>
export type EditProjectResponse = z.infer<typeof editProjectResponseSchema>
