import {
  type StorageReference,
  getDownloadURL,
  ref,
  uploadBytes,
} from 'firebase/storage'

interface UploadImageToStorageProps {
  reference: StorageReference
  image: Buffer
  filename: string
}

export async function uploadImageToStorage({
  reference,
  image,
  filename,
}: UploadImageToStorageProps) {
  const imageReference = ref(reference, filename)

  await uploadBytes(imageReference, image)

  const downloadUrl = await getDownloadURL(imageReference)

  return {
    downloadUrl,
  }
}
