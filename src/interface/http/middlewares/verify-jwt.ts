import type { FastifyReply, FastifyRequest } from 'fastify'

export type ProtectedRoute = (
  request: FastifyRequest,
  reply: FastifyReply,
) => Promise<never>

export async function verifyJWT(request: FastifyRequest, reply: FastifyReply) {
  try {
    await request.jwtVerify()
  } catch (_) {
    reply.status(401).send({
      message: 'Unauthorized.',
    })
  }
}
