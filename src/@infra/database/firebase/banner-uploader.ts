import { getDownloadURL, ref, uploadBytes } from 'firebase/storage'

import { StorageUploader } from '@/@core/domain/authentication/application/storage/uploader'
import { bannersRef } from '@/@infra/config/services/firebase'

export class FirebaseBannerUploader extends StorageUploader {
  async upload(
    image: Buffer,
    filename: string,
  ): Promise<{ downloadUrl: string }> {
    const imageReference = ref(bannersRef, filename)

    await uploadBytes(imageReference, image)

    const downloadUrl = await getDownloadURL(imageReference)

    return {
      downloadUrl,
    }
  }
}
