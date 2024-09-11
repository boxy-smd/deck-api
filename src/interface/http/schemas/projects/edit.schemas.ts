import { z } from 'zod'

import { errorResponseSchema, zodErrorSchema } from '../common.ts'

const editProjectBodySchema = z.object(
  {
    authorId: z
      .string({
        description: 'Project author id.',
        required_error: 'Author id is required.',
      })
      .uuid('Invalid author id.'),
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
      .uuid('Invalid subject id.')
      .optional(),
    trailsIds: z
      .array(
        z
          .string({
            description: 'Project trail id.',
            required_error: 'Trail id is required.',
          })
          .uuid('Invalid trail id.'),
        {
          description: 'Project trails ids.',
          required_error: 'Trails ids are required.',
        },
      )
      .optional(),
    professorsIds: z
      .array(
        z
          .string({
            description: 'Project professor id.',
          })
          .uuid('Invalid professor id.'),
        {
          description: 'Project professors ids.',
        },
      )
      .optional(),
  },
  {
    description: 'Project edit body.',
    required_error: 'Body is required.',
    invalid_type_error: 'Body must be an object.',
  },
)

const editProjectParamsSchema = z.object(
  {
    projectId: z.string({
      description: 'Project id.',
      invalid_type_error: 'Project id must be a string.',
      required_error: 'Project id is required.',
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
  params: editProjectParamsSchema,
  response: {
    201: editProjectResponseSchema,
    400: zodErrorSchema,
    404: errorResponseSchema,
  },
}

export type EditProjectBody = z.infer<typeof editProjectBodySchema>
export type EditProjectParams = z.infer<typeof editProjectParamsSchema>
export type EditProjectResponse = z.infer<typeof editProjectResponseSchema>
