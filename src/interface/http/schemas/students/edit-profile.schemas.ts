import { z } from 'zod'

import { zodErrorSchema } from '../common.ts'

const editProfileBodySchema = z.object({
  name: z.string({
    description: 'Student name.',
  }),
  about: z.string({
    description: 'Student about.',
  }),
  semester: z.number({
    description: 'Student semester.',
  }),
  profileUrl: z
    .string({
      description: 'Student profile url.',
    })
    .url('Invalid url.'),
  trailsIds: z.array(
    z.string({
      description: 'Trail id.',
    }),
  ),
})

const editProfileParamsSchema = z.object({
  id: z
    .string({
      description: 'Student id.',
    })
    .uuid('Invalid id.'),
})

const editProfileResponseSchema = z.object(
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
