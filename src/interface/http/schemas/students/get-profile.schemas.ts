import { z } from 'zod'

import { zodErrorSchema } from '../common.ts'

const getProfileParamsSchema = z.object({
  id: z
    .string({
      description: 'Student id.',
      required_error: 'Student id is required.',
    })
    .uuid('Invalid id.'),
})

const getProfileResponseSchema = z.object(
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
          description: z.string(),
          bannerUrl: z.string(),
          content: z.string(),
          publishedYear: z.number(),
          semester: z.number(),
          createdAt: z.string(),
          updatedAt: z.string(),
          subject: z.string(),
          trails: z.array(z.string()),
          professors: z.array(z.string()),
        }),
      ),
    }),
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
