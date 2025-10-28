import { getDownloadURL, ref, uploadBytes } from 'firebase/storage'

import { StorageUploader } from '@/domain/authentication/application/storage/uploader.ts'
import { profilesRef } from '@/infra/config/services/firebase.ts'

export class FirebaseProfileUploader extends StorageUploader {
  async upload(
    image: Buffer,
    filename: string,
  ): Promise<{ downloadUrl: string }> {
    const imageReference = ref(profilesRef, filename)

    await uploadBytes(imageReference, image)

    const downloadUrl = await getDownloadURL(imageReference)

    return {
      downloadUrl,
    }
  }
}
