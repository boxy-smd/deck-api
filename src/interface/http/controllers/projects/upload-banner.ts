import type { FastifyReply, FastifyRequest } from 'fastify'

import { bannersRef } from '@/infra/config/services/firebase.ts'
import { uploadImageToStorage } from '@/infra/database/firebase/upload-image-to-storage.ts'
import type { UpdateBannerParams } from '../../schemas/projects/upload-banner.schemas.ts'

export async function uploadBanner(
  request: FastifyRequest<{
    Params: UpdateBannerParams
  }>,
  reply: FastifyReply,
) {
  const { projectId } = request.params
  const bannerImage = await request.file()

  if (!bannerImage) {
    return reply.code(400).send({ error: 'No image provided.' })
  }

  const { mimetype } = bannerImage

  const image = await bannerImage.toBuffer()

  const { downloadUrl } = await uploadImageToStorage({
    reference: bannersRef,
    filename: `${projectId}.${mimetype.split('/')[1]}`,
    image,
  })

  return reply.code(201).send({
    url: downloadUrl,
  })
}
