import { z } from 'zod'

import { zodErrorSchema } from '../common.ts'

const uploadProfileImageParamsSchema = z.object({
  username: z
    .string({
      description: 'Student username.',
      required_error: 'Username is required.',
    })
    .min(3, 'Username must have at least 3 characters.'),
})

const uploadProfileImageResponseSchema = z.object(
  {
    profileUrl: z.string(),
  },
  {
    description: 'Profile image uploaded successfully.',
  },
)

export const uploadProfileImageSchemas = {
  summary: 'Update profile image',
  tags: ['Students'],
  params: uploadProfileImageParamsSchema,
  response: {
    200: uploadProfileImageResponseSchema,
    400: zodErrorSchema,
  },
}

export type UpdateProfileImageParams = z.infer<
  typeof uploadProfileImageSchemas.params
>
