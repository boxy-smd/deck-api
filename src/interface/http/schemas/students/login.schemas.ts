import { z } from 'zod'
import { zodErrorSchema } from '../common.ts'

const loginBodySchema = z.object({
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
})

const loginResponseSchema = z.object(
  {
    token: z.string({
      description: 'Student token.',
    }),
  },
  {
    description: 'Student logged in successfully.',
  },
)

export const loginSchemas = {
  summary: 'Login',
  tags: ['Students'],
  body: loginBodySchema,
  response: {
    200: loginResponseSchema,
    400: zodErrorSchema,
  },
}

export type LoginBodySchema = z.infer<typeof loginSchemas.body>
