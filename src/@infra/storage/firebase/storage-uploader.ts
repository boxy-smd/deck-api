import type { StorageReference } from 'firebase/storage'
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage'

import type { StorageUploader } from '@/@core/application/users/storage/uploader'

export class FirebaseStorageUploader implements StorageUploader {
  constructor(private readonly storageRef: StorageReference) {}

  async upload(
    image: Buffer,
    filename: string,
  ): Promise<{ downloadUrl: string }> {
    const imageReference = ref(this.storageRef, filename)

    await uploadBytes(imageReference, image)

    const downloadUrl = await getDownloadURL(imageReference)

    return {
      downloadUrl,
    }
  }
}
