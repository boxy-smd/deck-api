import { z } from 'zod'
import { zodErrorSchema } from '../common.ts'

const getProfileParamsSchema = z.object({
  id: z
    .string({
      description: 'Student id.',
      message: 'Student id is required.',
    })
    .uuid('Invalid id.'),
})

const getProfileResponseSchema = z.object(
  {
    profile: z.object(
      {
        id: z.string({
          description: 'Student id.',
        }),
        name: z.string({
          description: 'Student name.',
        }),
        username: z.string({
          description: 'Student username.',
        }),
        semester: z.number({
          description: 'Student semester.',
        }),
        about: z.string({
          description: 'Student about.',
        }),
        profileUrl: z.string({
          description: 'Student profile url.',
        }),
        trails: z.array(
          z.string({
            description: 'Trail name.',
          }),
        ),
        projects: z.array(
          z.object({
            id: z.string({
              description: 'Project id.',
            }),
            title: z.string({
              description: 'Project title.',
            }),
            description: z.string({
              description: 'Project description.',
            }),
            bannerUrl: z.string({
              description: 'Project banner url.',
            }),
            content: z.string({
              description: 'Project content.',
            }),
            publishedYear: z.number({
              description: 'Project published year.',
            }),
            semester: z.number({
              description: 'Project semester.',
            }),
            createdAt: z.string({
              description: 'Project created at.',
            }),
            updatedAt: z.string({
              description: 'Project updated at.',
            }),
            subject: z.string({
              description: 'Project subject.',
            }),
            trails: z.array(
              z.string({
                description: 'Trail name.',
              }),
            ),
            professors: z.array(
              z.string({
                description: 'Professor name.',
              }),
            ),
          }),
        ),
      },
      {
        description: 'Student profile.',
      },
    ),
  },
  {
    description: 'Student profile get successfully.',
  },
)

export const getProfileSchemas = {
  summary: 'Get profile',
  tags: ['Students'],
  params: getProfileParamsSchema,
  response: {
    200: getProfileResponseSchema,
    400: zodErrorSchema,
  },
}

export type GetProfileParams = z.infer<typeof getProfileSchemas.params>
