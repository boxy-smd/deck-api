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
    profile: z.object({
      id: z.string(),
      name: z.string(),
      username: z.string(),
      semester: z.number(),
      about: z.string(),
      profileUrl: z.string(),
      trails: z.array(z.string()),
      projects: z.array(
        z.object({
          id: z.string(),
          title: z.string(),
          bannerUrl: z.string(),
          content: z.string(),
          publishedYear: z.number(),
          semester: z.number(),
          createdAt: z.date(),
          updatedAt: z.date(),
          subject: z.string(),
          trails: z.array(z.string()),
          professors: z.array(z.string()),
        }),
      ),
    }),
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
