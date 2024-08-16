import { z } from 'zod'
import { errorResponseSchema, zodErrorSchema } from '../common.ts'

const registerBodySchema = z.object({
  name: z.string({
    description: 'User name.',
  }),
  username: z
    .string({
      description: 'User username.',
    })
    .min(3, 'Username must have at least 3 characters.'),
  email: z
    .string({
      description: 'User email.',
    })
    .email('Invalid email.')
    .regex(/@alu.ufc.br$/, 'Invalid email. Must be an academic email.'),
  password: z
    .string({
      description: 'User password.',
    })
    .min(6, 'Password must have at least 6 characters.'),
  semester: z
    .number({
      description: 'User semester.',
    })
    .int()
    .min(1, 'Invalid semester.')
    .max(12, 'Invalid semester.'),
})

const registerResponseSchema = z.object(
  {
    user_id: z.string({
      description: 'User id.',
    }),
  },
  {
    description: 'User registered successfully.',
  },
)

export const registerSchemas = {
  summary: 'Register',
  tags: ['users'],
  body: registerBodySchema,
  response: {
    201: registerResponseSchema,
    400: zodErrorSchema,
    409: errorResponseSchema,
  },
}

export type RegisterBodySchema = z.infer<typeof registerSchemas.body>
