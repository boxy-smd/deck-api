import { z } from 'zod'
import { zodErrorSchema } from '../common.ts'

const loginBodySchema = z.object({
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
})

const loginResponseSchema = z.object(
  {
    token: z.string({
      description: 'User token.',
    }),
  },
  {
    description: 'User logged in successfully.',
  },
)

export const loginSchemas = {
  summary: 'Login',
  tags: ['Users'],
  body: loginBodySchema,
  response: {
    200: loginResponseSchema,
    400: zodErrorSchema,
  },
}

export type LoginBodySchema = z.infer<typeof loginSchemas.body>
