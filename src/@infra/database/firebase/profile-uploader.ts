import { profilesRef } from '@/@infra/config/services/firebase'
import { FirebaseStorageUploader } from './storage-uploader'

export class FirebaseProfileUploader extends FirebaseStorageUploader {
  constructor() {
    super(profilesRef)
  }
}
