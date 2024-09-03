export interface Encrypter {
  hash: (data: string) => Promise<string>
  compare: (data: string, encryptedData: string) => Promise<boolean>
}
