import { getDownloadURL, ref, uploadBytes } from 'firebase/storage'

import { StorageUploader } from '@/domain/deck/application/storage/uploader.ts'
import { bannersRef } from '@/infra/config/services/firebase.ts'

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
