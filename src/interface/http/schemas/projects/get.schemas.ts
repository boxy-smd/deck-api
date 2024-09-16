import { z } from 'zod'

import { errorResponseSchema, zodErrorSchema } from '../common.schemas.ts'

const getProjectParamsSchema = z.object(
  {
    projectId: z
      .string({
        description: 'Project id.',
        invalid_type_error: 'Project id must be a string.',
        required_error: 'Project id is required.',
      })
      .uuid('Invalid project id.'),
  },
  {
    description: 'Project id.',
  },
)

const getProjectResponseSchema = z.object(
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
      author: z.object({
        name: z.string(),
        username: z.string(),
        profileUrl: z.string().optional(),
      }),
      createdAt: z.date(),
      updatedAt: z.date().optional(),
      subjectId: z.string().optional(),
      subject: z.string().optional(),
      trails: z.array(z.string()),
      professors: z.array(z.string()).optional(),
      comments: z.array(
        z.object({
          id: z.string(),
          content: z.string(),
          createdAt: z.date(),
          updatedAt: z.date().optional(),
          author: z.object({
            name: z.string(),
            username: z.string(),
            profileUrl: z.string().url().optional(),
          }),
          authorId: z.string().uuid(),
        }),
      ),
    }),
  },
  {
    description: 'Project get successfully.',
  },
)

export const getProjectSchemas = {
  summary: 'Get a project',
  tags: ['Projects'],
  params: getProjectParamsSchema,
  response: {
    200: getProjectResponseSchema,
    400: zodErrorSchema,
    404: errorResponseSchema,
  },
}

export type GetProjectParams = z.infer<typeof getProjectParamsSchema>
