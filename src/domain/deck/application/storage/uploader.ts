export abstract class StorageUploader {
  abstract upload(
    image: Buffer,
    filename: string,
  ): Promise<{
    downloadUrl: string
  }>
}
