import type { FirebaseService } from './firebase.service'
import { FirebaseStorageUploader } from './storage-uploader'

export class FirebaseBannerUploader extends FirebaseStorageUploader {
  constructor(firebaseService: FirebaseService) {
    super(firebaseService.getBannersRef())
  }
}
