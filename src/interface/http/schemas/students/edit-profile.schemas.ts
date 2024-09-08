import { z } from 'zod'

import { zodErrorSchema } from '../common.ts'

const editProfileBodySchema = z.object({
  name: z
    .string({
      description: 'Student name.',
    })
    .optional(),
  about: z
    .string({
      description: 'Student about.',
    })
    .optional(),
  semester: z
    .number({
      description: 'Student semester.',
    })
    .optional(),
  profileUrl: z
    .string({
      description: 'Student profile url.',
    })
    .url('Invalid url.')
    .optional(),
  trailsIds: z
    .array(
      z.string({
        description: 'Trail id.',
      }),
    )
    .optional(),
})

const editProfileParamsSchema = z.object({
  id: z
    .string({
      description: 'Student id.',
      message: 'Student id is required.',
    })
    .uuid('Invalid id.'),
})

const editProfileResponseSchema = z.object(
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
            createdAt: z.date({
              description: 'Project created at.',
            }),
            updatedAt: z.date({
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
    description: 'Student profile updated successfully.',
  },
)

export const editProfileSchemas = {
  summary: 'Edit profile',
  tags: ['Students'],
  body: editProfileBodySchema,
  params: editProfileParamsSchema,
  response: {
    200: editProfileResponseSchema,
    400: zodErrorSchema,
  },
}

export type EditProfileBody = z.infer<typeof editProfileSchemas.body>
export type EditProfileParams = z.infer<typeof editProfileSchemas.params>
