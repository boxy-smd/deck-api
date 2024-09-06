import { z } from 'zod'
import { errorResponseSchema, zodErrorSchema } from '../common.ts'

const registerBodySchema = z.object({
  name: z.string({
    description: 'Student name.',
  }),
  username: z
    .string({
      description: 'Student username.',
    })
    .min(3, 'Username must have at least 3 characters.'),
  email: z
    .string({
      description: 'Student email.',
    })
    .email('Invalid email.')
    .regex(/@alu.ufc.br$/, 'Invalid email. Must be an academic email.'),
  password: z
    .string({
      description: 'Student password.',
    })
    .min(6, 'Password must have at least 6 characters.'),
  semester: z
    .number({
      description: 'Student semester.',
    })
    .int()
    .min(1, 'Invalid semester.')
    .max(12, 'Invalid semester.'),
  trailsIds: z.array(
    z
      .string({
        description: 'Trails ids.',
      })
      .uuid('Invalid trail id. Must be a valid uuid v4 format.'),
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
    .url()
    .optional(),
})

const registerResponseSchema = z.object(
  {
    user_id: z.string({
      description: 'Student id.',
    }),
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
    409: errorResponseSchema,
  },
}

export type RegisterBody = z.infer<typeof registerSchemas.body>
