import { z } from 'zod'

import { errorResponseSchema, zodErrorSchema } from '../common.schemas.ts'

const editProfileParamsSchema = z.object({
  studentId: z
    .string({
      description: 'Student id.',
      invalid_type_error: 'Student id must be a string.',
      message: 'Student id is required.',
    })
    .uuid('Invalid id.'),
})

const editProfileBodySchema = z.object(
  {
    about: z
      .string({
        description: 'Student about.',
        invalid_type_error: 'About must be a string.',
      })
      .optional(),
    semester: z
      .number({
        description: 'Student semester.',
        invalid_type_error: 'Semester must be a number.',
      })
      .optional(),
    profileUrl: z
      .string({
        description: 'Student profile url.',
        invalid_type_error: 'Profile url must be a string.',
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
  },
  {
    description: 'Student edit profile body.',
    required_error: 'Body is required.',
    invalid_type_error: 'Body must be an object.',
  },
)

const editProfileResponseSchema = z.object(
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
    403: errorResponseSchema,
    404: errorResponseSchema,
  },
}

export type EditProfileBody = z.infer<typeof editProfileSchemas.body>
export type EditProfileParams = z.infer<typeof editProfileSchemas.params>
