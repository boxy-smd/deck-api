export abstract class StorageUploader {
  abstract upload(
    image: Buffer,
    path: string,
  ): Promise<{
    downloadUrl: string
  }>
}
