import { z } from 'zod'

import { errorResponseSchema, zodErrorSchema } from '../common.schemas.ts'

const getProfileParamsSchema = z.object({
  username: z.string({
    description: 'Student username.',
    invalid_type_error: 'Student username must be a string.',
    required_error: 'Student username is required.',
  }),
})

const getProfileResponseSchema = z.object(
  {
    profile: z.object({
      id: z.string(),
      name: z.string(),
      username: z.string(),
      semester: z.number(),
      about: z.string().optional(),
      profileUrl: z.string().optional(),
      trails: z.array(z.string()),
      posts: z.array(
        z.object({
          id: z.string(),
          title: z.string(),
          description: z.string(),
          bannerUrl: z.string().optional(),
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
      drafts: z.array(
        z.object({
          id: z.string(),
          title: z.string(),
          bannerUrl: z.string().optional(),
          content: z.string().optional(),
          publishedYear: z.number().optional(),
          semester: z.number().optional(),
          createdAt: z.date().optional(),
          updatedAt: z.date().optional(),
          subjectId: z.string().optional(),
          trailsIds: z.array(z.string()).optional(),
          professorsIds: z.array(z.string()).optional(),
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
    404: errorResponseSchema,
  },
}

export type GetProfileParams = z.infer<typeof getProfileSchemas.params>
