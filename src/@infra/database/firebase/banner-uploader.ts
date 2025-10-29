import { bannersRef } from '@/@infra/config/services/firebase'
import { FirebaseStorageUploader } from './storage-uploader'

export class FirebaseBannerUploader extends FirebaseStorageUploader {
  constructor() {
    super(bannersRef)
  }
}
