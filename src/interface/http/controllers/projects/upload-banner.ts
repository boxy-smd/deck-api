import { makeUploadProjectBannerUseCase } from '@/interface/factories/projects/make-upload-project-banner-use-case'
import type { FastifyReply, FastifyRequest } from 'fastify'
import type { UpdateBannerParams } from '../../schemas/projects/upload-banner.schemas'

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

  const uploadProjectBannerUseCase = makeUploadProjectBannerUseCase()

  const { mimetype } = bannerImage

  const image = await bannerImage.toBuffer()

  await uploadProjectBannerUseCase.execute({
    filename: `${projectId}.${mimetype.split('/')[1]}`,
    image,
    projectId,
  })

  return reply.code(201).send({
    message: 'Banner uploaded successfully.',
  })
}
