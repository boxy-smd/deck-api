import type { FastifyReply, FastifyRequest } from 'fastify'

import { profilesRef } from '@/infra/config/services/firebase.ts'
import { uploadImageToStorage } from '@/infra/database/firebase/upload-image-to-storage.ts'
import type { UpdateProfileImageParams } from '../../schemas/students/upload-profile-image.schemas.ts'

export async function uploadProfileImage(
  request: FastifyRequest<{
    Params: UpdateProfileImageParams
  }>,
  reply: FastifyReply,
) {
  const { username } = request.params
  const profileImage = await request.file()

  if (!profileImage) {
    return reply.code(400).send({ error: 'No image provided.' })
  }

  const { mimetype } = profileImage

  const image = await profileImage.toBuffer()

  const { downloadUrl } = await uploadImageToStorage({
    reference: profilesRef,
    filename: `${username}.${mimetype.split('/')[1]}`,
    image,
  })

  return reply.code(201).send({
    url: downloadUrl,
  })
}
