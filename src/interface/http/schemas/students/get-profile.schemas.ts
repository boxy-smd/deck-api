import { z } from 'zod'
import { zodErrorSchema } from '../common.ts'

const getProfileParamsSchema = z.object({
  id: z
    .string({
      description: 'Student id.',
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
        trailsIds: z.array(
          z.string({
            description: 'Trail id.',
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
