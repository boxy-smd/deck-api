import { z } from 'zod'

import { errorResponseSchema, zodErrorSchema } from '../common.schemas.ts'

const registerBodySchema = z.object(
  {
    name: z.string({
      description: 'Student name.',
      required_error: 'Name is required.',
    }),
    username: z
      .string({
        description: 'Student username.',
        required_error: 'Username is required.',
      })
      .min(3, 'Username must have at least 3 characters.'),
    email: z
      .string({
        description: 'Student email.',
        required_error: 'Email is required.',
      })
      .email('Invalid email.')
      .regex(/@alu.ufc.br$/, 'Invalid email. Must be an academic email.'),
    password: z
      .string({
        description: 'Student password.',
        required_error: 'Password is required.',
      })
      .min(6, 'Password must have at least 6 characters.'),
    semester: z
      .number({
        description: 'Student semester.',
        required_error: 'Semester is required.',
      })
      .int()
      .min(1, 'Invalid semester.')
      .max(12, 'Invalid semester.'),
    trailsIds: z.array(
      z
        .string({
          description: 'Trail id.',
        })
        .uuid('Invalid trail id.'),
      {
        description: 'Trails ids.',
        required_error: 'Trails ids is required.',
      },
    ),
    about: z
      .string({
        description: 'Student about.',
      })
      .optional(),
    profileUrl: z
      .string({
        description: 'Student profile url.',
      })
      .optional(),
  },
  {
    description: 'Student register body.',
    required_error: 'Body is required.',
    invalid_type_error: 'Body must be an object.',
  },
)

const registerResponseSchema = z.object(
  {
    user_id: z.string(),
  },
  {
    description: 'Student registered successfully.',
  },
)

export const registerSchemas = {
  summary: 'Register',
  tags: ['Students'],
  body: registerBodySchema,
  response: {
    201: registerResponseSchema,
    400: zodErrorSchema,
    404: errorResponseSchema,
    409: errorResponseSchema,
  },
}

export type RegisterBody = z.infer<typeof registerSchemas.body>
